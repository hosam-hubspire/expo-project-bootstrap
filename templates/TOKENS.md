# Design tokens

Track Figma → code status for this project. Remove sections that do not apply.

## Figma file

| Field | Value |
|-------|--------|
| File key | |
| Design system URL | |
| Icons section URL | |
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

- [ ] Raw JSON exported and persisted under `src/theme/tokens/raw/`
- [ ] `bun run tokens:generate` run after export
- [ ] Icons exported to `assets/icons/app-icons/` (if in scope)
- [ ] Icon font regenerated (if in scope)

Notes:
