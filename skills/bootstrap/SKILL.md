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

**Templates:** local clone `templates/` next to `skills/`, else [templates on GitHub](https://github.com/hosam-hubspire/expo-project-bootstrap/tree/main/templates). Do not use `../../templates` from a global skills folder.

**Workflow:** [bootstrap.md](bootstrap.md) · **Installs:** [templates/README.md](https://github.com/hosam-hubspire/expo-project-bootstrap/blob/main/templates/README.md)

## Intake (before any work)

Two steps only first: project name, then defaults shortcut. **Do not** scaffold until intake is done.

### Step 1 — App name (always)

Ask **only** for app name / slug. Pre-fill and confirm if already given.

### Step 2 — Use defaults? (always, right after Step 1)

| Choice | Effect |
|--------|--------|
| **Yes — use defaults (Recommended)** | Skip Step 3; apply defaults below |
| **No — customize** | Step 3 |

| Input | Default |
|-------|---------|
| GitHub repo | none (local-only) |
| Setup EAS | off |
| Expo account owner | `hubspire` |
| Sync design tokens | off (stub `generated/` only) |
| Stack | i18n, Storybook on |
| API client | GraphQL (Apollo) |
| GraphQL subscriptions | off |
| Navigation | Tabs on · Drawer off · Intro on · Auth off |
| iOS Argent smoke (C2) | off |
| Android smoke | off |
| Permissions | all off |

When defaults: do not re-ask — go to [bootstrap.md](bootstrap.md).

### Step 3 — Detailed intake (only if Step 2 is No)

**AskQuestion** when available; else one conversational message. Pre-fill; confirm every field.

| Input | Required | Default / notes |
|-------|----------|-----------------|
| GitHub repo | No | Local-only if omitted |
| Setup EAS | Yes | off — A2 + cloud sim build in C2 when on |
| Expo account owner | When EAS on | `hubspire` → `expo.owner` |
| Sync design tokens | Yes | off — see notes |
| Design tokens GitHub URL | When sync on | Required |
| Stack toggles | Yes | i18n · Storybook — `allow_multiple`, both on |
| API client | Yes | GraphQL · REST · none (exclusive) |
| GraphQL subscriptions | When GraphQL | off |
| Navigation toggles | Yes | Tabs · Drawer · Intro · Auth — `allow_multiple`; pre-check Tabs + Intro |
| Permission toggles | Yes | Mic · Location fg/bg · Notifications · Image picker · Documents — `allow_multiple`, all off; bg ⇒ fg |
| iOS Argent smoke (C2) | Yes | off |
| Android smoke | Yes | off — requires iOS smoke if on |

Assembly: [navigation](https://github.com/hosam-hubspire/expo-project-bootstrap/blob/main/templates/navigation/README.md) · [permissions](https://github.com/hosam-hubspire/expo-project-bootstrap/blob/main/templates/src/utils/permissions/README.md).

**Tokens off:** stub `generated/` only; no token scripts. **On:** `sync-design-tokens.mjs` + stub + `tokens:sync`; Phase B auto-detects appearance vs color schemes from Figma mode names ([TOKEN_SYNC.md](https://github.com/hosam-hubspire/expo-project-bootstrap/blob/main/templates/TOKEN_SYNC.md)) — exact `light`/`dark` → appearance; other modes (e.g. Default / Rider Tools) → product schemes under light-only. **Never** map arbitrary modes to dark. Ask only if mode names are ambiguous.

**API wiring:** GraphQL → Apollo + Rick and Morty `.env` + `expo-secure-store`. REST → [optional/rest](https://github.com/hosam-hubspire/expo-project-bootstrap/blob/main/templates/optional/rest/README.md) + JSONPlaceholder. none → strip both.

**Nav:** Tabs + Drawer both off → flat Stack (`navigation/screens/` + flat layout).

**Smokes:** both off → skip C2 and prebuild; Phase C enough.

Then [bootstrap.md](bootstrap.md).

## Phases

```
- [ ] 0 — Intake
- [ ] A — Scaffold (deps, templates, nav, uniwind types, bun install 0, project README)
- [ ] A2 — EAS (if enabled)
- [ ] C — lint, test, tsc (stub tokens OK)
- [ ] C2 — Argent smoke (if iOS on; + Android if opted in)
- [ ] B — Token sync (if enabled) — after C2 when C2 ran, else after C
- [ ] D — Commit (+ push if repo) — project README already replaces stock
- [ ] R — Run report (always, agent chat message)
```

Record wall-clock per phase / notable sub-step (approximate OK).

## Rules

Procedure: [bootstrap.md](bootstrap.md) + [templates/README.md](https://github.com/hosam-hubspire/expo-project-bootstrap/blob/main/templates/README.md). Do not duplicate long steps here.

- `bunx create-expo-app@latest --template default` — never hand-roll `package.json`
- Expo/SDK: `bunx expo install` (no `@latest`). Else: `bun add …@latest`. **Exception:** pin `jest` / `@types/jest` from `jest-expo`'s `babel-jest` — never `jest@latest`. Never copy version pins from templates
- Never `--verbose` on `bunx expo install`. Prefer `bun install --verbose` for exit-0. Verbose `bun add` can dump registry `Authorization` — kill and retry without `--verbose`; never paste auth into chat/report
- No `move_agent_to_root` during bootstrap
- No agent-assembly comments in shipped source (toggles, “uncomment when…”) — keep instructions in skill/README only
- Strip unchecked stack — `optional/minimal/`; REST via `optional/rest/`
- Nav: start `templates/src/app/`; assemble from `templates/navigation/` — no unused route groups
- Auth hook → `src/hooks/use-storage-state.ts`; constants → `src/constants/`. Never hooks under `src/lib/`
- Keep `src/constants/session.ts` when GraphQL or REST is on (SecureStore for API auth), even if Auth nav is off. Auth on → also `SessionProvider` / `sign-in` / etc.
- Providers: GraphQL + auth → `SessionProvider` **inside** `AppApolloProvider`. REST/none + auth → `SessionProvider` only
- Token scripts / `tokens:sync` only when sync on; else stub `generated/` only. Phase B: follow [TOKEN_SYNC.md](https://github.com/hosam-hubspire/expo-project-bootstrap/blob/main/templates/TOKEN_SYNC.md) — **auto-detect** appearance vs schemes from mode names (no intake); never map product schemes to dark; scheme-keyed colors + coverage gate; alias resolve incl. semantic→semantic; hex+rgba; size modes sm/md/lg+
- **Drawer / Expo SDK 56+ (hard stop at install):** When Drawer is on, install **only** `react-native-gesture-handler` · `react-native-reanimated` · `react-native-worklets` via `bunx expo install`. **Never** `bun add` / `expo install` `@react-navigation/drawer` — it breaks Expo Router drawer on SDK 56+. App code imports `Drawer` from `expo-router/drawer` only; never `@react-navigation/*`. A missing peer `require.resolve` for `@react-navigation/drawer` is **not** a reason to install it — ignore and continue. Install matrix: [templates/README.md](https://github.com/hosam-hubspire/expo-project-bootstrap/blob/main/templates/README.md#navigation-when-toggles-on)
- Uniwind: CSS `src/global.css`; Metro `withUniwindConfig` outermost; `bunx uniwind generate-artifacts …` before Phase C
- Biome: `@biomejs/biome@latest`, `bunx biome migrate --write`; `useFilenamingConvention` off. Templates should already be Biome-clean
- Tabs: Expo Router JS `Tabs` + nano `Icon`; `Icon` must accept RN `ColorValue` (not `string` only)
- API: GraphQL / REST / none per intake; always gitignore `.env`
- EAS / C2 / B / prebuild / Argent: follow bootstrap.md — skip A2 when EAS off; skip Argent + C2 + prebuild when both smokes off
- Core toasts always; PermissionsExamples when any permission on
- Core forms always: `react-hook-form`, `zod`, `@hookform/resolvers` — auth `sign-in` is the reference wiring when Auth on
- Core keyboard always: `react-native-keyboard-controller` via `bunx expo install`; wrap root in `KeyboardProvider`; auth `sign-in` uses `KeyboardAwareScrollView` + `KeyboardToolbar` when Auth on
- Core bottom sheet always: `@swmansion/react-native-bottom-sheet` via `bun add …@latest`; wrap root in `BottomSheetProvider` (inside `KeyboardProvider`); Fabric native — not Expo Go; Settings always mounts `BottomSheetExamplesRoot` + `BottomSheetExamples` (inline + backdrop, modal + scrim/keyboard/a11y). Use `StyleSheet.absoluteFill` (not `absoluteFillObject` — removed in RN 0.86+)
- Native only (iOS/Android): strip web leftovers; prefer `Screen` + insets over `SafeAreaView`
- Argent init in A **only** when any smoke on
- Commit gate: C2 must pass when smokes on; B complete when sync on; when smokes off, C (+ B if sync) then ask before D
- Project README: fill [project-README.md](https://github.com/hosam-hubspire/expo-project-bootstrap/blob/main/templates/project-README.md) before D
- Phase D push: if HTTPS rejects `.github/workflows/*` (missing usable `workflow` scope on the git credential), push without the workflow file then add it via `gh api` Contents — or use SSH with a key that can write workflows. Restore local tree to match remote before finish
- Phase R always: run report as **agent chat message** (not a file); redact secrets

## Completion summary

Path, remote, commit SHA, EAS on/off (+ owner / project ID / build ID), stack, API client, nav toggles, permissions (if any), token sync (+ URL), iOS/Android smoke, token gate, device verification (or skipped). Then **Run report** below.

## Run report (Phase R — mandatory)

Post in chat after the session — **do not** write `BOOTSTRAP_REPORT.md`.

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

Did the agent (or a tool) expose secrets (npm/GitHub/EAS tokens, Bearer headers, `.env`, credentials)?
- List each finding (redacted), severity, mitigation.
- If none: say “No secret exposure observed.”

## Skill improvement notes

Concrete suggestions for SKILL.md / bootstrap.md / templates.
```
