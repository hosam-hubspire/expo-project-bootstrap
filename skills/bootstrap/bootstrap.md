# Bootstrap workflow

**Intake:** [SKILL.md](SKILL.md) — do not start until confirmed.

**Templates:** https://github.com/hosam-hubspire/expo-project-bootstrap/tree/main/templates

## Scaffold

1. **Create app** — `bunx create-expo-app@latest <APP_NAME> --template default` (or `CI=true … .` in existing repo). Set `name`/`slug`/`scheme` in `app.json`. No `move_agent_to_root`.
2. **Remove cruft** — demo routes, `components/ui/*`, stock helpers, non-Bun lockfiles, web files. Move `app/` → `src/app/` if needed; wire `@/` in `tsconfig.json`.
3. **Install** — grouped commands in `templates/README.md`; skip unchecked stack groups. **Expo packages:** `bunx expo install`. **Non-Expo packages:** `bun add …@latest`. Never copy version pins from templates. `bun install --verbose` must exit **0**.
4. **Apply templates** — merge (don't bulk-copy) `package.json`, `app.json`, `tsconfig.json`, `metro.config.js`, lint/CI, `src/`, `assets/`. Include `eas.json` only when **Setup EAS** is on at intake. Strip unchecked items — [`optional/minimal/README.md`](../../templates/optional/minimal/README.md).
   - **Token sync off:** copy pre-built `src/theme/tokens/generated/` only — **no** `scripts/discover-figma-raw.mjs`, `scripts/generate-design-tokens.mjs`, `scripts/figma-export-helpers.js`, or `src/theme/tokens/raw/`.
   - **Token sync on:** also copy token scripts + `src/theme/tokens/raw/`; add `tokens:discover` / `tokens:generate` scripts to `package.json`.
   - **Tab icons:** merge `templates/assets/images/tabIcons/settings.png` (+ `@2x`/`@3x`) — default Expo scaffold has `home.png` but not `settings.png`.
   - **GraphQL on:** copy `templates/.env.example` → `.env.example`; create local `.env` with dev placeholder URL (gitignore `.env`).
5. **Biome migrate** — `bunx biome migrate --write` after copying `biome.json` and installing `@biomejs/biome@latest`.
6. **Uniwind types** — `bunx uniwind generate-artifacts --css ./src/theme/global.css --dts ./src/uniwind-types.d.ts`
7. **Argent init** — `bunx @swmansion/argent init -y` when CLI available (setup only — not a smoke test).
8. **Prebuild** — `bunx expo prebuild` (nano-icons, native projects).

### `app.json` merge checklist

Merge into the scaffold `app.json` under `expo` — do not replace the whole file:

| Key | When | Notes |
|-----|------|-------|
| `name`, `slug`, `scheme` | always | from intake |
| `owner` | EAS on | default `hubspire` |
| `plugins` | always | append `expo-localization`, `react-native-nano-icons` config |
| `experiments` | always | `typedRoutes`, `reactCompiler` from template |
| `extra.eas.projectId` | EAS on | from `eas init` or existing project lookup |

Keep scaffold keys (`ios`, `android`, `icon`, splash config). **`experiments` and `extra` are siblings** — never nest one inside the other.

## EAS configure (Phase A2 — only when Setup EAS is on at intake)

Skip this entire phase when intake disabled **Setup EAS**.

1. **Set owner** — add `"owner": "<EXPO_OWNER>"` to `app.json` (`expo` key). Default **`hubspire`** from intake unless user provided another account slug.
2. **Merge `templates/eas.json`** — default profiles:
   - `development` — dev client, internal distribution (devices)
   - `development-simulator` — dev client for **iOS Simulator** (`ios.simulator: true`) — **used in C2**
   - `preview` — internal Android APK
   - `production` — store builds with auto-increment
3. **Install dev client** — `bunx expo install expo-dev-client`
4. **Link EAS project** — `bunx eas-cli whoami` (must be logged in); then `bunx eas-cli init --non-interactive`. Writes `extra.eas.projectId` to `app.json`.

**Project already exists** — if `eas init` reports an existing project (same slug under the owner), skip `--force`. Look up the project ID:

```bash
bunx eas-cli project:info --json
```

Merge `extra.eas.projectId` into `app.json` manually. Do not stop bootstrap.

If login fails, stop and ask the user to run `bunx eas-cli login`.

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

Expo Router · Uniwind + Tailwind v4 · Bun · Biome + ESLint a11y + Jest + CI · TypeScript strict · Zustand + MMKV · nano-icons · i18n · GraphQL · Storybook

When **Setup EAS** is on: also EAS (`hubspire`) · `expo-dev-client` · `eas.json`.

Subscriptions off by default (`EXPO_PUBLIC_GRAPHQL_SUBSCRIPTIONS_ENABLED=true` only when selected). Real fonts arrive in Phase B — typography uses `--font-family-*` vars, not `font-sans`/`font-mono`.

**GraphQL dev placeholder** (when GraphQL enabled): set `EXPO_PUBLIC_GRAPHQL_URL=https://countries.trevorblades.com/` in local `.env` before C2. The bundled `ExampleQuery` (`__typename`) works against any endpoint.

## Verify (Phase C — stub tokens OK)

```bash
bun run lint && bun test && bunx tsc --noEmit
```

Requires Uniwind types generated in Phase A step 6.

### Argent smoke test (Phase C2)

Required when `mcp__argent__*` tools or `argent` CLI is available. Read `.cursor/rules/argent.md` and `argent-device-interact` skill first.

**Default: iOS simulator only.** Android is opt-in at intake.

#### iOS (always)

**When Setup EAS is on** (EAS path):

1. **Cloud build** — `bunx eas-cli build -p ios -e development-simulator --non-interactive --wait`
   - Or Expo MCP `build_run` with profile `development-simulator` when MCP is authenticated
2. **Install on simulator** — `bunx eas-cli build:run -p ios --latest -e development-simulator`
   - Boot a simulator first via Argent `boot-device` if none is running
3. **Start Metro** — `bun run start` (dev client needs bundler; keep running in background)
4. **Dev client** — tap the Metro server entry if the launcher appears
5. **Argent verify** — `launch-app` → no redbox, home screen renders, tab navigation (home + settings) → `describe` or screenshot

**When Setup EAS is off** (local path):

1. `list-devices` → boot simulator if needed
2. **Local build** — `bunx expo run:ios` (builds, installs, starts Metro)
3. **Argent verify** — same checks as above

#### Android (opt-in at intake)

When intake enabled **Android smoke test**, after iOS passes:

1. `list-devices` → boot emulator if needed
2. **EAS on:** local `bunx expo run:android` or EAS `preview` APK
3. **EAS off:** local `bunx expo run:android`
4. Same Argent verification steps

**Gate:** C2 must pass on **iOS** before Phase B (when token sync enabled) or Phase D (when off). When Android smoke test was opted in, Android must pass too before proceeding.

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

Latest Expo default template · merge templates into scaffold · discover + `tokens:generate` only when token sync enabled · never hand-edit `src/theme/tokens/generated/*` · C2 + Phase B (when enabled) before push · EAS A2 only when Setup EAS is on at intake · resolve package versions at install time, never from template pins
