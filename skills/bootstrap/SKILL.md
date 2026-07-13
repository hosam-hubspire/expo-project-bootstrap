---
name: bootstrap
description: >-
  Bootstrap a new Expo React Native app from architectural templates (Uniwind,
  Bun, Biome, design tokens, nano-icons, i18n, GraphQL or REST, Storybook,
  mixable Expo Router navigation). Use when the user asks to scaffold,
  bootstrap, or create a new Expo app or React Native project.
disable-model-invocation: true
---

# Bootstrap

**Repo:** https://github.com/hosam-hubspire/expo-project-bootstrap

**Templates:** use a local clone of that repo (`templates/` next to `skills/`). If the skill is installed without the clone, fetch from [templates on GitHub](https://github.com/hosam-hubspire/expo-project-bootstrap/tree/main/templates). Do not rely on `../../templates` from a global skills folder — that path only works inside the repo checkout.

**Workflow detail:** [bootstrap.md](bootstrap.md)

## Intake (before any work)

Run intake first — even when the user already gave app name, stack prefs, or token-sync intent. **Two steps only: project name, then the defaults shortcut.**

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
| Setup EAS | off |
| Expo account owner | `hubspire` |
| Sync design tokens | off (template `generated/` + `raw/` stubs) |
| Stack toggles | i18n, Storybook (all on) |
| **API client** | **GraphQL (Apollo)** |
| GraphQL subscriptions | off |
| **Navigation** | **Tabs on · Drawer off · Intro on · Protected/auth off** |
| **iOS Argent smoke (C2)** | **off** |
| Android smoke test | **off** |
| **Permissions** | **all off** (microphone, location foreground, location background, notifications, image picker, documents) |

When the user chose defaults, **do not** re-ask those fields — proceed to [bootstrap.md](bootstrap.md).

### Step 3 — Detailed intake (only when Step 2 is No)

**AskQuestion** (one form) when available; otherwise one conversational message. Pre-fill from the user's message; still confirm every field.

| Input | Required | Notes |
|-------|----------|-------|
| GitHub repo | No | Local-only if omitted |
| Setup EAS | Yes | Link project, `eas.json`, cloud simulator build in C2 — **off by default** |
| Expo account owner | No | Only when EAS on — **`hubspire` by default** (`expo.owner` in `app.json`) |
| Sync design tokens | Yes | Phase B after C2 — **off by default** |
| Design tokens GitHub URL | When sync on | Required — GitHub repo (or tree/path URL) with Figma token exports from any plugin |
| Stack toggles | Yes | i18n, Storybook — **all on by default** |
| **API client** | Yes | **GraphQL (default)** · REST (axios) · none — mutually exclusive |
| GraphQL subscriptions | When GraphQL | **off by default** |
| **Navigation toggles** | Yes | Orthogonal mix — see below |
| **Permission toggles** | Yes | Device capabilities — see below; **all off by default** |
| **iOS Argent smoke (C2)** | Yes | Device verify on iOS simulator — **off by default** |
| Android smoke test | Yes | Also run Argent on Android emulator after iOS — **off by default** |

**Setup EAS** — when **on**, run Phase A2 and C2 (if iOS smoke on) uses an EAS `development-simulator` cloud build on the iOS Simulator. When **off** (default), skip Phase A2; C2 uses local `expo run:ios` / `expo run:android` when those smokes are on.

**Expo account owner** — only ask when **Setup EAS** is on. Set `expo.owner` in `app.json` before `eas init`. Default **`hubspire`** unless intake provides another account slug.

**Sync design tokens** — when **off** (default), copy pre-built `src/theme/tokens/generated/` **and** template stub exports in `src/theme/tokens/raw/` — **no** token scripts and **no** `tokens:*` scripts in `package.json`. When **on**, ask for **Design tokens GitHub URL** at intake; at scaffold copy `scripts/sync-design-tokens.mjs` + stub `generated/` (Phase C OK before B); add `tokens:sync`. Phase B: review that GitHub repo, implement the sync script’s transform so it writes Uniwind `generated/` output, run it once — users re-run `bun run tokens:sync` later (see [TOKEN_SYNC.md](https://github.com/hosam-hubspire/expo-project-bootstrap/blob/main/templates/TOKEN_SYNC.md)). Do **not** hand-map exports into `raw/` as the Phase B deliverable.

**Stack toggles** — `allow_multiple: true`, pre-check i18n and Storybook unless user said to skip:

- **i18n** — `i18next`, localized tabs, language toggle
- **Storybook** — on-device, token + component stories

**API client** — single choice (not multi-select). Default **GraphQL**. Do not ship GraphQL and REST together.

| Choice | Default | Meaning |
|--------|---------|---------|
| **GraphQL** | yes | Apollo, `ExampleQuery`, Home `<GraphQLExamples />`, codegen; `EXPO_PUBLIC_GRAPHQL_URL` (dev: Rick and Morty) |
| **REST** | no | axios, `src/services/rest/`, Home `<RestExamples />`; `EXPO_PUBLIC_API_URL` (dev: JSONPlaceholder). Assemble via [optional/rest/README.md](https://github.com/hosam-hubspire/expo-project-bootstrap/blob/main/templates/optional/rest/README.md) |
| **none** | no | Strip both API stacks (minimal omit GraphQL + skip REST) |

When **GraphQL**: also ask **GraphQL subscriptions** — off by default (`EXPO_PUBLIC_GRAPHQL_SUBSCRIPTIONS_ENABLED`). Install `expo-secure-store` for the Apollo auth link.

When **REST**: install `axios` + `expo-secure-store` (Bearer interceptor). No codegen script.

**Navigation toggles** — `allow_multiple: true`. These combine freely. Pre-check **Tabs** and **Intro**; leave Drawer and Protected unchecked unless the user asks.

| Toggle | Default | Meaning |
|--------|---------|---------|
| **Tabs** | on | Bottom tabs under `(app)/(tabs)/` |
| **Drawer** | off | Side drawer; nests tabs when both on |
| **Intro screens** | on | `(onboarding)/` after splash, once until completed |
| **Protected / auth routes** | off | `sign-in` + `Stack.Protected` around `(app)` |

At least one of **Tabs** or **Drawer** should be on for a main shell; if both off, use a flat Stack under `(app)/` (`navigation/screens/` + `app-layout-flat-stack.tsx`).

Assembly: [navigation/README.md](https://github.com/hosam-hubspire/expo-project-bootstrap/blob/main/templates/navigation/README.md). Expo docs: [Protected routes](https://docs.expo.dev/router/advanced/protected/), [Authentication](https://docs.expo.dev/router/advanced/authentication/), [Drawer](https://docs.expo.dev/router/advanced/drawer/), [Tabs](https://docs.expo.dev/router/advanced/tabs/).

**Permission toggles** — `allow_multiple: true`. All unchecked by default. When any are on, copy modules per [permissions/README.md](https://github.com/hosam-hubspire/expo-project-bootstrap/blob/main/templates/src/utils/permissions/README.md): install packages, merge `app.json` plugins with iOS strings from `ios-strings.ts`, copy selected modules + shared files, trim `index.ts` exports.

| Toggle | Packages |
|--------|----------|
| **Microphone** (audio / video) | `expo-audio` |
| **Location (foreground)** | `expo-location` |
| **Location (background)** | `expo-location`, `expo-task-manager` (implies foreground) |
| **Notifications** | `expo-notifications` |
| **Image picker** (camera + photos/videos) | `expo-image-picker` |
| **Documents / file system** | `expo-document-picker`, `expo-file-system` |

Customize iOS permission copy in `app.json` plugins before shipping. Re-run prebuild after plugin changes (when native projects exist).

**Smoke tests**

| Toggle | Default | Effect |
|--------|---------|--------|
| **iOS Argent smoke (C2)** | off | Run Phase C2 on iOS simulator (EAS cloud build if EAS on, else local `expo run:ios`) |
| **Android smoke test** | off | After iOS C2 passes, also verify on Android emulator |

When **both off**: skip Phase C2 and skip prebuild in Phase A; Phase C (`lint` / `test` / `tsc`) is enough. User can prebuild later before the first device build. Phrases like “smoke tests all off” mean both toggles off.

Then follow **[bootstrap.md](bootstrap.md)**.

## Phases

```
- [ ] 0 — Intake
- [ ] A — Scaffold (latest deps, templates, nav assembly, uniwind types, bun install exit 0, project README)
- [ ] A2 — EAS configure (if enabled at intake)
- [ ] C — lint, test, tsc (stub tokens OK)
- [ ] C2 — Argent smoke (if iOS smoke on; + Android if opted in)
- [ ] B — Design token sync (if enabled) — after C2 when C2 ran; after C when smokes off
- [ ] D — Commit (+ push if repo provided) — project README must already replace stock Expo README
- [ ] R — Run report (always — agent chat message after all other phases for this session)
```

**Timing:** from Phase 0 onward, record wall-clock start/end (or duration) per phase and per notable sub-step (create-expo-app, installs, template merge, biome/uniwind, Phase C commands, C2, token sync, commit). Approximate is fine if exact timestamps were not captured — say so.

## Rules

Installs, nav assembly, EAS, C2, and token sync steps: **[bootstrap.md](bootstrap.md)** and [templates/README.md](https://github.com/hosam-hubspire/expo-project-bootstrap/blob/main/templates/README.md). Do not duplicate long procedure here.

- `bunx create-expo-app@latest --template default` — never hand-roll `package.json`
- **Package versions:** `bunx expo install` for Expo/SDK packages (no `@latest`); `bun add <pkg>@latest` / `bun add -d <pkg>@latest` otherwise. **Exception:** pin `jest` / `@types/jest` from `jest-expo`'s `babel-jest` range — never `jest@latest`. Never copy version pins from templates.
- **Never pass `--verbose` to `bunx expo install`**. Prefer `bun install --verbose` for the exit-0 gate. On `bun add`, `--verbose` may dump registry `Authorization` headers — if a verbose add hangs or floods logs, kill it and retry **without** `--verbose`; never paste auth headers into chat or the run report
- No `move_agent_to_root` during bootstrap
- Grouped installs + strip unchecked stack — templates README / `optional/minimal/`
- **Navigation:** start from `templates/src/app/`; assemble from `templates/navigation/` per intake — never leave unused route groups
- **Hooks / constants:** auth hook `use-storage-state.ts` → `src/hooks/` (create folder when auth on; base template has no `hooks/`). Constants like `SESSION_STORAGE_KEY` → `src/constants/`. Never put hooks under `src/lib/`
- **Providers:** GraphQL + auth → nest `SessionProvider` **inside** `AppApolloProvider`. REST + auth → `SessionProvider` only (axios interceptor uses SecureStore)
- **Token scripts / `tokens:sync`** only when sync is on; otherwise copy stub `generated/` + `raw/`
- **Drawer on:** install gesture-handler / reanimated / worklets only — drawer is in `expo-router`; do **not** install `@react-navigation/drawer`. Never import `@react-navigation/*` in app code — use `expo-router` / `expo-router/react-navigation` (template `Screen` already does)
- **Uniwind:** CSS entry `src/global.css`; Metro `withUniwindConfig` outermost; `bunx uniwind generate-artifacts --css ./src/global.css --dts ./src/uniwind-types.d.ts` before Phase C
- **Biome:** install `@biomejs/biome@latest`, `bunx biome migrate --write`; `lint:fix` after `argent init` only when any smoke is on. **`useFilenamingConvention` is off** — keep names like `SettingsUI.tsx`. Templates should already be Biome-formatted — Phase C must not require a first-pass `lint:fix` just to normalize copied sources
- **Tabs:** Expo Router JS `Tabs` + nano `Icon` SVGs under `assets/icons/`. Tab `color` is RN `ColorValue`; template `Icon` accepts `ColorValue` and coerces for nano-icons (do not narrow `Icon` `color` to `string` only)
- **API client:** GraphQL → Rick and Morty `.env` + Apollo stack. REST → assemble [optional/rest](https://github.com/hosam-hubspire/expo-project-bootstrap/blob/main/templates/optional/rest/README.md) + JSONPlaceholder `.env`. None → strip GraphQL (minimal) and skip REST. Always gitignore `.env`
- **EAS / C2 / Phase B / prebuild / Argent CLI:** follow [bootstrap.md](bootstrap.md) — skip A2 when EAS off; skip Argent init + C2 + prebuild when both smokes off
- **Toasts + permissions demos:** core toasts always; PermissionsExamples when any permission on
- **Native only** (iOS/Android): remove scaffold web leftovers if present (`web` script/config, `*.web.*`, favicon/`tutorial-web` assets); no `Platform.OS === "web"`, `localStorage`, or web-only packages. Prefer template `Screen` + `useSafeAreaInsets()` over `SafeAreaView`
- **Argent only with smoke:** `argent init` runs in A **only when iOS and/or Android smoke is on**; verify in C2. Never init Argent when both smokes are off
- **Commit gate:** no commit/push until C2 passes when iOS smoke on (and Android when opted in), and Phase B complete when token sync on. When both smokes off, Phase C (+ B if sync) is enough — ask before D
- **Project README:** fill [project-README.md](https://github.com/hosam-hubspire/expo-project-bootstrap/blob/main/templates/project-README.md) before Phase D
- **Run report (always):** after all applicable phases finish (including skipped ones noted as skipped), post the **Run report** as an **agent chat message** (not a file). Do this even when Phase D was declined or deferred. Redact secrets (tokens, passwords, Bearer headers, `.env` values) — never paste them into the report

## Completion summary

Path, remote URL, commit SHA, EAS on/off (+ owner + project ID + build ID when on), stack toggles, **API client** (GraphQL / REST / none), **navigation toggles**, **permission toggles** (when any on), token sync on/off (+ design-tokens GitHub URL when on), **iOS smoke on/off**, **Android smoke on/off**, token gate, device verification (or skipped), custom mappings. Then deliver the **Run report** below in the same or following chat message.

## Run report (Phase R — mandatory)

Always post as an **agent message** after the bootstrap session’s work is done — **do not** write `BOOTSTRAP_REPORT.md` or any other report file. Purpose: improve this skill from real runs.

Use this structure in the chat message:

```markdown
# Bootstrap run report — {{APP_NAME}}

- Date (ISO): …
- Total wall time: …
- Intake: defaults | custom (brief)
- Outcome: success | partial | failed

## Timing by phase / task

| Phase / task | Duration | Notes |
|--------------|----------|-------|
| 0 Intake | … | |
| A create-expo-app | … | |
| A template merge + cruft removal | … | |
| A dependency installs | … | |
| A biome / uniwind / README | … | |
| A2 EAS | … or skipped | |
| C lint / test / tsc | … | |
| C2 Argent smoke | … or skipped | |
| B token sync | … or skipped | |
| D commit / push | … or skipped / deferred | |

## What went wrong or sideways

For each incident: symptom → probable cause → fixes tried → final resolution (or open).
If none: say “None.”

## Security / secret-handling review

Did the agent (or a tool it ran) expose, log, or paste secrets (npm/GitHub/EAS tokens, Bearer headers, `.env` values, credentials)?
- List each finding (redacted), severity, and mitigation taken or recommended.
- If none: say “No secret exposure observed.”

## Skill improvement notes

Concrete suggestions for SKILL.md / bootstrap.md / templates (commands to change, hangs to document, missing steps, ambiguous intake, etc.).
```

**Full workflow:** [bootstrap.md](bootstrap.md) · **Templates:** [README](https://github.com/hosam-hubspire/expo-project-bootstrap/blob/main/templates/README.md) · **Navigation:** [navigation/README](https://github.com/hosam-hubspire/expo-project-bootstrap/blob/main/templates/navigation/README.md)
