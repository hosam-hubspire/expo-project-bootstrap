# {{APP_NAME}}

Expo React Native app (iOS & Android) scaffolded with the Hubspire bootstrap stack.

## Stack

| Area | This project |
|------|----------------|
| Runtime | Expo + Expo Router · Bun |
| UI | Uniwind + Tailwind v4 · nano-icons · toasts |
| Quality | TypeScript strict · Biome · ESLint a11y · Jest · CI |
| State | Zustand + MMKV |
| Forms | react-hook-form + Zod (`@hookform/resolvers`) |
| Keyboard | keyboard controller |
| Bottom sheet | inline + modal sheets |
| i18n | {{I18N}} |
| API | {{API}} |
| Storybook | {{STORYBOOK}} |
| EAS | {{EAS}} |
| Design tokens | {{TOKENS}} |

**Navigation:** {{NAVIGATION}}

**Permissions:** {{PERMISSIONS}}

## Prerequisites

- Bun
- Xcode (iOS) / Android Studio (Android)
- Expo account (when EAS is enabled)

## Setup

```bash
bun install
```

{{ENV_SECTION}}

Generate Uniwind types (required after CSS / token changes):

```bash
bunx uniwind generate-artifacts --css ./src/global.css --dts ./src/uniwind-types.d.ts
```

## Scripts

| Script | Purpose |
|--------|---------|
| `bun run start` | Metro bundler |
| `bunx expo run:ios` / `run:android` | Local native build + run |
| `bun run lint` / `lint:fix` | Biome |
| `bun run lint:a11y` | ESLint a11y |
| `bun run test` | Jest (not bare `bun test` — that is Bun’s runner) |
| `bunx tsc --noEmit` | Typecheck |
{{EXTRA_SCRIPTS}}

## Project layout

```
src/
  app/           # Expo Router routes
  components/    # UI (Screen, Icon, AppToast, BottomSheetExamples, …)
  theme/         # Uniwind + design tokens
  stores/        # Zustand
  utils/         # toast (+ permissions when enabled)
  …
assets/icons/    # SVG → nano-icons (prebuild)
```

## Notes

- **Native only** — no web target.
- Prefer `Screen` + `useSafeAreaInsets()` over `SafeAreaView`.
- Bottom sheets (`BottomSheet` / `ModalBottomSheet`) and MMKV need a native build — not Expo Go. Storybook uses root `index.js` to skip those modules and can run in Expo Go (`bun run storybook`).
- Customize iOS permission copy in `app.json` plugins before shipping (when permissions are enabled).
- Replace this README’s product blurb as the app takes shape.

<!--
Bootstrap agent — fill placeholders then delete this comment block:

{{APP_NAME}}     — intake app name / display name
{{I18N}}         — on | off
{{API}}          — GraphQL (subscriptions on|off) | REST (axios) | none
{{STORYBOOK}}    — on | off
{{EAS}}          — on (owner: …) | off
{{TOKENS}}       — stub tokens | GitHub sync via `tokens:sync` (URL) · appearance: light-only|light-and-dark · schemes: …
{{NAVIGATION}}   — e.g. Tabs + Intro · Drawer off · Auth off
{{PERMISSIONS}}  — none | comma-separated list from intake
{{ENV_SECTION}}  — GraphQL or REST `.env` block when API on; otherwise omit
{{EXTRA_SCRIPTS}}— rows for graphql:generate / storybook / tokens:sync when enabled

Write the result to the app root as README.md (overwrite create-expo-app README).
-->
