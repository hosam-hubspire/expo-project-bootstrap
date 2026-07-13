# Bootstrap workflow

**Intake:** [SKILL.md](SKILL.md) — do not start until confirmed. Step 1: app name. Step 2: use defaults? (skips remaining questions when yes).

**Templates:** https://github.com/hosam-hubspire/expo-project-bootstrap/tree/main/templates — prefer a local repo clone; GitHub if the skill is installed without `templates/` beside it.

**Navigation assembly:** [navigation/README.md](https://github.com/hosam-hubspire/expo-project-bootstrap/blob/main/templates/navigation/README.md)

## Scaffold

1. **Create app** — `bunx create-expo-app@latest <APP_NAME> --template default` (or `CI=true … .` in existing repo). Set `name`/`slug`/`scheme` in `app.json`. No `move_agent_to_root`.
2. **Remove cruft** — demo routes, stock helpers, non-Bun lockfiles, and any web leftovers (`*.web.*`, `web` script/config, favicon / tutorial-web assets). Current default scaffold usually already uses `src/app/` and `@/` — only move `app/` → `src/app/` or add path aliases if missing. Apps are **iOS/Android only**.
3. **Install** — grouped commands in [templates/README.md](https://github.com/hosam-hubspire/expo-project-bootstrap/blob/main/templates/README.md); skip unchecked stack groups. **Expo packages:** `bunx expo install`. **Non-Expo:** `bun add …@latest` (except `jest` / `@types/jest` — derive from `jest-expo`). Never copy version pins from templates. `bun install --verbose` must exit **0**.
4. **Apply templates** — merge (don't bulk-copy) `package.json`, `app.json`, `tsconfig.json`, `metro.config.js`, lint/CI, `src/`, `assets/`. Include `eas.json` only when **Setup EAS** is on. Strip unchecked items — [optional/minimal/README.md](https://github.com/hosam-hubspire/expo-project-bootstrap/blob/main/templates/optional/minimal/README.md).
   - **Token sync off (default):** copy pre-built `src/theme/tokens/generated/` **and** template stub `raw/` — **do not** copy token sync scripts or add `tokens:*` scripts.
   - **Token sync on:** copy `scripts/sync-design-tokens.mjs` (pin intake GitHub URL), stub `generated/` for Phase C, add `tokens:sync`. Phase B implements transform → Uniwind `generated/` (see TOKEN_SYNC.md). Do not require hand-written `raw/` mapping.
   - **Tab icons (when tabs on):** Expo Router JS `Tabs` + nano `Icon` from `assets/icons/*.svg`.
   - **API GraphQL (default):** copy GraphQL services/provider/examples + `codegen.ts`; `.env` with Rick and Morty URL.
   - **API REST:** follow [optional/rest/README.md](https://github.com/hosam-hubspire/expo-project-bootstrap/blob/main/templates/optional/rest/README.md) — axios client, RestExamples, REST `_layout`/Home; **do not** copy GraphQL stack; `.env` with JSONPlaceholder `EXPO_PUBLIC_API_URL`.
   - **API none:** omit GraphQL (minimal) and skip REST copy.
5. **Navigation assembly** — start from `templates/src/app/` (default: **tabs + intro**). Apply intake toggles using [navigation/README.md](https://github.com/hosam-hubspire/expo-project-bootstrap/blob/main/templates/navigation/README.md):
   - **Intro off:** delete `(onboarding)/`; remove onboarding `Stack.Protected` from root navigator.
   - **Auth on:** copy `navigation/auth/*` → `providers/session-provider.tsx`, `hooks/use-storage-state.ts` (create `src/hooks/`), `app/sign-in.tsx`; ensure `src/constants/session.ts`; nest **`SessionProvider` inside `AppApolloProvider`** when GraphQL; when REST or API none, wrap with `SessionProvider` alone; `bunx expo install expo-secure-store`; Sign out on Settings.
   - **GraphQL + auth:** Apollo SecureStore auth link uses `SESSION_STORAGE_KEY` — do not wire the link to React context.
   - **Drawer on:** copy drawer layout into `(app)/_layout.tsx`; install gesture-handler / reanimated / worklets only — no `@react-navigation/drawer`. Never import `@react-navigation/*` in app code — use `expo-router` / `expo-router/react-navigation`.
   - **Tabs off:** remove `(tabs)/` + `AppTabs`; place `navigation/screens/` under `(app)/`.
   - **Permissions on:** copy selected modules per [permissions/README.md](https://github.com/hosam-hubspire/expo-project-bootstrap/blob/main/templates/src/utils/permissions/README.md); install packages; merge plugins; enable Settings `PermissionsExamples` for selected toggles.
6. **Biome migrate** — `bunx biome migrate --write` after copying `biome.json` and installing `@biomejs/biome@latest`. Template ships `useFilenamingConvention: off` — do not rename files like `SettingsUI.tsx`. Copied template sources should already pass Biome check; if Phase C fails only on format/import-order, re-format the templates in this repo rather than relying on a scaffold-time `lint:fix`.
7. **Uniwind** — CSS entry **`src/global.css`**. Import `@/global.css` in root `_layout`. Metro: **`withUniwindConfig` outermost** ([docs](https://docs.uniwind.dev/quickstart)). Then `bunx uniwind generate-artifacts --css ./src/global.css --dts ./src/uniwind-types.d.ts`.
8. **Argent init** — **only when any smoke is on at intake** (iOS and/or Android). Run `bunx @swmansion/argent init -y`, then `bun run lint:fix` so Argent MCP JSON matches Biome before Phase C. **Skip entirely when both smokes are off** — do not add Argent MCP/skills/rules to the project.
   - **CLI smoke prep (before C2, when any smoke is on and using CLI):** `argent server status` → relink if token rotated → `argent tools` must not 401.
9. **Prebuild** — `bunx expo prebuild` when **any** smoke test is on (iOS and/or Android). **Skip when both smokes are off**: Phase C does not need `ios/` / `android/`; glyphmap/font stubs are enough until the first device build.
10. **Project README** — replace stock Expo `README.md` with a filled [project-README.md](https://github.com/hosam-hubspire/expo-project-bootstrap/blob/main/templates/project-README.md) from intake (Phase A or before Phase D).

### `app.json` merge checklist

Merge into the scaffold `app.json` under `expo` — do not replace the whole file:

| Key | When | Notes |
|-----|------|-------|
| `name`, `slug`, `scheme` | always | from intake |
| `owner` | EAS on | default `hubspire` |
| `plugins` | always | append `expo-localization`, `react-native-nano-icons` config; append permission plugins when selected |
| `experiments` | always | `typedRoutes`, `reactCompiler` from template |
| `extra.eas.projectId` | EAS on | from `eas init` or existing project lookup |

Keep scaffold keys (`ios`, `android`, `icon`, splash config). **`experiments` and `extra` are siblings** — never nest one inside the other. Drop scaffold `web` config when present.

## EAS configure (Phase A2 — only when Setup EAS is on at intake)

Skip this entire phase when intake disabled **Setup EAS**.

1. **Set owner** — `"owner": "<EXPO_OWNER>"` on `expo` (default **`hubspire`**).
2. **Merge `templates/eas.json`** — profiles: `development`, `development-simulator` (C2), `preview`, `production`.
3. **Install** — `bunx expo install expo-dev-client`
4. **Link** — `bunx eas-cli whoami`; `bunx eas-cli init --non-interactive`.

**Project already exists** — skip `--force`. Use `bunx eas-cli project:info --json` and merge `extra.eas.projectId`. If login fails, ask the user to run `bunx eas-cli login`.

| Profile | Use |
|---------|-----|
| `development-simulator` | **C2** — iOS Simulator dev client |
| `development` | Physical device dev clients |
| `preview` | Internal QA (Android APK) |
| `production` | Store builds |

CLI: `bunx eas-cli build -p ios -e development-simulator --non-interactive --wait`. Expo MCP `build_run` is optional when authenticated; prefer `eas` CLI for reliability.

## Default stack

Expo Router · Uniwind + Tailwind v4 · Bun · Biome + ESLint a11y · Jest + CI · TypeScript strict · Zustand + MMKV · nano-icons · toasts · i18n · **API: GraphQL (default) or REST (axios)** · Storybook (omit via intake + minimal/rest strip).

**Default navigation:** tabs + intro (drawer off, auth off).

When **Setup EAS** is on: EAS (`hubspire`) · `expo-dev-client` · `eas.json`.

Subscriptions off by default (GraphQL only). Token sync off → stub tokens. GraphQL placeholder: `EXPO_PUBLIC_GRAPHQL_URL=https://rickandmortyapi.com/graphql`. REST placeholder: `EXPO_PUBLIC_API_URL=https://jsonplaceholder.typicode.com`.

## Verify (Phase C — stub tokens OK)

```bash
bun run lint && bun test && bunx tsc --noEmit
```

Requires Uniwind types from Phase A step 7.

### Argent smoke test (Phase C2)

**Skip entirely when iOS Argent smoke is off at intake.** Android smoke alone is not supported — turn iOS smoke on if Android is on.

When iOS smoke is on and Argent MCP/CLI is available: read `.cursor/rules/argent.md` and `argent-device-interact` skill first. CLI pre-flight: Phase A step 8.

#### iOS (when iOS smoke on)

**EAS on:** cloud `development-simulator` build → `eas build:run` → Metro (`bun run start`) → tap server in dev client → Argent verify.

**EAS off:** boot simulator → `bunx expo run:ios` → Argent verify.

#### Navigation checks (match intake)

| Feature | Verify |
|---------|--------|
| Intro on | First launch shows onboarding; complete → main shell |
| Tabs on | Home ↔ Settings |
| Drawer on | Menu icon on Home/tabs; open drawer; navigate |
| Auth on | Signed out → sign-in → app; Sign out → sign-in |
| Intro off | Main shell (or sign-in if auth) without onboarding |

#### Android (when Android smoke on)

After iOS passes: boot emulator → `bunx expo run:android` (or EAS `preview` when EAS on) → same Argent checks.

**Gate:** When iOS smoke on, C2 must pass before Phase B (if token sync) or Phase D. When Android opted in, Android must pass too. When **both smokes off**, skip Argent init and C2; after Phase C (+ B if sync), proceed to ask about Phase D (no Argent gate).

### Design token sync (Phase B — after C2 when C2 ran, else after C)

Only when **Sync design tokens** is on — [TOKEN_SYNC.md](https://github.com/hosam-hubspire/expo-project-bootstrap/blob/main/templates/TOKEN_SYNC.md). Requires **Design tokens GitHub URL** from intake.

1. Review the intake GitHub repo (clone shallow / `gh`) — inventory export layout
2. Implement `scripts/sync-design-tokens.mjs` (`transformAndWrite`) so it fetches that repo and writes Uniwind files under `src/theme/tokens/generated/`
3. `bun run tokens:sync` → uniwind artifacts → re-run Phase C
4. Confirm with user; leave the script as the supported re-sync path (`bun run tokens:sync`)

**Gate:** real generated tokens; lint/test/tsc pass before Phase D. If the GitHub URL is missing, private, or the export format cannot be automated yet, keep stubs; document pending work — do not mark B complete.

**Before commit:** filled project README (not stock Expo). Commit on `main`; push if GitHub repo provided. Completion summary + mandatory **Run report** as an agent chat message (no report file) — [SKILL.md](SKILL.md) Phase R.

## Constraints

Latest Expo default template · merge templates into scaffold · replace stock README before Phase D · token generate only when sync on · never hand-edit `generated/*` · C2/B gates per intake · EAS A2 only when EAS on · resolve versions at install time · assemble navigation from modules · `Screen` + insets over `SafeAreaView` · no `@react-navigation/*` app imports · native only · always post Phase R run report in chat (timing, incidents, security review; secrets redacted; no `.md` report file)
