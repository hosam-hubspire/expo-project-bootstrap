# Bootstrap templates

Adapt into a new app **after** `bunx create-expo-app@latest … --template default` and removing default cruft.

## Steps

1. Merge scaffold with templates — don't bulk-copy `package.json`, `app.json`, `tsconfig.json`.
2. Install deps (below) — skip groups for unchecked stack items. **Expo packages:** `bunx expo install` (SDK-compatible). **All other packages:** `bun add …@latest`. Never copy version pins from this repo.
3. Add template files: lint/CI, `.rnstorybook/`, `codegen.ts`, `src/`, `assets/`. Include `eas.json` only when **Setup EAS** is on at intake.
4. **Token scripts** — copy `scripts/discover-figma-raw.mjs`, `scripts/generate-design-tokens.mjs`, `scripts/figma-export-helpers.js` **only when Sync design tokens is on** at intake. **Always** copy `src/theme/tokens/raw/` — template stub JSON when sync is off; empty `raw/` (README only) when sync is on. When off (default), also copy pre-built `src/theme/tokens/generated/`; no `tokens:discover` / `tokens:generate` in `package.json`.
5. Replace demo routes with template `src/app/` (**default nav: tabs + intro**). Tabs use Expo Router JS `Tabs` (`AppTabs`) with nano icons from `assets/icons/*.svg` (`home`, `settings`).
6. **Navigation assembly** — apply intake toggles (tabs / drawer / intro / auth) per [`navigation/README.md`](./navigation/README.md). Copy modules from `navigation/auth/`, `navigation/drawer/`, `navigation/screens/` only when needed; compose `RootNavigator` guards.
7. Strip unchecked stack — [`optional/minimal/README.md`](./optional/minimal/README.md).
8. **Biome** — after copying `biome.json`, run `bunx biome migrate --write` (installs schema matching the installed CLI).
9. **Uniwind types** — `bunx uniwind generate-artifacts --css ./src/theme/global.css --dts ./src/uniwind-types.d.ts` (CLI has no `generate-types`).
10. Argent — `bunx @swmansion/argent init -y`, then `bun run lint:fix` (or `bunx biome check --write .`) so generated MCP JSON is Biome-clean before Phase C. Before C2 CLI smoke tests: `argent server status` → relink if token rotated → `argent tools` must not 401. Template `biome.json` also ignores Argent MCP/settings paths.
11. EAS (when enabled at intake) — merge `eas.json`, set `expo.owner`, `bunx expo install expo-dev-client`, `bunx eas-cli init --non-interactive` (see bootstrap skill Phase A2).
12. Design tokens (if enabled at intake) — **after C2** — collect Figma URL at intake; export per [`FIGMA_EXPORT.md`](./FIGMA_EXPORT.md).
13. **Project README** — replace stock Expo `README.md` with a filled [`project-README.md`](./project-README.md) from intake (before Phase D commit).

**`.gitignore` merge** — add to scaffold `.gitignore` (do not replace): `.env`, `src/uniwind-types.d.ts`, `.test-screenshots/`, `coverage/`.

**Safe area** — screens use the `Screen` component (`src/components/Screen`), which applies [`useSafeAreaInsets()`](https://docs.expo.dev/versions/latest/sdk/safe-area-context/#usesafeareainsets) on an outer `style` and keeps Uniwind classes on `contentClassName`. Do not use `SafeAreaView`. Tab routes: `edges={["top","left","right"]}`. Full-screen flows (onboarding, auth): default edges + `footer` for the primary CTA.

**Toasts** — `<AppToast />` is mounted in the root `_layout.tsx` (core, always). Call `toast.success()`, `toast.error()`, or `toast.info()` from `@/utils/toast` anywhere in the app. Settings includes a **ToastExamples** panel with sample buttons.

**Permissions demos** — when any permission toggle is on, copy `src/components/PermissionsExamples/`, enable the commented block in Settings (import + `<PermissionsExamples />`), and keep only `labels` keys (plus matching imports/rows in `PermissionsExamples.tsx`) for selected capabilities. See [`src/utils/permissions/README.md`](./src/utils/permissions/README.md).

## Installs

**Version policy:**

| Package type | Command | Version |
|--------------|---------|---------|
| Expo / SDK-aligned | `bunx expo install <pkg>` | SDK-compatible (no `@latest`) |
| Jest / `@types/jest` | After `jest-expo` — derive from its `babel-jest` dep | **Never `@latest`** — Jest 30 breaks `jest-expo` |
| Everything else | `bun add <pkg>@latest` or `bun add -d <pkg>@latest` | `@latest` always |

**Never pass `--verbose` to `bunx expo install`** — it is not supported. Use `--verbose` on `bun add` only.

### Core (always)

```bash
bunx expo install expo-localization expo-font jest-expo
# Pin Jest to jest-expo's stack — never jest@latest (Jest 30 breaks jest-expo)
JEST_RANGE=$(node -p "require('jest-expo/package.json').dependencies['babel-jest']")
bun add -d jest@${JEST_RANGE} @types/jest@${JEST_RANGE}
bun add --verbose uniwind@latest tailwindcss@latest zustand@latest react-native-mmkv@latest react-native-nitro-modules@latest react-native-nano-icons@latest react-native-toast-message@latest
bun add -d --verbose @biomejs/biome@latest eslint@latest eslint-plugin-react-native-a11y@latest typescript-eslint@latest @testing-library/react-native@latest
bunx biome migrate --write
```

### EAS (when Setup EAS is on at intake)

```bash
bunx expo install expo-dev-client
```

### Navigation (when toggles enabled at intake)

```bash
# Drawer on — expo-router/drawer still needs the React Navigation drawer package + gesture stack
bunx expo install @react-navigation/drawer react-native-gesture-handler react-native-reanimated react-native-worklets

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

Also copy `src/components/PermissionsExamples/` and enable the Settings demo block (uncomment import + `<PermissionsExamples />` in settings screens). Pass only `labels` for selected toggles; trim unused imports/rows in `PermissionsExamples.tsx`.

### Default stack (unless unchecked)

```bash
bun add --verbose i18next@latest react-i18next@latest
bun add --verbose @apollo/client@latest graphql@latest graphql-ws@latest apollo3-cache-persist@latest @graphql-typed-document-node/core@latest
bunx expo install expo-secure-store
bun add -d --verbose @graphql-codegen/cli@latest @graphql-codegen/client-preset@latest
bun add -d --verbose storybook@latest @storybook/react-native@latest @storybook/addon-ondevice-actions@latest @storybook/addon-ondevice-backgrounds@latest @storybook/addon-ondevice-controls@latest @storybook/addon-ondevice-notes@latest
bun install --verbose
```

GraphQL’s Apollo client includes a SecureStore auth link (`SESSION_STORAGE_KEY` in `src/constants/session.ts`) — install `expo-secure-store` whenever GraphQL is on (even if Protected/auth is off; the link no-ops without a token).

### GraphQL dev placeholder

When GraphQL is enabled, add `.env.example` and a local `.env` (gitignored) before C2:

```bash
EXPO_PUBLIC_GRAPHQL_URL=https://countries.trevorblades.com/
```

The bundled `ExampleQuery` (`__typename`) works against any GraphQL endpoint. Replace with your project URL before shipping. Subscriptions: `EXPO_PUBLIC_GRAPHQL_SUBSCRIPTIONS_ENABLED=true` (+ optional `EXPO_PUBLIC_GRAPHQL_WS_URL`).

Run `graphql:generate` when `.graphql` ops change (requires `EXPO_PUBLIC_GRAPHQL_URL`).

**Fonts:** after Phase B, install packages matching exported Figma families; load via `expo-font`. See `font-families.css` from `tokens:generate`.

## Scripts

| Script | When |
|--------|------|
| `lint` / `lint:fix` / `lint:a11y` | always |
| `test` / `test:watch` | always |
| `tokens:discover` | token sync enabled — Phase B |
| `tokens:generate` | token sync enabled — Phase B |
| `graphql:generate` | GraphQL enabled |
| `storybook` / `storybook-generate` | Storybook enabled |

Add token scripts to `package.json` **only when Sync design tokens is on**:

```json
"tokens:discover": "node scripts/discover-figma-raw.mjs",
"tokens:generate": "node scripts/generate-design-tokens.mjs"
```

## Icons

Sample SVGs + glyphmap in `assets/icons/`. Replace SVGs from Figma → `bunx expo prebuild`.

Tab bar uses Expo Router JS [`Tabs`](https://docs.expo.dev/router/advanced/tabs/) (`src/components/AppTabs`) with nano `Icon` glyphs from `assets/icons/home.svg` and `assets/icons/settings.svg`. Do not use `expo-router/unstable-native-tabs` or scaffold `tabIcons/*.png`.

## Stub tokens (sync off — default)

When **Sync design tokens** is off at intake (default), ship pre-built `src/theme/tokens/generated/` **and** template stub exports in `src/theme/tokens/raw/`. No token scripts, no `tokens:*` scripts in `package.json`. Enable sync later via intake + Phase B — [`FIGMA_EXPORT.md`](./FIGMA_EXPORT.md).
