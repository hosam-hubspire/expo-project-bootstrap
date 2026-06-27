# Bootstrap workflow

**Intake:** [SKILL.md](SKILL.md) — do not start until confirmed.

**Templates:** https://github.com/hosam-hubspire/expo-project-bootstrap/tree/main/templates

## Scaffold

1. **Create app** — `bunx create-expo-app@latest <APP_NAME> --template default` (or `CI=true … .` in existing repo). Set `name`/`slug`/`scheme` in `app.json`. No `move_agent_to_root`.
2. **Remove cruft** — demo routes, `components/ui/*`, stock helpers, non-Bun lockfiles, web files. Move `app/` → `src/app/`; wire `@/` in `tsconfig.json`.
3. **Install** — grouped commands in `templates/README.md`; skip unchecked stack groups. `bun install --verbose` must exit **0**.
4. **Apply templates** — merge (don't bulk-copy) `package.json`, `app.json`, `tsconfig.json`, `metro.config.js`, lint/CI, `scripts/`, `src/`, `assets/`. Strip unchecked items — [`optional/minimal/README.md`](../../templates/optional/minimal/README.md). Stub tokens in `src/theme/tokens/raw/` for CI/Argent.
5. **Argent init** — `bunx @swmansion/argent init -y` when CLI available (setup only — not a smoke test).

## Default stack

All included unless unchecked at intake:

Expo Router · Uniwind + Tailwind v4 · Bun · Biome + ESLint a11y + Jest + CI · TypeScript strict · Zustand + MMKV · nano-icons · i18n · GraphQL (needs `EXPO_PUBLIC_GRAPHQL_URL`) · Storybook

Subscriptions off by default (`EXPO_PUBLIC_GRAPHQL_SUBSCRIPTIONS_ENABLED=true` only when selected). Real fonts arrive in Phase B — typography uses `--font-family-*` vars, not `font-sans`/`font-mono`.

## Verify (Phase C — stub tokens OK)

```bash
bun run lint && bun test && bunx tsc --noEmit
```

### Argent smoke test (Phase C2)

Required when `mcp__argent__*` tools or `argent` CLI is available. Read `.cursor/rules/argent.md` and `argent-device-interact` skill first.

On **each** platform (iOS simulator, then Android emulator):

1. `list-devices` → boot if needed → start Metro (`bun run ios` / `bun run android`)
2. `launch-app` — open the scaffolded app
3. Verify: no redbox, root screen renders, tab navigation (home + settings)
4. `describe` or screenshot — both platforms

**Gate:** C2 must pass on iOS **and** Android before Phase B (when token sync enabled) or Phase D (when off).

### Design token sync (Phase B — after C2, before D)

When intake enabled **Sync design tokens** — [`FIGMA_EXPORT.md`](../../templates/FIGMA_EXPORT.md):

1. User exports from Figma → copies into `src/theme/tokens/raw/` (any file/folder names)
2. User confirms copies are done
3. `node scripts/discover-figma-raw.mjs` — agent reviews mapping and mode hints
4. Adapt `scripts/generate-design-tokens.mjs` (`RAW_FILES` pins, mode constants) if needed
5. `bun run tokens:generate` then re-run Phase C checks

**Gate:** real token counts in generator log; lint/test/tsc pass before Phase D.

If Argent unavailable: report in summary, ask user before D.

Commit on `main`; push if GitHub repo provided. Completion summary — [SKILL.md](SKILL.md).

## Constraints

Latest Expo default template · merge templates into scaffold · copy JSON to `raw/` · discover + `tokens:generate` only · never hand-edit `src/theme/tokens/generated/*` · C2 + Phase B (when enabled) before push
