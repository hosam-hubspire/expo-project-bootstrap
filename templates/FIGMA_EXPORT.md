# Figma export — Phase B

Run after scaffold + `bun install`. Copy this file into the new project when Figma is in scope.

Icons are exported separately to `assets/icons/` — see `templates/README.md`.

## Rule: MCP ≠ disk

`use_figma` returns JSON only. After **every** call:

1. Write payload to `/tmp/<name>.json`
2. `node scripts/persist-figma-export.mjs …`
3. Verify counts on disk before the next call

One variable collection per call (~20KB truncation limit). No bridge scripts under `scripts/`. No subagent delegation.

**Tool:** `use_figma` (Plugin API). Not `get_variable_defs`, `get_design_context`, or `search_design_system`.

## Loop

```
use_figma → /tmp/<file>.json → persist → verify → next collection
```

```bash
node scripts/persist-figma-export.mjs token color-tokens.json /tmp/color-tokens.json
node scripts/persist-figma-export.mjs text-styles /tmp/text-styles.json
node -e "const d=require('./src/theme/tokens/raw/color-tokens.json'); console.log(d.modes, d.variables.length)"
```

## B1 — Discover

In `use_figma`, call `listCollections()` from `scripts/figma-export-helpers.js`. Record mode names and counts. Update `LIGHT_MODE`, `DARK_MODE`, size/typography constants in `generate-design-tokens.mjs` to match your file. Template raw JSON is placeholder — replace entirely.

## B2 — Export

| Figma collection | Raw file |
|------------------|----------|
| Color tokens | `color-tokens.json` |
| Color primitives | `color-primitives.json` |
| Size tokens | `size-tokens.json` |
| Size primitives | `size-primitives.json` |
| Typography tokens | `typography-tokens.json` |
| Typography primitives | `typography-primitives.json` |
| Text styles | `text-styles.json` |

Per collection: `exportCollection("Collection Name")` from `scripts/figma-export-helpers.js`. Text styles: `exportTextStyles()`. Adjust `RAW_FILES` in `generate-design-tokens.mjs` if filenames differ.

## B3 — Token gate

- [ ] Raw files exist; counts match B1
- [ ] `modes` match generator constants
- [ ] `bun run tokens:generate` logs real counts, not stubs

## Blocked export

Keep template stubs; document file key, collection map, and pending work in the bootstrap completion summary. Do not mark Phase B complete.
