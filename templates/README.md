# Bootstrap templates

Adapt **after** `bunx create-expo-app@latest … --template default` and removing default cruft.

## Steps

1. Merge — don’t bulk-copy `package.json`, `app.json`, `tsconfig.json`.
2. Install (below) — skip unchecked groups. Expo: `bunx expo install`. Else: `bun add …@latest`. Never copy version pins.
3. Add: lint/CI, `.rnstorybook/`, `codegen.ts`, `src/`, `assets/`. `eas.json` only when EAS on.
4. **Tokens** — sync **on:** copy `scripts/sync-design-tokens.mjs`, pin GitHub URL, add `tokens:sync`, stub `generated/`. Sync **off:** stub `generated/` only; no `tokens:*`. See [`TOKEN_SYNC.md`](./TOKEN_SYNC.md). Stubs may use Uniwind `@variant light` / `dark` for the default scaffold’s **appearance** demo — that is **not** a map of Figma collection modes. Phase B replaces stubs using intake **appearance** + **color schemes**.

### Appearance vs color schemes

- **Auto-detect** in Phase B from Figma color mode names ([TOKEN_SYNC.md](./TOKEN_SYNC.md)): exact `light`/`dark` → appearance; other names → product color schemes (often light-only).
- **Appearance** (`themePreference`): only when detection finds light/dark modes.
- **Color scheme** (`colorScheme`): Figma modes such as Default / Rider Tools — never driven via `setTheme("dark")` unless that mode is literally appearance-dark.
- Light-only (typical multi-scheme export): lock Uniwind schemes; hide dark/system in Settings.
- Multi-scheme: Settings scheme toggle; single scheme: no toggle.
- Stubs may use Uniwind `@variant light` / `dark` for the default scaffold’s appearance demo — Phase B replaces per detection.
5. Replace demo routes with `src/app/` (default: tabs + intro). Tabs: Expo Router JS `Tabs` + `assets/icons/*.svg`.
6. **Nav** — toggles per [`navigation/README.md`](./navigation/README.md).
7. Strip unchecked — [`optional/minimal`](./optional/minimal/README.md). REST → [`optional/rest`](./optional/rest/README.md).
8. **Biome** — after `biome.json`: `bunx biome migrate --write`. `useFilenamingConvention` off. Keep `templates/` Biome-clean when editing.
9. **Uniwind** — `bunx uniwind generate-artifacts --css ./src/global.css --dts ./src/uniwind-types.d.ts`. CSS entry `src/global.css`; `withUniwindConfig` outermost.
10. **Argent** — only when any smoke on: `bunx @swmansion/argent init -y`, then `lint:fix`. Skip when both smokes off.
11. **EAS** — when on: merge `eas.json`, `expo.owner`, `expo-dev-client`, `eas init` (skill Phase A2).
12. **Tokens Phase B** — when sync on, after C2 (or C): [`TOKEN_SYNC.md`](./TOKEN_SYNC.md).
13. **Project README** — fill [`project-README.md`](./project-README.md) before Phase D.

**`.gitignore` merge** (append): `.env`, `src/uniwind-types.d.ts`, `.test-screenshots/`, `coverage/`, and `.tokens-cache/` when sync on.

**Safe area** — `Screen` + `useSafeAreaInsets()`; no `SafeAreaView`. Tabs: `edges={["top","left","right"]}`. Drawer header visible → `Screen` skips top inset.

**Toasts** — `<AppToast />` in root `_layout` (always). `toast.*` from `@/utils/toast`. Settings: `ToastExamples` + `SettingsUI/`.

**Bottom sheet** — always. Wrap root in `BottomSheetProvider` (inside `KeyboardProvider`). Fabric native — needs a dev/client build (`expo run:*` / prebuild), not Expo Go. Settings: `BottomSheetExamplesRoot` + `BottomSheetExamples` (inline + backdrop, modal + scrim, keyboard, a11y).

**Permissions** — when any on: `PermissionsExamples/` + Settings import; trim labels. [`permissions/README.md`](./src/utils/permissions/README.md).

## Installs

| Package type | Command | Version |
|--------------|---------|---------|
| Expo / SDK | `bunx expo install <pkg>` | SDK-compatible (no `@latest`) |
| Jest / `@types/jest` | After `jest-expo` — from its `babel-jest` dep | **Never `@latest`** |
| Everything else | `bun add <pkg>@latest` / `-d` | `@latest` |

Never `--verbose` on `bunx expo install`. Prefer `bun install --verbose` for exit-0. Avoid `--verbose` on `bun add` (can log `Authorization` headers).

### Core (always)

```bash
bunx expo install expo-localization expo-font jest-expo react-native-keyboard-controller
JEST_RANGE=$(node -p "require('jest-expo/package.json').dependencies['babel-jest']")
bun add -d jest@${JEST_RANGE} @types/jest@${JEST_RANGE}
bun add uniwind@latest tailwindcss@latest zustand@latest react-native-mmkv@latest react-native-nitro-modules@latest react-native-nano-icons@latest react-native-toast-message@latest react-hook-form@latest zod@latest @hookform/resolvers@latest @swmansion/react-native-bottom-sheet@latest
bun add -d @biomejs/biome@latest eslint@latest eslint-plugin-react-native-a11y@latest typescript-eslint@latest @testing-library/react-native@latest
bunx biome migrate --write
```

### EAS (when on)

```bash
bunx expo install expo-dev-client
```

### Navigation (when toggles on)

> **Expo SDK 56+ / Drawer — do not install `@react-navigation/drawer`.**  
> Expo Router’s `expo-router/drawer` uses gesture-handler · reanimated · worklets only. Adding `@react-navigation/drawer` (including to “fix” a missing peer resolve) causes errors on SDK 56+. Import `Drawer` from `expo-router/drawer` only — never `@react-navigation/*` in app code.

```bash
# Drawer on — peers ONLY (hard stop: never @react-navigation/drawer)
bunx expo install react-native-gesture-handler react-native-reanimated react-native-worklets

# Auth on
bunx expo install expo-secure-store
```

| From `navigation/auth/` | To |
|-------------------------|-----|
| `session-provider.tsx` | `src/providers/session-provider.tsx` |
| `use-storage-state.ts` | `src/hooks/use-storage-state.ts` |
| `sign-in.tsx` | `src/app/sign-in.tsx` |
| `sign-out-button.tsx` | Settings (optional) |

Also `src/constants/session.ts` whenever **GraphQL or REST** is on (SecureStore key for Apollo auth link / axios Bearer) — **even if Auth is off**. Do not strip it with Auth-off nav cleanup. Auth on additionally copies `SessionProvider` / `sign-in` / `use-storage-state`.

GraphQL + auth:

```tsx
<AppApolloProvider>
  <SessionProvider>{/* … */}</SessionProvider>
</AppApolloProvider>
```

### Permissions (when on)

Matrix + plugins: [`permissions/README.md`](./src/utils/permissions/README.md).

```bash
bunx expo install expo-audio                              # mic
bunx expo install expo-location                           # location fg
bunx expo install expo-location expo-task-manager         # location bg (+ fg)
bunx expo install expo-notifications                      # notifications
bunx expo install expo-image-picker                       # camera + photos
bunx expo install expo-document-picker expo-file-system   # documents
```

Always copy when any on: `types.ts`, `ios-strings.ts`, `open-settings.ts`, `index.ts` (trim exports). Plus selected modules. Merge iOS strings from `IOS_PERMISSION_STRINGS`. Copy `PermissionsExamples/` + Settings import.

### Default stack (unless unchecked)

```bash
bun add i18next@latest react-i18next@latest
# GraphQL (default) — skip when REST or none
bun add @apollo/client@latest graphql@latest graphql-ws@latest apollo3-cache-persist@latest @graphql-typed-document-node/core@latest
bunx expo install expo-secure-store
bun add -d @graphql-codegen/cli@latest @graphql-codegen/client-preset@latest
# REST instead of GraphQL:
# bun add axios@latest && bunx expo install expo-secure-store
bun add -d storybook@latest @storybook/react-native@latest @storybook/addon-ondevice-actions@latest @storybook/addon-ondevice-backgrounds@latest @storybook/addon-ondevice-controls@latest @storybook/addon-ondevice-notes@latest
bun install --verbose
```

GraphQL or REST both need `expo-secure-store` (auth link / Bearer interceptor). REST files: [`optional/rest`](./optional/rest/README.md) — do not copy GraphQL stack.

### Dev `.env` (gitignored)

GraphQL: `EXPO_PUBLIC_GRAPHQL_URL=https://rickandmortyapi.com/graphql`  
REST: `EXPO_PUBLIC_API_URL=https://jsonplaceholder.typicode.com`  
Subscriptions: `EXPO_PUBLIC_GRAPHQL_SUBSCRIPTIONS_ENABLED=true` (+ optional `EXPO_PUBLIC_GRAPHQL_WS_URL`).

After Phase B fonts: install packages matching exported families; load via `expo-font`.

## Scripts

| Script | When |
|--------|------|
| `lint` / `lint:fix` / `lint:a11y` | always |
| `test` / `test:watch` | always |
| `tokens:sync` | token sync on — `"tokens:sync": "node scripts/sync-design-tokens.mjs"` |
| `graphql:generate` | GraphQL on |
| `storybook` / `storybook-generate` | Storybook on |

## Icons

SVGs + glyphmap in `assets/icons/`. Replace from Figma → `expo prebuild`. Tab bar: `AppTabs` + `home`/`settings` SVGs.

**Gotcha:** `tabBarIcon` `color` is RN `ColorValue`; template `Icon` coerces for nano-icons — do not narrow `Icon` `color` to `string` only (tsc fails on `AppTabs`).
