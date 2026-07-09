# Bootstrap workflow

**Intake:** [SKILL.md](SKILL.md) — do not start until confirmed.

**Templates:** https://github.com/hosam-hubspire/expo-project-bootstrap/tree/main/templates

## Scaffold

1. **Create app** — `bunx create-expo-app@latest <APP_NAME> --template default` (or `CI=true … .` in existing repo). Set `name`/`slug`/`scheme` in `app.json`. No `move_agent_to_root`.
2. **Remove cruft** — demo routes, `components/ui/*`, stock helpers, non-Bun lockfiles, web files. Move `app/` → `src/app/`; wire `@/` in `tsconfig.json`.
3. **Install** — grouped commands in `templates/README.md`; skip unchecked stack groups. `bun install --verbose` must exit **0**.
4. **Apply templates** — merge (don't bulk-copy) `package.json`, `app.json`, `tsconfig.json`, `metro.config.js`, `eas.json`, lint/CI, `scripts/`, `src/`, `assets/`. Strip unchecked items — [`optional/minimal/README.md`](../../templates/optional/minimal/README.md). Stub tokens in `src/theme/tokens/raw/` for CI/Argent.
5. **Argent init** — `bunx @swmansion/argent init -y` when CLI available (setup only — not a smoke test).

## EAS configure (Phase A2)

After scaffold, before Phase C:

1. **Set owner** — add `"owner": "<EXPO_OWNER>"` to `app.json` (`expo` key). Default **`hubspire`** from intake unless user provided another account slug.
2. **Merge `templates/eas.json`** — default profiles:
   - `development` — dev client, internal distribution (devices)
   - `development-simulator` — dev client for **iOS Simulator** (`ios.simulator: true`) — **used in C2**
   - `preview` — internal Android APK
   - `production` — store builds with auto-increment
3. **Install dev client** — `bunx expo install expo-dev-client`
4. **Link EAS project** — `bunx eas-cli whoami` (must be logged in); then `bunx eas-cli init --non-interactive`. Writes `extra.eas.projectId` to `app.json`.
5. **Prebuild** — `bunx expo prebuild` if not already done (nano-icons, native projects for EAS).

If `eas init` or login fails, stop and ask the user to run `bunx eas-cli login` — do not skip EAS unless user explicitly opts out.

### Default `eas.json` profiles

| Profile | Use |
|---------|-----|
| `development-simulator` | **C2 smoke test** — iOS Simulator dev client (no Apple Developer account required) |
| `development` | Physical iOS/Android dev clients |
| `preview` | Internal QA (APK on Android) |
| `production` | App Store / Play Store |

Trigger via CLI: `bunx eas-cli build -p ios -e development-simulator --non-interactive --wait`

Or via **Expo MCP** when Cursor has `expo` MCP authenticated: `build_run` with profile `development-simulator` (requires GitHub connected for remote `build_run`; CLI works without GitHub).

## Default stack

All included unless unchecked at intake:

Expo Router · Uniwind + Tailwind v4 · Bun · Biome + ESLint a11y + Jest + CI · TypeScript strict · Zustand + MMKV · nano-icons · i18n · GraphQL (needs `EXPO_PUBLIC_GRAPHQL_URL`) · Storybook · EAS (hubspire) · expo-dev-client

Subscriptions off by default (`EXPO_PUBLIC_GRAPHQL_SUBSCRIPTIONS_ENABLED=true` only when selected). Real fonts arrive in Phase B — typography uses `--font-family-*` vars, not `font-sans`/`font-mono`.

## Verify (Phase C — stub tokens OK)

```bash
bun run lint && bun test && bunx tsc --noEmit
```

### EAS iOS simulator build + Argent smoke test (Phase C2)

Required when `mcp__argent__*` tools or `argent` CLI is available. Read `.cursor/rules/argent.md` and `argent-device-interact` skill first.

**Default: iOS simulator via EAS + Argent.** Android is opt-in at intake.

#### iOS (always) — EAS simulator build

1. **Cloud build** — `bunx eas-cli build -p ios -e development-simulator --non-interactive --wait`
   - Or Expo MCP `build_run` with profile `development-simulator` when MCP is authenticated
2. **Install on simulator** — `bunx eas-cli build:run -p ios --latest -e development-simulator`
   - Boot a simulator first via Argent `boot-device` if none is running
3. **Start Metro** — `bun run start` (dev client needs bundler; keep running in background)
4. **Argent verify** — `launch-app` → no redbox, home screen renders, tab navigation (home + settings) → `describe` or screenshot

**Fallback:** if EAS build fails (auth, billing, network), fall back to local `bunx expo run:ios` + same Argent checks; note the fallback in the completion summary.

#### Android (opt-in at intake)

When intake enabled **Android smoke test**, after iOS passes:

1. `list-devices` → boot emulator if needed
2. Local `bunx expo run:android` (or EAS `preview` APK if preferred)
3. Same Argent verification steps

**Gate:** C2 must pass on **iOS** (EAS simulator build preferred) before Phase B (when token sync enabled) or Phase D (when off). When Android smoke test was opted in, Android must pass too before proceeding.

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

Latest Expo default template · merge templates into scaffold · copy JSON to `raw/` · discover + `tokens:generate` only · never hand-edit `src/theme/tokens/generated/*` · EAS A2 + C2 + Phase B (when enabled) before push
