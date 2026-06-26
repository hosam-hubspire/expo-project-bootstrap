# Figma export (MCP)

How to move design tokens and icons from a Figma file into this project during bootstrap or when syncing tokens later.

## Which Figma MCP tool to use

| Tool | Use for |
|------|---------|
| **`use_figma`** (Plugin API) | **Primary.** List variable collections, export collection JSON, export text styles, export icon SVGs from a frame |
| `get_metadata` | Structure inventory (node IDs, layer names) — useful to find the icons frame before export |
| `download_assets` | Single-node SVG/PNG when you only need one asset |

**Avoid for variable export:** `get_variable_defs`, `get_design_context`, and `search_design_system` (variables) — they often return empty or require a selected layer in the Figma desktop app. They are not a substitute for `use_figma`.

MCP returns data to the agent; **nothing is written to disk automatically.** Persist exports before running `tokens:generate` or continuing scaffold work.

## Checkpoint (before commit)

When Figma is in scope, verify on disk:

- [ ] All required raw JSON files exist under `src/theme/tokens/raw/` (see mapping below)
- [ ] Mode names in exports match `LIGHT_MODE`, `DARK_MODE`, and typography/size constants in `scripts/generate-design-tokens.mjs`
- [ ] `bun run tokens:generate` logs the expected collection modes and token counts (not stub sample counts)
- [ ] Icon SVG count matches the Figma inventory (when icons are in scope)
- [ ] `.ttf` and `.glyphmap.json` regenerated after SVG export (when icons are in scope)

Do not add one-off scripts (`save-figma-*.mjs`, icon manifests, etc.). Use `scripts/persist-figma-export.mjs` or direct writes to the paths below.

## Variable collections → raw files

Discover collections first:

```javascript
const collections = await figma.variables.getLocalVariableCollectionsAsync();
return collections.map((c) => ({
  name: c.name,
  modes: c.modes.map((m) => m.name),
  variableCount: c.variableIds.length,
}));
```

Map each Figma collection to a file under `src/theme/tokens/raw/` (adjust `RAW_FILES` in `generate-design-tokens.mjs` if your names differ):

| Typical Figma collection | Raw file |
|--------------------------|----------|
| Semantic / color tokens | `color-tokens.json` |
| Color primitives | `color-primitives.json` |
| Size / spacing tokens | `size-tokens.json` |
| Size primitives | `size-primitives.json` |
| Typography tokens | `typography-tokens.json` |
| Typography primitives | `typography-primitives.json` |
| Text styles (from `getLocalTextStylesAsync`) | `text-styles.json` |

### Export helper (run inside `use_figma`)

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

After each MCP call, persist immediately:

```bash
node scripts/persist-figma-export.mjs token color-tokens.json /tmp/color-tokens.json
```

### Configure generator mode names

Read `modes` from each exported JSON, then set in `scripts/generate-design-tokens.mjs`:

- `LIGHT_MODE` / `DARK_MODE` — semantic color modes (dark may be named `Dark`, a product theme, etc.; set `DARK_MODE = null` when there is no second mode)
- `SIZE_MODE_SM` / `SIZE_MODE_MD` / `SIZE_MODE_LG` — spacing/size breakpoint modes
- `TYPO_MODE_SM`, `TYPO_MODE_MD`, `TYPO_MODE_SM_MD`, `TYPO_MODE_LG` — typography breakpoint modes (some files use a combined `sm/md` mode)

Run `bun run tokens:generate` and confirm the “Resolved Figma modes” log matches the file.

## Icons → SVGs

1. Use `get_metadata` on the icons URL to list `COMPONENT` children and deduplicate logical icons (one SVG per name; size and color are `Icon` props).
2. Export in batches if the MCP response is large (e.g. 25–30 icons per `use_figma` call):

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

3. Persist:

```bash
node scripts/persist-figma-export.mjs icons /tmp/icons-batch-1.json
```

## Icon font regeneration

| Context | How to regenerate `.ttf` + `.glyphmap.json` |
|---------|-----------------------------------------------|
| **Expo app runtime / prebuild** | `react-native-nano-icons` Expo config plugin in `app.json` (`inputDir` / `outputDir` → `./assets/icons/app-icons`) |
| **Bootstrap / CI before prebuild** | Copy `assets/icons/app-icons/.nanoicons.json.example` → `.nanoicons.json`, then from project root: `bunx react-native-nano-icons --path ./assets/icons/app-icons` |

The Expo plugin path does not require `.nanoicons.json` at runtime; the CLI step during bootstrap does.

## If export is blocked

Scaffold with template sample raw JSON so CI passes, copy `templates/TOKENS.md` to the project root, and document what remains (file key, collection names, mode map, pending icons).
