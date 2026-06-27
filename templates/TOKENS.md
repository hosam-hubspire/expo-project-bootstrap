# Design tokens

Track Figma → code status for this project. Remove sections that do not apply.

## Figma file

| Field | Value |
|-------|--------|
| File key | |
| Design system URL | |
| Last synced | |

## Variable collections

| Figma collection | Raw file | Modes |
|------------------|----------|-------|
| | `color-tokens.json` | |
| | `color-primitives.json` | |
| | `size-tokens.json` | |
| | `size-primitives.json` | |
| | `typography-tokens.json` | |
| | `typography-primitives.json` | |

## Generator configuration

Document non-obvious mappings in `scripts/generate-design-tokens.mjs`:

| Constant | Value in this project |
|----------|------------------------|
| `LIGHT_MODE` | |
| `DARK_MODE` | |
| `SIZE_MODE_SM` / `MD` / `LG` | |
| `TYPO_MODE_SM` / `MD` / `LG` | |

## Pending / notes

- [ ] Raw JSON exported and persisted under `src/theme/tokens/raw/` (replace template stubs — see `FIGMA_EXPORT.md`)
- [ ] `bun run tokens:generate` run after export
- [ ] Icon SVGs added to `assets/icons/` and `bun run icons:generate` run (when replacing sample icons)

Notes:
