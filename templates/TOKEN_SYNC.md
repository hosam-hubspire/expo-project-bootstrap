# Design token sync — Phase B

When intake **Sync design tokens** is on — after C2 (or after C if smokes off), before D. Needs **Design tokens GitHub URL**. Do not copy this file into the app.

Icons: export SVGs to `assets/icons/` separately.

## Goal

Rerunnable `bun run tokens:sync` that fetches the intake GitHub tokens repo and writes Uniwind files under `src/theme/tokens/generated/`. Normalize plugin exports inside the script — do not invent an intermediate `raw/` layer.

## 1 — Review tokens repo

Shallow-clone / `gh` the intake URL. Inventory export layout (Tokens Studio, Variables JSON, Style Dictionary, etc.). Note color / size / typography sources.

## 2 — Implement `scripts/sync-design-tokens.mjs`

Fill fetch + transform for this export shape:

| Requirement | Detail |
|-------------|--------|
| Source | Pin intake GitHub URL (constant or `TOKENS_GITHUB_URL`) |
| Fetch | Clone/pull each run (cache under `.tokens-cache/`, gitignored) |
| Output | Overwrite `generated/*` per Uniwind contract below |
| Headers | `AUTO-GENERATED — do not edit. Run: bun run tokens:sync` |
| Storybook | Update `token-definitions.ts` when present |
| Idempotent | Same inputs → stable outputs |

```json
"tokens:sync": "node scripts/sync-design-tokens.mjs"
```

### Uniwind output contract

Match `templates/src/theme/tokens/generated/`:

| File | Role |
|------|------|
| `theme.css` | Semantic colors → `@variant light` / `dark` |
| `colors.ts` | `colorTokens.light` / `.dark` |
| `spacing.css` | Size → `@theme` |
| `font-families.css` | `--font-family-*` |
| `typography-classes.ts` | Uniwind className strings |
| `typography-primitives.*` / `primitives.css` | Optional |

Keep `@/theme` import paths. Prefer CSS-safe names. Resolve aliases to concrete values before emit. Match stub files under `templates/src/theme/tokens/generated/`.

## 3 — Run & verify

```bash
bun run tokens:sync
bunx uniwind generate-artifacts --css ./src/global.css --dts ./src/uniwind-types.d.ts
bun run lint && bun test && bunx tsc --noEmit
```

Confirm with user. Fix the script — do not one-off edit `generated/*`.

**Gate:** real tokens (not stubs only) + checks pass before D. If blocked: keep stubs; document; do not mark B complete.
