# Design token sync — Phase B

Run **after Argent (C2)** and **before commit/push (D)** when intake enabled **Sync design tokens**. Requires **Design tokens GitHub URL** from intake (a repo — or tree/path URL — with Figma token exports from **any** Figma plugin). Read this guide from the bootstrap repo — do not copy into the new project.

Icons: export SVGs separately to `assets/icons/` — see `templates/README.md`.

## Goal

Ship a **rerunnable** app script (`bun run tokens:sync`) that:

1. Reads the latest exports from the intake GitHub tokens repo
2. Writes Uniwind-ready files under `src/theme/tokens/generated/` (and Storybook defs when present)

Do **not** hand-map exports into `raw/` `{ collection, modes, variables }` JSON as a Phase B deliverable. Parsing/normalization belongs **inside** the sync script so the user can re-sync later without the agent.

## 1 — Review the GitHub tokens repo

1. Fetch or shallow-clone the intake URL (`gh` / git).
2. Inventory export layout (Tokens Studio, Variables JSON, Style Dictionary, nested folders, etc.).
3. Note color / size / typography (and optional primitives) sources the script must read.

## 2 — Implement `scripts/sync-design-tokens.mjs`

Scaffold copies the template skeleton. In Phase B the agent **fills in** fetch + transform for this project’s export shape.

Requirements:

| Requirement | Detail |
|-------------|--------|
| Source URL | Pin intake GitHub URL (constant or `TOKENS_GITHUB_URL` env) |
| Fetch | Clone/pull or download on each run (cache dir gitignored, e.g. `.tokens-cache/`) |
| Output | Overwrite `src/theme/tokens/generated/*` to match the **Uniwind contract** below |
| Headers | Mark files `AUTO-GENERATED — do not edit. Run: bun run tokens:sync` |
| Storybook | Update `src/stories/design-tokens/token-definitions.ts` when that dir exists |
| Idempotent | Safe to re-run; same inputs → stable outputs |

Add to `package.json` (intake sync on only):

```json
"tokens:sync": "node scripts/sync-design-tokens.mjs"
```

Document in the project README: how to re-sync after designers update the tokens repo.

### Uniwind output contract (source of truth)

Match structure and consumption patterns of template stubs in `templates/src/theme/tokens/generated/`:

| File | Role |
|------|------|
| `theme.css` | Semantic colors → Uniwind `@variant light` / `@variant dark` CSS variables |
| `colors.ts` | `colorTokens.light` / `.dark` maps for TS |
| `spacing.css` | Size/spacing → `@theme` (mobile-first; `md`/`lg` breakpoints when modes exist) |
| `font-families.css` | `--font-family-*` variables |
| `typography-classes.ts` | Responsive Uniwind className strings |
| `typography-primitives.ts` / `.css` | Optional primitives |
| `primitives.css` | Optional color/size primitives |

App code imports these via `@/theme` — do not change import paths. Prefer CSS-safe token names (`text/text-default` → `text-text-default`). Resolve plugin aliases to concrete values (hex, px, font weights) before emit.

Reference implementation of emitters (optional to reuse or adapt): `templates/scripts/generate-design-tokens.mjs`. That script’s `raw/` input path is **not** the Phase B workflow — only its **output shape** matters.

## 3 — Run & verify

```bash
bun run tokens:sync
bunx uniwind generate-artifacts --css ./src/global.css --dts ./src/uniwind-types.d.ts
bun run lint && bun test && bunx tsc --noEmit
```

Confirm with the user that synced tokens look right (spot-check colors / type). Fix the script if not — do not one-off edit `generated/*`.

**Gate:** sync writes real tokens (not leftover stubs only); static checks pass before Phase D.

## Blocked sync

Keep stub `generated/`; document GitHub URL, inventory, and blockers in the bootstrap summary. Do not mark Phase B complete. Leave a TODO in the sync script if partially implemented.

## User re-sync (after bootstrap)

```bash
bun run tokens:sync
```

Re-pulls the tokens GitHub repo and regenerates Uniwind files. No agent required unless the upstream export format changes.
