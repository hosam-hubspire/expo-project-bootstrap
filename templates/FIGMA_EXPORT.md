# Figma export (MCP) — Phase B: design tokens

Move design tokens from Figma into `src/theme/tokens/raw/`.

Run Phase B **after** scaffold + `bun install`. Icons are exported from Figma separately and added to `assets/icons/` manually — see `templates/README.md` **Icons**.

## Critical rule: MCP ≠ export

`use_figma` returns JSON to the agent. **Nothing is written to disk automatically.**

After **every** MCP call:

1. Write payload to `/tmp/<name>.json`
2. Run `scripts/persist-figma-export.mjs`
3. Verify counts/modes on disk before the next call

Large responses truncate (~20KB). Export **one variable collection per** `use_figma` call.

**Forbidden:** bridge scripts under `scripts/`; delegating token export to subagents; marking Phase B complete while stub files remain.

## Phase overview

Aligns with bootstrap phases A–C. Commit/push is bootstrap **Phase D** (not listed here).

| Phase | Scope | Gate |
|-------|--------|------|
| **A — Scaffold** | Templates, install | `bun install` exit 0 |
| **B — Tokens** | Raw JSON in `src/theme/tokens/raw/` | Counts + modes match Figma; `tokens:generate` log |
| **C — Verify** | lint, test, tsc | CI passes |

## Which MCP tool to use

| Tool | Use for |
|------|---------|
| **`use_figma`** (Plugin API) | List collections, export collection JSON, export text styles |

**Avoid for variables:** `get_variable_defs`, `get_design_context`, `search_design_system`.

## Agent loop (per collection)

```
use_figma (one collection) → write /tmp/<file>.json → persist → verify → next
```

```bash
node scripts/persist-figma-export.mjs token color-tokens.json /tmp/color-tokens.json
node scripts/persist-figma-export.mjs text-styles /tmp/text-styles.json
node -e "const d=require('./src/theme/tokens/raw/color-tokens.json'); console.log(d.modes, d.variables.length)"
```

---

## B1 — Discover (before exporting)

```javascript
const collections = await figma.variables.getLocalVariableCollectionsAsync();
return collections.map((c) => ({
  name: c.name,
  modes: c.modes.map((m) => m.name),
  variableCount: c.variableIds.length,
}));
```

Record expected mode names and counts from your Figma file. Update `LIGHT_MODE`, `DARK_MODE`, and size/typography constants in `scripts/generate-design-tokens.mjs` to match **your export** — these are discovered during Phase B, not fixed template defaults.

Template raw JSON is **placeholder only** (~small counts). Replace entirely during Phase B.

## B2 — Export one collection per MCP call

| Typical Figma collection | Raw file |
|--------------------------|----------|
| Semantic / color tokens | `color-tokens.json` |
| Color primitives | `color-primitives.json` |
| Size / spacing tokens | `size-tokens.json` |
| Size primitives | `size-primitives.json` |
| Typography tokens | `typography-tokens.json` |
| Typography primitives | `typography-primitives.json` |
| Text styles | `text-styles.json` |

Export helper (inside `use_figma` — **one collection name per call**):

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
```

Text styles — separate MCP call:

```javascript
const textStyles = await figma.getLocalTextStylesAsync();
return textStyles;
```

Adjust `RAW_FILES` in `generate-design-tokens.mjs` when collection filenames differ.

## B3 — Token gate (before verify or commit)

- [ ] Each raw file exists; counts match B1 inventory
- [ ] `modes` in JSON match generator constants
- [ ] `bun run tokens:generate` logs this project's modes and counts — not stub sample counts

## If export is blocked

Scaffold with template sample raw JSON and document what remains in the bootstrap completion summary (file key, collection map, pending phases). **Do not** mark Phase B complete in the bootstrap summary.
