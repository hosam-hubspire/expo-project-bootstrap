---
name: bootstrap
description: >-
  Bootstrap a new Expo React Native app from architectural templates (Uniwind,
  Bun, Biome, design tokens, nano-icons, i18n, GraphQL, Storybook, mixable Expo
  Router navigation). Use when the user asks to scaffold, bootstrap, or create a
  new Expo app or React Native project.
disable-model-invocation: true
---

# Bootstrap

**Repo:** https://github.com/hosam-hubspire/expo-project-bootstrap

## Intake (before any work)

Run intake first — even when the user already gave app name, stack prefs, or token-sync intent. **Two steps only project name is asked before the defaults shortcut.**

**Do not** scaffold or install until intake is done.

### Step 1 — App name (always)

Ask **only** for app name / slug (folder + `app.json`). Pre-fill from the user's message if they already gave one; still confirm the name.

### Step 2 — Use defaults? (always, immediately after Step 1)

Ask whether to **use defaults for all remaining options** and skip the detailed form.

| Choice | Effect |
|--------|--------|
| **Yes — use defaults (Recommended)** | Skip Step 3; apply the default row below |
| **No — customize** | Run Step 3 (full form or conversational follow-up) |

**Defaults** (when Step 2 is Yes):

| Input | Value |
|-------|-------|
| GitHub repo | none (local-only) |
| Setup EAS | on |
| Expo account owner | `hubspire` |
| Sync design tokens | off (template `generated/` + `raw/` stubs) |
| Stack toggles | i18n, GraphQL, Storybook (all on) |
| GraphQL subscriptions | off |
| **Navigation** | **Tabs on · Drawer off · Intro on · Protected/auth off** |
| Android smoke test | off (iOS simulator only) |
| **Permissions** | **all off** (microphone, location, notifications, image picker, documents) |

When the user chose defaults, **do not** re-ask those fields — proceed to [bootstrap.md](bootstrap.md).

### Step 3 — Detailed intake (only when Step 2 is No)

**AskQuestion** (one form) when available; otherwise one conversational message. Pre-fill from the user's message; still confirm every field.

| Input | Required | Notes |
|-------|----------|-------|
| GitHub repo | No | Local-only if omitted |
| Setup EAS | Yes | Link project, `eas.json`, cloud simulator build in C2 — **on by default** |
| Expo account owner | No | Only when EAS on — **`hubspire` by default** (`expo.owner` in `app.json`) |
| Sync design tokens | Yes | Phase B after C2 — **off by default** |
| Figma design tokens URL | When sync on | Required — `figma.com/design/…` or `figma.com/file/…` link to the token source file |
| Stack toggles | Yes | i18n, GraphQL, Storybook — **all on by default** |
| **Navigation toggles** | Yes | Orthogonal mix — see below |
| **Permission toggles** | Yes | Device capabilities — see below; **all off by default** |
| Android smoke test | Yes | Argent on Android emulator — **off by default** (iOS only) |

**Setup EAS** — when **on** (default), run Phase A2 and C2 uses an EAS `development-simulator` cloud build installed on the iOS Simulator, then Argent smoke test. When **off**, skip Phase A2 entirely; C2 uses **local** `expo run:ios` / `expo run:android` + Argent.

**Expo account owner** — only ask when **Setup EAS** is on. Set `expo.owner` in `app.json` before `eas init`. Default **`hubspire`** unless intake provides another account slug.

**Sync design tokens** — when **off** (default), copy pre-built `src/theme/tokens/generated/` **and** template stub exports in `src/theme/tokens/raw/` — **no** token scripts (`discover-figma-raw.mjs`, `generate-design-tokens.mjs`, `figma-export-helpers.js`) and **no** `tokens:discover` / `tokens:generate` in `package.json`. When **on**, ask for **Figma design tokens URL** at intake; at scaffold copy token scripts + empty `raw/` (README only); run Phase B after C2 using that URL (Figma MCP / export per [`FIGMA_EXPORT.md`](../../templates/FIGMA_EXPORT.md)) → `discover` → `tokens:generate`.

**Stack toggles** — `allow_multiple: true`, pre-check all three unless user said to skip:

- **i18n** — `i18next`, localized tabs, language toggle
- **GraphQL** — Apollo, `ExampleQuery`, codegen; needs `EXPO_PUBLIC_GRAPHQL_URL` (dev placeholder: `https://countries.trevorblades.com/`)
- **Storybook** — on-device, token + component stories

Also ask: **GraphQL subscriptions** — off by default.

**Navigation toggles** — `allow_multiple: true`. These combine freely (tabs+drawer, auth+tabs, intro+auth+drawer, …). Pre-check **Tabs** and **Intro**; leave Drawer and Protected unchecked unless the user asks.

| Toggle | Default | Meaning |
|--------|---------|---------|
| **Tabs** | on | Bottom tabs under `(app)/(tabs)/` |
| **Drawer** | off | Side drawer; nests tabs when both on |
| **Intro screens** | on | `(onboarding)/` after splash, once until completed |
| **Protected / auth routes** | off | `sign-in` + `Stack.Protected` around `(app)` |

At least one of **Tabs** or **Drawer** should be on for a main shell; if both off, use a flat Stack under `(app)/` (`navigation/screens/` + `app-layout-flat-stack.tsx`).

Assembly rules and file map: [`templates/navigation/README.md`](../../templates/navigation/README.md). Expo docs: [Protected routes](https://docs.expo.dev/router/advanced/protected/), [Authentication](https://docs.expo.dev/router/advanced/authentication/), [Drawer](https://docs.expo.dev/router/advanced/drawer/), [Tabs](https://docs.expo.dev/router/advanced/tabs/).

**Permission toggles** — `allow_multiple: true`. All unchecked by default. When any are on, copy `src/utils/permissions/` per [`templates/src/utils/permissions/README.md`](../../templates/src/utils/permissions/README.md): install listed packages, merge `app.json` config plugins with iOS usage strings from `ios-strings.ts`, copy only selected modules + shared files, trim `index.ts` exports.

| Toggle | Packages |
|--------|----------|
| **Microphone** (audio / video) | `expo-audio` |
| **Location (foreground)** | `expo-location` |
| **Location (background)** | `expo-location`, `expo-task-manager` (implies foreground) |
| **Notifications** | `expo-notifications` |
| **Image picker** (camera + photos/videos) | `expo-image-picker` |
| **Documents / file system** | `expo-document-picker`, `expo-file-system` |

Customize iOS permission copy in `app.json` plugins before shipping. Re-run prebuild after plugin changes.

**Android smoke test** — when **off** (default), run Argent C2 on **iOS simulator only**. When **on**, also boot an Android emulator and run the same checks after iOS passes.

Then follow **[bootstrap.md](bootstrap.md)**.

## Phases

```
- [ ] 0 — Intake
- [ ] A — Scaffold (latest deps, templates, nav assembly, uniwind types, bun install exit 0, project README)
- [ ] A2 — EAS configure (if enabled at intake)
- [ ] C — lint, test, tsc (stub tokens OK)
- [ ] C2 — Argent smoke test (EAS simulator build if A2; else local build)
- [ ] B — Design token sync (if enabled) — export from intake Figma URL → raw/, discover, tokens:generate, re-verify
- [ ] D — Commit (+ push if repo provided) — project README must already replace stock Expo README
```

## Rules

- `bunx create-expo-app@latest --template default` — never hand-roll `package.json`
- **Package versions:** `bunx expo install` for Expo/SDK packages (no `@latest`); `bun add <pkg>@latest` / `bun add -d <pkg>@latest` for everything else. **Exception:** `jest` / `@types/jest` — derive from `jest-expo`'s `babel-jest` dep after `bunx expo install jest-expo`; never `jest@latest`. Never copy version pins from templates.
- **Never pass `--verbose` to `bunx expo install`** — only on `bun add`
- No `move_agent_to_root` during bootstrap
- Grouped installs — `templates/README.md`; skip unchecked stack groups
- Full templates by default; strip — `templates/optional/minimal/README.md`
- **Navigation:** start from `templates/src/app/` (tabs + intro); assemble drawer/auth/flat screens from `templates/navigation/` per intake — never leave unused route groups in the app
- **Hooks:** place React hooks under `src/hooks/` (e.g. auth `use-storage-state.ts`) — never under `src/lib/` (`lib/` is for non-hook utilities like `mmkv`; `utils/` for optional helpers like permissions)
- **Constants:** shared string/number constants under `src/constants/` (e.g. `SESSION_STORAGE_KEY`) — not under `src/lib/`
- **Providers:** when GraphQL and auth are both on, nest `SessionProvider` **inside** `AppApolloProvider`. Apollo auth link reads `SESSION_STORAGE_KEY` from SecureStore (not React context).
- **Token scripts and `tokens:*` package.json scripts only when sync is on**; when off, copy pre-built `generated/` **and** template `raw/` stubs — never copy or add token scripts
- **Drawer on:** `bunx expo install @react-navigation/drawer react-native-gesture-handler react-native-reanimated react-native-worklets` — `expo-router/drawer` still needs `@react-navigation/drawer`
- **Uniwind types in Phase A:** `bunx uniwind generate-artifacts --css ./src/theme/global.css --dts ./src/uniwind-types.d.ts` before Phase C (CLI has no `generate-types`)
- **Biome:** `bun add -d @biomejs/biome@latest` then `bunx biome migrate --write` after copying `biome.json`. Template ignores Argent MCP/settings paths; after `argent init`, run `lint:fix` before Phase C
- **Tab icons:** Expo Router JS `Tabs` with nano `Icon` (`home` / `settings` SVGs) — not `unstable-native-tabs`
- **`app.json` merge:** follow checklist in [bootstrap.md](bootstrap.md) — `experiments` and `extra.eas` are siblings under `expo`
- **GraphQL on:** copy `.env.example`; create local `.env` with `EXPO_PUBLIC_GRAPHQL_URL=https://countries.trevorblades.com/` before C2; gitignore `.env`
- **EAS only when intake enabled:** merge `templates/eas.json`; set `expo.owner` (default `hubspire`); install `expo-dev-client`; `bunx eas-cli init --non-interactive`. If project exists, merge `projectId` from `eas project:info` — do not `--force`
- **C2 with EAS:** `development-simulator` cloud build → `eas build:run` (no `--non-interactive`) → Metro → tap server in dev client → Argent. **C2 without EAS:** local `expo run:ios` (+ `expo run:android` if Android opted in) → Argent
- After `eas build:run`, start Metro (`bun run start`) before Argent launch — dev client needs the bundler
- Expo MCP (`build_run`, `build_list`, …) may be used when EAS is enabled and MCP is authenticated; prefer `eas` CLI for bootstrap reliability
- **Phase B after C2 (when sync enabled):** read `templates/FIGMA_EXPORT.md` from bootstrap repo — do not copy into project; use **Figma design tokens URL** from intake to export into `src/theme/tokens/raw/`; wait for user confirm exports are complete; run `discover-figma-raw.mjs`; adapt `generate-design-tokens.mjs`; `tokens:generate`
- Icons: SVGs to `assets/icons/` → `bunx expo prebuild`
- **Toasts:** copy `src/components/AppToast/` + `src/utils/toast.ts` + `src/components/ToastExamples/`; keep `<AppToast />` in root `_layout.tsx` and ToastExamples on Settings when composing auth/drawer navigators
- **Permissions demos:** when any permission on, copy `PermissionsExamples` and enable the Settings block; trim to selected capabilities
- No one-off bridge scripts under `scripts/`; **iOS/Android only** — no web target, no `Platform.OS === "web"` branches, no `localStorage` / DOM APIs, no web-only packages or polyfills; Bun only
- Remove scaffold web files during Phase A (e.g. `src/app/+html.tsx`, web entry/assets); do not reintroduce web support later
- **Safe area:** prefer [`useSafeAreaInsets()`](https://docs.expo.dev/versions/latest/sdk/safe-area-context/#usesafeareainsets) via the template `Screen` component (`src/components/Screen`) — do **not** use `SafeAreaView`. Insets apply on the outer `style`; Uniwind padding stays on `contentClassName`. Tab screens omit the `bottom` edge (JS `Tabs` bar clears the home indicator). Pin primary CTAs with `footer`.
- **`argent init` ≠ smoke test** — init in Phase A; `lint:fix` after init; launch + verify in C2
- **Argent CLI (C2):** before `argent run`, check `argent server status` (`health: ok`). If the tool-server was started/restarted this session, relink (`argent unlink` → `argent link` with token from `server start`); verify with `argent tools` (not 401). MCP clients may auto-spawn — relink applies mainly to CLI smoke tests
- **No commit or push until C2 passes on iOS** (when Argent available) **and** Phase B complete when token sync was enabled; when Android smoke test was opted in, Android must pass too
- **Project README:** before Phase D, replace the stock Expo `README.md` with a filled copy of [`templates/project-README.md`](../../templates/project-README.md) (app name + intake toggles). Never leave the create-expo-app README in the committed app
- **C2 defaults to iOS only** — do not boot or build Android unless intake selected Android smoke test

## Completion summary

Path, remote URL, commit SHA, EAS on/off (+ owner + project ID + build ID when on), stack toggles, **navigation toggles** (tabs/drawer/intro/auth), **permission toggles** (when any on), token sync on/off (+ Figma URL when on), Android smoke test on/off, token gate, device verification (EAS simulator or local build; + Android if opted in), custom mappings.

**Full workflow:** [bootstrap.md](bootstrap.md) · **Templates:** [templates/README.md](../../templates/README.md) · **Navigation:** [templates/navigation/README.md](../../templates/navigation/README.md)
