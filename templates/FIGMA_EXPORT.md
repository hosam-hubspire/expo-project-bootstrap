# Figma token sync — Phase B

Run **after Argent (C2)** and **before commit/push (D)** when a design system is in scope. Read from the bootstrap repo — do not copy into the new project.

Icons: export SVGs separately to `assets/icons/` — see `templates/README.md`.

## 1 — Export from Figma

Export variable collections and text styles from the design file (Figma desktop, plugin, MCP, or designer handoff). Copy into:

```
src/theme/tokens/raw/
```

Exports may be **any mix of files and folders** — names are not fixed. Each variable collection JSON must include `{ collection, modes, variables }`. Text styles: JSON **array** with `fontFamily` on items.

Remove template stubs when adding real exports.

## 2 — Confirm copied

Wait for the user to confirm exports are in `raw/`. Do not run `tokens:generate` until then.

## 3 — Discover & adapt

```bash
node scripts/discover-figma-raw.mjs   # inventory + role mapping + mode hints
```

The agent:

1. Reviews discovery output (paths, counts, suggested `LIGHT_MODE` / size / typography modes).
2. Pins ambiguous paths in `RAW_FILES` at the top of `scripts/generate-design-tokens.mjs` when auto-detection is wrong.
3. Updates mode constants in that file to match discovered `modes`.
4. Fixes app/story typography token names if the design system differs from template stubs.

Optional MCP export: use helpers in `scripts/figma-export-helpers.js` via `use_figma`, save JSON into `raw/` yourself — no persist script.

## 4 — Generate & verify

```bash
bun run tokens:generate
bun run lint && bun test && bunx tsc --noEmit
```

**Gate:** generator logs real collection counts (not stub-only). Re-run static checks before Phase D.

## Blocked sync

Keep template stubs; document file key, export inventory, and pending work in the bootstrap summary. Do not mark Phase B complete.
