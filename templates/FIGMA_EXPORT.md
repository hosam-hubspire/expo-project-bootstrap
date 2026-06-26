# Figma export (MCP)

How to move design tokens and icons from a Figma file into this project during bootstrap or when syncing later.

**Run design tokens (Phase B) and icons (Phase C) as separate phases** — different payload sizes, checkpoints, and tooling. Do not bundle them with scaffold or with each other.

## Critical rule: MCP ≠ export

`use_figma` returns JSON to the agent. **Nothing is written to disk automatically.** A successful MCP response in chat does **not** mean export is done.

After **every** MCP call:

1. Write the payload to a temp file (e.g. `/tmp/color-tokens.json`) if the agent cannot pass it inline.
2. Run `scripts/persist-figma-export.mjs` immediately.
3. Verify the target path on disk (variable count, mode names, or SVG count) before the next MCP call.

Large combined responses **truncate** (~20KB). Export **one variable collection per** `use_figma` call; export icons in batches of ~20–25 SVGs.

## Phases overview

| Phase | Scope | Prerequisite | Gate |
|-------|--------|--------------|------|
| **A — Scaffold** | Templates, `bun install` | — | `bun install` exit 0 |
| **B — Design tokens** | Raw JSON under `src/theme/tokens/raw/` | Phase A; design-system URL | Counts + modes on disk; `tokens:generate` log |
| **C — Icons** | SVGs + font/glyphmap | Phase A; icons URL; `react-native-nano-icons` installed | SVG count = inventory; `.ttf` + `.glyphmap.json` regenerated |
| **D — Verify** | lint, test, tsc, device | Applicable phases complete | CI checks pass |

Phase C may run after Phase B, or after Phase A only when no design-system URL was provided.

## Which Figma MCP tool to use

| Tool | Use for |
|------|---------|
| **`use_figma`** (Plugin API) | **Primary.** List variable collections, export collection JSON, export text styles, export icon SVGs from a frame |
| `get_metadata` | Structure inventory (node IDs, layer names) — use before Phase C to count icons |
| `download_assets` | Single-node SVG/PNG when you only need one asset |

**Avoid for variable export:** `get_variable_defs`, `get_design_context`, and `search_design_system` (variables) — they often return empty or require a selected layer in the Figma desktop app.

Do not add one-off scripts (`save-figma-*.mjs`, `save-json.mjs`, `flush-*`, icon manifests, batch importers, etc.). Use `scripts/persist-figma-export.mjs` only. Write each MCP payload to `/tmp` (Write tool or shell), then persist — **never** add bridge scripts under `scripts/` in the project.

## STRICT — agent compliance

Agents **must** follow this loop with no substitutions:

1. `use_figma` (one collection / text-styles / icon batch)
2. Write JSON to `/tmp/<file>.json`
3. `node scripts/persist-figma-export.mjs …`
4. Verify on disk (counts, modes, or SVG total)
5. Only then — next `use_figma` call or next phase

**Violations (do not do):** inventing `scripts/save-*.mjs` or similar; delegating export to a Task/subagent; skipping persist because JSON is large; marking Phase B/C complete while stub files remain.

---

## Phase B — Design tokens

### B1 — Discover (before exporting)

```javascript
const collections = await figma.variables.getLocalVariableCollectionsAsync();
return collections.map((c) => ({
  name: c.name,
  modes: c.modes.map((m) => m.name),
  variableCount: c.variableIds.length,
}));
```

Record **expected** mode names and variable counts per collection. Update `scripts/generate-design-tokens.mjs` (`LIGHT_MODE`, `DARK_MODE`, size/typography modes) from this inventory — not from template stub files.

Template raw JSON under `src/theme/tokens/raw/` is **illustrative only** (small counts, sample mode names like `Dark` / `Default`). Replace entirely during Phase B.

### B2 — Export one collection per MCP call

Map each Figma collection to a raw file (adjust `RAW_FILES` in `generate-design-tokens.mjs` when names differ):

| Typical Figma collection | Raw file |
|--------------------------|----------|
| Semantic / color tokens | `color-tokens.json` |
| Color primitives | `color-primitives.json` |
| Size / spacing tokens | `size-tokens.json` |
| Size primitives | `size-primitives.json` |
| Typography tokens | `typography-tokens.json` |
| Typography primitives | `typography-primitives.json` |
| Text styles (`getLocalTextStylesAsync`) | `text-styles.json` |

Export helper (run inside `use_figma` — **one collection name per call**):

```javascript
async function resolveValue(v, modeId) {
  const val = v.valuesByMode[modeId];
  if (!val) return null;
  if (val.type === "VARIABLE_ALIAS") {
    const aliased = await figma.variables.getVariableByIdAsync(val.id);
    if (!aliased) return null;
    const firstMode = Object.keys(aliased.valuesByMode)[0];
    return resolveValue(aliased, firstMode);
  }
  if (v.resolvedType === "COLOR") {
    const c = val;
    const r = Math.round(c.r * 255);
    const g = Math.round(c.g * 255);
    const b = Math.round(c.b * 255);
    const a = c.a ?? 1;
    if (a < 1) return `rgba(${r}, ${g}, ${b}, ${a.toFixed(2)})`;
    return `#${[r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
  }
  if (v.resolvedType === "FLOAT") return val;
  if (v.resolvedType === "STRING") return val;
  return val;
}

async function exportCollection(collectionName) {
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const collection = collections.find((c) => c.name === collectionName);
  if (!collection) return { error: `Collection not found: ${collectionName}` };

  const modes = collection.modes.map((m) => m.name);
  const variables = [];
  for (const varId of collection.variableIds) {
    const v = await figma.variables.getVariableByIdAsync(varId);
    const values = {};
    for (const mode of collection.modes) {
      values[mode.name] = await resolveValue(v, mode.modeId);
    }
    variables.push({ name: v.name, type: v.resolvedType, values });
  }
  variables.sort((a, b) => a.name.localeCompare(b.name));
  return { collection: collection.name, modes, variables };
}

// Example: return await exportCollection("Color Tokens");
```

Text styles — separate MCP call:

```javascript
const textStyles = await figma.getLocalTextStylesAsync();
// map to { name, fontFamily, fontStyle, fontSize, lineHeight, letterSpacing, ... }
return textStyles;
```

### B3 — Persist after each call

```bash
node scripts/persist-figma-export.mjs token color-tokens.json /tmp/color-tokens.json
node scripts/persist-figma-export.mjs text-styles /tmp/text-styles.json
```

### B4 — Token gate (before Phase C or commit)

- [ ] Each raw file exists and `variables.length` (or text style count) matches B1 inventory
- [ ] `modes` in each JSON match constants in `generate-design-tokens.mjs`
- [ ] `bun run tokens:generate` logs this project's mode names and counts — **not** stub sample counts

Quick disk check (example):

```bash
node -e "const d=require('./src/theme/tokens/raw/color-tokens.json'); console.log(d.modes, d.variables.length)"
```

---

## Phase C — Icons

Run only after Phase A succeeds and Phase B passes when a design-system URL was provided.

### C1 — Inventory

Use `get_metadata` on the icons frame URL. List `COMPONENT` children; deduplicate logical icons (one name per glyph). Record total **N**.

Deduplication rules:

- Size variants (16, 20, 24, …) → same icon (`size` prop on `Icon`)
- Light/dark or fill variants → same icon (`color` / `colorToken` props)
- Different shapes (outline vs solid, chevron-left vs chevron-right) → separate icons
- Filenames: kebab-case, no size or theme in the name (`home.svg`, not `home-24-dark.svg`)

### C2 — Export in batches

~20–25 icons per `use_figma` call:

```javascript
function normalizeSvg(svg) {
  return svg
    .replace(/ fill="(?!none|currentColor)[^"]+"/g, ' fill="currentColor"')
    .replace(/ stroke="(?!none|currentColor)[^"]+"/g, ' stroke="currentColor"');
}

const frame = await figma.getNodeByIdAsync("NODE_ID");
const components = frame.children.filter((c) => c.type === "COMPONENT");
const slice = components.slice(START, END);
const icons = [];
for (const child of slice) {
  const bytes = await child.exportAsync({ format: "SVG" });
  let svg = "";
  for (let i = 0; i < bytes.length; i++) svg += String.fromCharCode(bytes[i]);
  icons.push({ name: child.name, svg: normalizeSvg(svg) });
}
return icons;
```

### C3 — Persist each batch immediately

```bash
node scripts/persist-figma-export.mjs icons /tmp/icons-batch-1.json
node scripts/persist-figma-export.mjs icons /tmp/icons-batch-2.json
# …
```

### C4 — Regenerate font

| Context | Command |
|---------|---------|
| **Bootstrap / CI before prebuild** | Copy `assets/icons/.nanoicons.json.example` → `assets/icons/.nanoicons.json`, then `bun run icons:generate` |
| **Expo prebuild / dev client** | `react-native-nano-icons` Expo config plugin (`inputDir` / `outputDir` → `./assets/icons`) |

### C5 — Icon gate (before commit)

- [ ] `ls assets/icons/*.svg | wc -l` equals inventory **N** from C1
- [ ] `.ttf` and `.glyphmap.json` regenerated after the last SVG batch
- [ ] No template placeholder SVGs left unless icons were explicitly out of scope

---

## If export is blocked

Scaffold with template sample raw JSON so CI passes, copy `templates/TOKENS.md` to the project root, and document what remains (file key, collection names, mode map, icon inventory, completed phases). **Do not** mark Phase B or C complete in the bootstrap summary.
