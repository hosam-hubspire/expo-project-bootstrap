# Bootstrap workflow

**Intake:** [SKILL.md](SKILL.md) — do not start until confirmed. Step 1: app name. Step 2: use defaults? (skips remaining questions when yes).

**Templates:** https://github.com/hosam-hubspire/expo-project-bootstrap/tree/main/templates

**Navigation assembly:** [`templates/navigation/README.md`](../../templates/navigation/README.md)

## Scaffold

1. **Create app** — `bunx create-expo-app@latest <APP_NAME> --template default` (or `CI=true … .` in existing repo). Set `name`/`slug`/`scheme` in `app.json`. No `move_agent_to_root`.
2. **Remove cruft** — demo routes, `components/ui/*`, stock helpers, non-Bun lockfiles, **all web files** (`+html.tsx`, web entry/assets). Move `app/` → `src/app/` if needed; wire `@/` in `tsconfig.json`. Apps are **iOS/Android only** — never add `Platform.OS === "web"`, `localStorage`, or other web-only code.
3. **Install** — grouped commands in `templates/README.md`; skip unchecked stack groups. **Expo packages:** `bunx expo install`. **Non-Expo packages:** `bun add …@latest`. Never copy version pins from templates. `bun install --verbose` must exit **0**.
4. **Apply templates** — merge (don't bulk-copy) `package.json`, `app.json`, `tsconfig.json`, `metro.config.js`, lint/CI, `src/`, `assets/`. Include `eas.json` only when **Setup EAS** is on at intake. Strip unchecked items — [`optional/minimal/README.md`](../../templates/optional/minimal/README.md).
   - **Token sync off (default):** copy pre-built `src/theme/tokens/generated/` **and** template stub exports in `src/theme/tokens/raw/` — **do not** copy token scripts; **do not** add `tokens:discover` / `tokens:generate` to `package.json`.
   - **Token sync on:** copy token scripts + empty `src/theme/tokens/raw/` (README only); add `tokens:discover` / `tokens:generate` to `package.json`. Figma URL collected at intake — real exports land in `raw/` during Phase B.
   - **Tab icons (when tabs on):** merge `templates/assets/images/tabIcons/settings.png` (+ `@2x`/`@3x`) — default Expo scaffold has `home.png` but not `settings.png`.
   - **GraphQL on:** copy `templates/.env.example` → `.env.example`; create local `.env` with dev placeholder URL (gitignore `.env`).
5. **Navigation assembly** — start from `templates/src/app/` (default: **tabs + intro**). Apply intake toggles using [`navigation/README.md`](../../templates/navigation/README.md):
   - **Intro off:** delete `(onboarding)/`; remove onboarding `Stack.Protected` from root navigator.
   - **Auth on:** copy `navigation/auth/*` → `providers/session-provider.tsx`, `hooks/use-storage-state.ts`, `app/sign-in.tsx`; ensure `src/constants/session.ts` (`SESSION_STORAGE_KEY`) is present; nest **`SessionProvider` inside `AppApolloProvider`** when GraphQL is on (so auth can use mutations); when GraphQL is off, wrap with `SessionProvider` alone; use auth-aware `RootNavigator`; `bunx expo install expo-secure-store`; add Sign out on Settings. Custom hooks always go under `src/hooks/` — never `src/lib/`. Constants go under `src/constants/`.
   - **GraphQL + auth:** Apollo client already includes a SecureStore auth link (`SetContextLink` + WS `connectionParams`) keyed by `SESSION_STORAGE_KEY` — do not read the token from React context in the link.
   - **Drawer on:** copy drawer layout into `(app)/_layout.tsx` (tabs nested vs flat); copy `about.tsx` if desired; install drawer deps from README (`@react-navigation/drawer` + gesture/reanimated/worklets).
   - **Tabs off:** remove `(tabs)/` + `AppTabs`; place `navigation/screens/` under `(app)/`; use flat drawer or flat stack layout.
6. **Biome migrate** — `bunx biome migrate --write` after copying `biome.json` and installing `@biomejs/biome@latest`.
7. **Uniwind types** — `bunx uniwind generate-artifacts --css ./src/theme/global.css --dts ./src/uniwind-types.d.ts` (not `generate-types` — that command does not exist).
8. **Argent init** — `bunx @swmansion/argent init -y` when CLI available (setup only — not a smoke test). Then `bun run lint:fix` (or `bunx biome check --write .`) so Argent MCP JSON matches Biome before Phase C.
9. **Prebuild** — `bunx expo prebuild` (nano-icons, native projects).

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

**Default navigation:** tabs + intro onboarding (drawer off, auth off). Other combos via intake + `templates/navigation/`.

When **Setup EAS** is on: also EAS (`hubspire`) · `expo-dev-client` · `eas.json`.

Subscriptions off by default (`EXPO_PUBLIC_GRAPHQL_SUBSCRIPTIONS_ENABLED=true` only when selected). With **token sync off** (default), typography uses template stub tokens and `--font-family-*` vars — not `font-sans`/`font-mono`. Real fonts arrive in Phase B when sync is enabled.

**GraphQL dev placeholder** (when GraphQL enabled): set `EXPO_PUBLIC_GRAPHQL_URL=https://countries.trevorblades.com/` in local `.env` before C2. The bundled `ExampleQuery` (`__typename`) works against any endpoint.

## Verify (Phase C — stub tokens OK)

```bash
bun run lint && bun test && bunx tsc --noEmit
```

Requires Uniwind types generated in Phase A step 7.

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
5. **Argent verify** — `launch-app` → no redbox → then navigation checks below

**When Setup EAS is off** (local path):

1. `list-devices` → boot simulator if needed
2. **Local build** — `bunx expo run:ios` (builds, installs, starts Metro)
3. **Argent verify** — same checks as above

#### Navigation checks (match intake)

| Feature | Verify |
|---------|--------|
| Intro on | First launch shows onboarding; complete flow → main shell |
| Tabs on | Home ↔ Settings |
| Drawer on | Menu icon visible in header on Home/tabs; open drawer (tap or swipe); navigate to a drawer item |
| Auth on | Signed out → sign-in; Sign in → app; Sign out → sign-in |
| Intro off | Lands on main shell (or sign-in if auth on) without onboarding |

#### Android (opt-in at intake)

When intake enabled **Android smoke test**, after iOS passes:

1. `list-devices` → boot emulator if needed
2. **EAS on:** local `bunx expo run:android` or EAS `preview` APK
3. **EAS off:** local `bunx expo run:android`
4. Same Argent verification steps

**Gate:** C2 must pass on **iOS** before Phase B (when token sync enabled) or Phase D (when off). When Android smoke test was opted in, Android must pass too before proceeding.

### Design token sync (Phase B — after C2, before D)

Only when intake enabled **Sync design tokens** — [`FIGMA_EXPORT.md`](../../templates/FIGMA_EXPORT.md). Requires **Figma design tokens URL** from intake.

1. Export variable collections and text styles from the intake Figma URL (Figma desktop, plugin, MCP, or designer handoff) → `src/theme/tokens/raw/`
2. User confirms exports are in `raw/`
3. `node scripts/discover-figma-raw.mjs` — agent reviews mapping and mode hints
4. Adapt `scripts/generate-design-tokens.mjs` (`RAW_FILES` pins, mode constants) if needed
5. `bun run tokens:generate` then re-run Phase C checks

**Gate:** real token counts in generator log; lint/test/tsc pass before Phase D.

If export is blocked, keep template `generated/` stubs; document Figma URL, export inventory, and pending work in the summary. Do not mark Phase B complete.

If Argent unavailable: report in summary, ask user before D.

Commit on `main`; push if GitHub repo provided. Completion summary — [SKILL.md](SKILL.md).

## Constraints

Latest Expo default template · merge templates into scaffold · discover + `tokens:generate` only when token sync enabled · never hand-edit `src/theme/tokens/generated/*` · C2 + Phase B (when enabled) before push · EAS A2 only when Setup EAS is on at intake · resolve package versions at install time, never from template pins · assemble navigation from modules — do not leave unused auth/drawer/onboarding routes in the shipped app · prefer `Screen` + `useSafeAreaInsets()` over `SafeAreaView` ([docs](https://docs.expo.dev/versions/latest/sdk/safe-area-context/#usesafeareainsets)) · **native only** (iOS/Android) — no web platform code
