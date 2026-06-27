# Bootstrap workflow

**Intake:** [SKILL.md](SKILL.md) — do not start until confirmed.

**Templates:** https://github.com/hosam-hubspire/expo-project-bootstrap/tree/main/templates

## Scaffold

1. **Create app** — `bunx create-expo-app@latest <APP_NAME> --template default` (or `CI=true … .` in existing repo). Set `name`/`slug`/`scheme` in `app.json`. No `move_agent_to_root`.
2. **Remove cruft** — demo routes, `components/ui/*`, stock helpers, non-Bun lockfiles, web files. Move `app/` → `src/app/`; wire `@/` in `tsconfig.json`.
3. **Install** — grouped commands in `templates/README.md`; skip unchecked stack groups. `bun install --verbose` must exit **0**.
4. **Apply templates** — merge (don't bulk-copy) `package.json`, `app.json`, `tsconfig.json`, `metro.config.js`, lint/CI, `scripts/`, `src/`, `assets/`. Strip unchecked items — [`optional/minimal/README.md`](../../templates/optional/minimal/README.md). Phase B tokens when Figma URL given — [`FIGMA_EXPORT.md`](../../templates/FIGMA_EXPORT.md).
5. **Argent** — `bunx @swmansion/argent init -y` when CLI available.

## Default stack

All included unless unchecked at intake:

Expo Router · Uniwind + Tailwind v4 · Bun · Biome + ESLint a11y + Jest + CI · TypeScript strict · Zustand + MMKV · nano-icons · i18n · GraphQL (needs `EXPO_PUBLIC_GRAPHQL_URL`) · Storybook

Subscriptions off by default (`EXPO_PUBLIC_GRAPHQL_SUBSCRIPTIONS_ENABLED=true` only when selected). Fonts come from Phase B export — typography uses `--font-family-*` vars, not `font-sans`/`font-mono`.

## Verify & deliver

```bash
bun install
bun run tokens:generate   # when Phase B ran
bun run lint && bun test && bunx tsc --noEmit
```

Argent smoke test when available. Commit on `main`; push if GitHub repo provided. Completion summary — [SKILL.md](SKILL.md).

## Constraints

Latest Expo default template · merge templates into scaffold · Figma via `/tmp` + `persist-figma-export.mjs` only · never edit `src/theme/tokens/generated/*` · CI must pass before push
