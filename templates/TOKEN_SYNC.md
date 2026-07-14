# Design token sync — Phase B

When intake **Sync design tokens** is on — after C2 (or after C if smokes off), before D. Needs **Design tokens GitHub URL**. Do not copy this file into the app.

Icons: export SVGs to `assets/icons/` separately.

## Goal

Rerunnable `bun run tokens:sync` that fetches the intake GitHub tokens repo and writes Uniwind files under `src/theme/tokens/generated/`. Normalize plugin exports inside the script — do not invent an intermediate `raw/` layer.

## 1 — Review tokens repo

Shallow-clone / `gh` the intake URL. Inventory export layout (Tokens Studio, Variables JSON, Style Dictionary, etc.). Note color / size / typography sources and **modes** (e.g. light/dark color modes; sm / md / lg+ size modes).

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
| `spacing.css` | Size → `@theme` (+ responsive overrides) |
| `font-families.css` | `--font-family-*` |
| `typography-classes.ts` | Uniwind className strings |
| `typography-primitives.*` / `primitives.css` | Color + size + type primitives |

Keep `@/theme` import paths. Prefer CSS-safe names. Match stub files under `templates/src/theme/tokens/generated/` (stubs may be a subset; Phase B emit should cover the full usable set from the tokens repo).

### Resolve & emit checklist (do not skip)

| Area | Requirement |
|------|-------------|
| Alias resolution | Resolve to concrete values before emit. Follow **primitive** refs and **semantic→semantic** refs (include the color-mode token tree in the resolver stack after primitives). |
| Color values | Accept `#hex` **and** `rgb()` / `rgba()` / `hsl()` / `hsla()` (opacity overlays). Do not drop tokens that are not hex-only. |
| Color modes | Map export modes → Uniwind light/dark (document mapping in the script header). |
| Size tokens | Emit spacing (`--spacing-*`), radius (`--radius-*`), stroke widths (`--border-width-*`), padding (as `--spacing-*` keys if needed for utilities), responsive (`--responsive-*`). |
| Size modes | Mobile-first: **sm** base; **md** overrides at `min-width: 768px`; **lg+** at `min-width: 1024px` (match Uniwind breakpoints in `global.css`). |
| Typography | All composite styles for sm/md + lg+; keep template aliases if rename would break stubs (e.g. `heading-app-section`). |
| Primitives | Emit resolved color **and** size primitives under `primitives.css` / Storybook groups. |
| Skip | Feature-flag collections (e.g. Phases) — not Uniwind tokens; count in `tokenCounts.figmaPhasesSkipped` if useful. |

### Coverage gate

Before marking Phase B complete, compare source leaf counts to generated output (or log coverage from the script). Missing semantic colors, size leaves, or typography styles = **not done** — fix `transformAndWrite`, do not hand-edit `generated/*`.

Example Tokens Studio bundle shape (Marta / similar): top-level `files[]` with `collectionName`, `modeName`, `tokens`; aliases like `{neutrals.black-20}` and `{text.text-link-hover}`.

## 3 — Run & verify

```bash
bun run tokens:sync
bunx uniwind generate-artifacts --css ./src/global.css --dts ./src/uniwind-types.d.ts
bun run lint && bun test && bunx tsc --noEmit
```

Confirm with user. Fix the script — do not one-off edit `generated/*`.

After fonts change: install packages matching exported families; load via `expo-font` ([templates/README.md](./README.md)).

**Gate:** real tokens (not stubs only) + coverage checklist + checks pass before D. If blocked: keep stubs; document; do not mark B complete.
