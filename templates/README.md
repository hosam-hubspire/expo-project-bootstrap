# Bootstrap templates

Adapt into a new app **after** `bunx create-expo-app@latest … --template default` and removing default cruft.

## Steps

1. Merge scaffold with templates — don't bulk-copy `package.json`, `app.json`, `tsconfig.json`.
2. Install deps (below) — skip groups for unchecked stack items. **Expo packages:** `bunx expo install` (SDK-compatible). **All other packages:** `bun add …@latest`. Never copy version pins from this repo.
3. Add template files: lint/CI, `.rnstorybook/`, `codegen.ts`, `src/`, `assets/`. Include `eas.json` only when **Setup EAS** is on at intake.
4. **Token scripts** — when **Sync design tokens is on** at intake: copy `scripts/sync-design-tokens.mjs`, pin the intake GitHub URL in the script (or document `TOKENS_GITHUB_URL`), add `tokens:sync` to `package.json`, and copy stub `generated/` so Phase C passes before B. Do **not** require `tokens:discover` / `tokens:generate` or empty `raw/` for the sync-on path. When **off** (default): copy stub `generated/` **and** stub `raw/` JSON; no `tokens:*` scripts. Legacy `discover-figma-raw.mjs` / `generate-design-tokens.mjs` remain in the bootstrap repo as optional emitter reference only — see [`TOKEN_SYNC.md`](./TOKEN_SYNC.md).
5. Replace demo routes with template `src/app/` (**default nav: tabs + intro**). Tabs use Expo Router JS `Tabs` (`AppTabs`) with nano icons from `assets/icons/*.svg` (`home`, `settings`).
6. **Navigation assembly** — apply intake toggles (tabs / drawer / intro / auth) per [`navigation/README.md`](./navigation/README.md). Copy modules from `navigation/auth/`, `navigation/drawer/`, `navigation/screens/` only when needed; compose `RootNavigator` guards.
7. Strip unchecked stack — [`optional/minimal/README.md`](./optional/minimal/README.md). When **API client is REST**, assemble via [`optional/rest/README.md`](./optional/rest/README.md) instead of the default GraphQL Home/provider.
8. **Biome** — after copying `biome.json`, run `bunx biome migrate --write` (installs schema matching the installed CLI). `useFilenamingConvention` is **off** — keep template names such as `SettingsUI.tsx`; do not rename to match exports. Keep this `templates/` tree Biome-formatted when editing so Phase C does not need a first-pass `lint:fix` only to normalize copies.
9. **Uniwind types** — `bunx uniwind generate-artifacts --css ./src/global.css --dts ./src/uniwind-types.d.ts`. CSS entry must be `src/global.css`; `withUniwindConfig` must be the outermost Metro wrapper.
10. Argent — **only when any smoke is on at intake** (iOS and/or Android): `bunx @swmansion/argent init -y`, then `bun run lint:fix`. Before C2 CLI use: `argent server status` → relink if token rotated → `argent tools` must not 401. **Skip Argent init when both smokes are off.** Template `biome.json` ignores Argent MCP/settings paths (harmless when Argent is absent).
11. EAS (when enabled at intake) — merge `eas.json`, set `expo.owner`, `bunx expo install expo-dev-client`, `bunx eas-cli init --non-interactive` (see bootstrap skill Phase A2).
12. Design tokens (if enabled at intake) — **after C2 when iOS smoke on, else after Phase C** — Design-tokens GitHub URL from intake; implement + run `tokens:sync` per [`TOKEN_SYNC.md`](./TOKEN_SYNC.md).
13. **Project README** — replace stock Expo `README.md` with a filled [`project-README.md`](./project-README.md) from intake (before Phase D commit).

**`.gitignore` merge** — add to scaffold `.gitignore` (do not replace): `.env`, `src/uniwind-types.d.ts`, `.test-screenshots/`, `coverage/`, and `.tokens-cache/` when token sync is on.

**Safe area** — screens use the `Screen` component (`src/components/Screen`), which applies [`useSafeAreaInsets()`](https://docs.expo.dev/versions/latest/sdk/safe-area-context/#usesafeareainsets) on an outer `style` and keeps Uniwind classes on `contentClassName`. Do not use `SafeAreaView`. Tab routes: `edges={["top","left","right"]}`. When a navigator header is visible (`headerShown: true`, e.g. Drawer), `Screen` skips the top inset automatically so content is not double-padded. Full-screen flows (onboarding, auth): default edges + `footer` for the primary CTA.

**Toasts** — `<AppToast />` is mounted in the root `_layout.tsx` (core, always). Call `toast.success()`, `toast.error()`, or `toast.info()` from `@/utils/toast` anywhere in the app. Settings includes a **ToastExamples** panel with sample buttons (uses shared `SettingsUI` row/panel primitives — copy `src/components/SettingsUI/` with Settings).

**Permissions demos** — when any permission toggle is on, copy `src/components/PermissionsExamples/`, add the import + `<PermissionsExamples />` to Settings, and keep only `labels` keys (plus matching imports/rows in `PermissionsExamples.tsx`) for selected capabilities. See [`src/utils/permissions/README.md`](./src/utils/permissions/README.md). Do not leave commented-out scaffold placeholders in Settings.

## Installs

**Version policy:**

| Package type | Command | Version |
|--------------|---------|---------|
| Expo / SDK-aligned | `bunx expo install <pkg>` | SDK-compatible (no `@latest`) |
| Jest / `@types/jest` | After `jest-expo` — derive from its `babel-jest` dep | **Never `@latest`** — Jest 30 breaks `jest-expo` |
| Everything else | `bun add <pkg>@latest` or `bun add -d <pkg>@latest` | `@latest` always |

**Never pass `--verbose` to `bunx expo install`** — it is not supported. Prefer `bun install --verbose` for the required exit-0 gate. On `bun add`, avoid `--verbose` when possible: it can print registry `Authorization` Bearer headers into logs. If a verbose `bun add` hangs, kill and retry without `--verbose`.

### Core (always)

```bash
bunx expo install expo-localization expo-font jest-expo
# Pin Jest to jest-expo's stack — never jest@latest (Jest 30 breaks jest-expo)
JEST_RANGE=$(node -p "require('jest-expo/package.json').dependencies['babel-jest']")
bun add -d jest@${JEST_RANGE} @types/jest@${JEST_RANGE}
bun add uniwind@latest tailwindcss@latest zustand@latest react-native-mmkv@latest react-native-nitro-modules@latest react-native-nano-icons@latest react-native-toast-message@latest
bun add -d @biomejs/biome@latest eslint@latest eslint-plugin-react-native-a11y@latest typescript-eslint@latest @testing-library/react-native@latest
bunx biome migrate --write
```

### EAS (when Setup EAS is on at intake)

```bash
bunx expo install expo-dev-client
```

### Navigation (when toggles enabled at intake)

```bash
# Drawer on (SDK 56+) — bundled in expo-router; only animation/gesture peers
# https://docs.expo.dev/router/advanced/drawer/#installation
bunx expo install react-native-gesture-handler react-native-reanimated react-native-worklets

# Protected / auth on — secure session persistence (see navigation/auth/)
bunx expo install expo-secure-store
```

Copy auth files into the app:

| From `navigation/auth/` | To |
|-------------------------|-----|
| `session-provider.tsx` | `src/providers/session-provider.tsx` |
| `use-storage-state.ts` | `src/hooks/use-storage-state.ts` |
| `sign-in.tsx` | `src/app/sign-in.tsx` |
| `sign-out-button.tsx` | use in Settings (optional) |

Also ensure `templates/src/constants/session.ts` → `src/constants/session.ts` (`SESSION_STORAGE_KEY`, shared with the Apollo auth link).

When GraphQL is on, nest providers as:

```tsx
<AppApolloProvider>
  <SessionProvider>{/* … */}</SessionProvider>
</AppApolloProvider>
```

### Permissions (when toggles enabled at intake)

See [`src/utils/permissions/README.md`](./src/utils/permissions/README.md) for the full matrix, `app.json` plugin snippets, and iOS Info.plist keys.

```bash
# Microphone (audio / video recording)
bunx expo install expo-audio

# Location (foreground)
bunx expo install expo-location

# Location (background) — also install foreground; merge background plugin options
bunx expo install expo-location expo-task-manager

# Notifications
bunx expo install expo-notifications

# Image picker (camera + photos/videos on device)
bunx expo install expo-image-picker

# Documents / file system
bunx expo install expo-document-picker expo-file-system
```

Copy into the app:

| Always (when any permission on) | `types.ts`, `ios-strings.ts`, `open-settings.ts`, `index.ts` |
|---------------------------------|----------------------------------------------------------------|
| Microphone | `microphone.ts` |
| Location (foreground or background) | `location.ts` |
| Notifications | `notifications.ts` |
| Image picker (camera + photos/videos) | `image-picker.ts` |
| Documents / file system | `documents.ts` |

Merge iOS usage strings from `IOS_PERMISSION_STRINGS` in `ios-strings.ts` into each plugin block. Trim `index.ts` exports to match copied modules.

Also copy `src/components/PermissionsExamples/` and add the Settings import + `<PermissionsExamples />` (no commented placeholders). Pass only `labels` for selected toggles; trim unused imports/rows in `PermissionsExamples.tsx`.

### Default stack (unless unchecked)

```bash
bun add i18next@latest react-i18next@latest
# API client: GraphQL (default) — skip this block when REST or none
bun add @apollo/client@latest graphql@latest graphql-ws@latest apollo3-cache-persist@latest @graphql-typed-document-node/core@latest
bunx expo install expo-secure-store
bun add -d @graphql-codegen/cli@latest @graphql-codegen/client-preset@latest
# API client: REST — use instead of GraphQL block (mutually exclusive)
# bun add axios@latest
# bunx expo install expo-secure-store
bun add -d storybook@latest @storybook/react-native@latest @storybook/addon-ondevice-actions@latest @storybook/addon-ondevice-backgrounds@latest @storybook/addon-ondevice-controls@latest @storybook/addon-ondevice-notes@latest
bun install --verbose
```

**GraphQL:** Apollo SecureStore auth link (`SESSION_STORAGE_KEY`) — install `expo-secure-store` whenever GraphQL is on (even if Protected/auth is off).

**REST:** axios request interceptor uses the same `SESSION_STORAGE_KEY` — install `expo-secure-store` whenever REST is on. Assemble files per [`optional/rest/README.md`](./optional/rest/README.md). Do not copy GraphQL services/provider/examples/codegen.

### GraphQL dev placeholder

When API client is GraphQL, add `.env.example` and a local `.env` (gitignored) before C2:

```bash
EXPO_PUBLIC_GRAPHQL_URL=https://rickandmortyapi.com/graphql
```

The bundled `ExampleQuery` fetches a character from the Rick and Morty API. Home shows `<GraphQLExamples />`. Subscriptions: `EXPO_PUBLIC_GRAPHQL_SUBSCRIPTIONS_ENABLED=true` (+ optional `EXPO_PUBLIC_GRAPHQL_WS_URL`). Run `graphql:generate` when `.graphql` ops change.

### REST dev placeholder

When API client is REST:

```bash
EXPO_PUBLIC_API_URL=https://jsonplaceholder.typicode.com
```

Home shows `<RestExamples />` (`GET /todos/1` via `fetchExampleTodo`). Replace with your base URL and endpoints under `src/services/rest/`.

**Fonts:** after Phase B, install packages matching exported Figma families; load via `expo-font`. See `font-families.css` from `tokens:sync`.

## Scripts

| Script | When |
|--------|------|
| `lint` / `lint:fix` / `lint:a11y` | always |
| `test` / `test:watch` | always |
| `tokens:sync` | token sync enabled — fetch GitHub tokens repo → Uniwind `generated/` |
| `graphql:generate` | GraphQL enabled |
| `storybook` / `storybook-generate` | Storybook enabled |

Add the sync script to `package.json` **only when Sync design tokens is on**:

```json
"tokens:sync": "node scripts/sync-design-tokens.mjs"
```

## Icons

Sample SVGs + glyphmap in `assets/icons/`. Replace SVGs from Figma → `bunx expo prebuild`.

Tab bar uses Expo Router JS [`Tabs`](https://docs.expo.dev/router/advanced/tabs/) (`src/components/AppTabs`) with nano `Icon` glyphs from `assets/icons/home.svg` and `assets/icons/settings.svg` (not scaffold PNG tab icons).

**`ColorValue` vs string:** Expo Router `tabBarIcon` passes `color` as RN [`ColorValue`](https://reactnative.dev/docs/colors). `react-native-nano-icons` expects a `string`. Template `Icon` accepts `ColorValue` and coerces to string before calling nano-icons — do not narrow `Icon`’s `color` prop back to `string` only, or Phase C `tsc` fails on `AppTabs`.

## Template formatting

Keep `templates/` Biome-clean (same rules as shipped `biome.json`). After editing template sources, from a bootstrapped app (or with `@biomejs/biome` available) run `biome check --write` against the touched template files so Phase C does not need a first-pass `lint:fix` just to normalize imports/format.

## Stub tokens (sync off — default)

When **Sync design tokens** is off at intake (default), ship pre-built `src/theme/tokens/generated/` **and** template stub exports in `src/theme/tokens/raw/`. No token scripts, no `tokens:*` scripts in `package.json`. Enable sync later via intake + Phase B — [`TOKEN_SYNC.md`](./TOKEN_SYNC.md).
