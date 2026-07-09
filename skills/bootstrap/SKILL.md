---
name: bootstrap
description: >-
  Bootstrap a new Expo React Native app from architectural templates (Uniwind,
  Bun, Biome, design tokens, nano-icons, i18n, GraphQL, Storybook). Use when
  the user asks to scaffold, bootstrap, or create a new Expo app or React Native
  project.
disable-model-invocation: true
---

# Bootstrap

**Repo:** https://github.com/hosam-hubspire/expo-project-bootstrap

## Intake (before any work)

Run intake first — even when the user already gave app name, stack prefs, or token-sync intent.

1. **AskQuestion** (one form) when available; otherwise one conversational message.
2. Pre-fill from the user's message; still confirm every field.
3. **Do not** scaffold or install until intake is done.

| Input | Required | Notes |
|-------|----------|-------|
| App name / slug | Yes | Folder + `app.json` |
| GitHub repo | No | Local-only if omitted |
| Setup EAS | Yes | Link project, `eas.json`, cloud simulator build in C2 — **on by default** |
| Expo account owner | No | Only when EAS on — **`hubspire` by default** (`expo.owner` in `app.json`) |
| Sync design tokens | Yes | Phase B after C2 — **on by default** |
| Stack toggles | Yes | i18n, GraphQL, Storybook — **all on by default** |
| Android smoke test | Yes | Argent on Android emulator — **off by default** (iOS only) |

**Setup EAS** — when **on** (default), run Phase A2 and C2 uses an EAS `development-simulator` cloud build installed on the iOS Simulator, then Argent smoke test. When **off**, skip Phase A2 entirely; C2 uses **local** `expo run:ios` / `expo run:android` + Argent.

**Expo account owner** — only ask when **Setup EAS** is on. Set `expo.owner` in `app.json` before `eas init`. Default **`hubspire`** unless intake provides another account slug.

**Sync design tokens** — when **on**, run Phase B after C2: copy token scripts + `raw/` at scaffold, user copies Figma exports into `raw/`, confirms, then `discover-figma-raw.mjs` + `tokens:generate`. When **off**, ship pre-built `generated/` stubs only — **no token scripts, no `raw/`**.

**Stack toggles** — `allow_multiple: true`, pre-check all three unless user said to skip:

- **i18n** — `i18next`, localized tabs, language toggle
- **GraphQL** — Apollo, `ExampleQuery`, codegen; needs `EXPO_PUBLIC_GRAPHQL_URL` (dev placeholder: `https://countries.trevorblades.com/`)
- **Storybook** — on-device, token + component stories

Also ask: **GraphQL subscriptions** — off by default.

**Android smoke test** — when **off** (default), run Argent C2 on **iOS simulator only**. When **on**, also boot an Android emulator and run the same checks after iOS passes.

Then follow **[bootstrap.md](bootstrap.md)**.

## Phases

```
- [ ] 0 — Intake
- [ ] A — Scaffold (latest deps, templates, uniwind types, bun install exit 0)
- [ ] A2 — EAS configure (if enabled at intake)
- [ ] C — lint, test, tsc (stub tokens OK)
- [ ] C2 — Argent smoke test (EAS simulator build if A2; else local build)
- [ ] B — Design token sync (if enabled) — copy to raw/, confirm, discover, tokens:generate, re-verify
- [ ] D — Commit (+ push if repo provided)
```

## Rules

- `bunx create-expo-app@latest --template default` — never hand-roll `package.json`
- **Package versions:** `bunx expo install` for Expo/SDK packages (no `@latest`); `bun add <pkg>@latest` / `bun add -d <pkg>@latest` for everything else. Never copy version pins from templates.
- **Never pass `--verbose` to `bunx expo install`** — only on `bun add`
- No `move_agent_to_root` during bootstrap
- Grouped installs — `templates/README.md`; skip unchecked stack groups
- Full templates by default; strip — `templates/optional/minimal/README.md`
- **Token scripts + `raw/` only when token sync enabled** at intake; otherwise ship pre-built `generated/` stubs only
- **Uniwind types in Phase A:** `bunx uniwind generate-artifacts --css ./src/theme/global.css --dts ./src/uniwind-types.d.ts` before Phase C
- **Biome:** `bun add -d @biomejs/biome@latest` then `bunx biome migrate --write` after copying `biome.json`
- **Tab icons:** merge `templates/assets/images/tabIcons/settings.png` (+ `@2x`/`@3x`) — scaffold lacks `settings.png`
- **`app.json` merge:** follow checklist in [bootstrap.md](bootstrap.md) — `experiments` and `extra.eas` are siblings under `expo`
- **GraphQL on:** copy `.env.example`; create local `.env` with `EXPO_PUBLIC_GRAPHQL_URL=https://countries.trevorblades.com/` before C2; gitignore `.env`
- **EAS only when intake enabled:** merge `templates/eas.json`; set `expo.owner` (default `hubspire`); install `expo-dev-client`; `bunx eas-cli init --non-interactive`. If project exists, merge `projectId` from `eas project:info` — do not `--force`
- **C2 with EAS:** `development-simulator` cloud build → `eas build:run` (no `--non-interactive`) → Metro → tap server in dev client → Argent. **C2 without EAS:** local `expo run:ios` (+ `expo run:android` if Android opted in) → Argent
- After `eas build:run`, start Metro (`bun run start`) before Argent launch — dev client needs the bundler
- Expo MCP (`build_run`, `build_list`, …) may be used when EAS is enabled and MCP is authenticated; prefer `eas` CLI for bootstrap reliability
- **Phase B after C2 (when sync enabled):** read `templates/FIGMA_EXPORT.md` from bootstrap repo — do not copy into project
- Copy exports into `src/theme/tokens/raw/` (any files/folders); wait for user confirm; run `discover-figma-raw.mjs`; adapt `generate-design-tokens.mjs`; `tokens:generate`
- Icons: SVGs to `assets/icons/` → `bunx expo prebuild`
- No one-off bridge scripts under `scripts/`; iOS/Android only; Bun only
- **`argent init` ≠ smoke test** — init in Phase A; launch + verify in C2
- **No commit or push until C2 passes on iOS** (when Argent available) **and** Phase B complete when token sync was enabled; when Android smoke test was opted in, Android must pass too
- **C2 defaults to iOS only** — do not boot or build Android unless intake selected Android smoke test

## Completion summary

Path, remote URL, commit SHA, EAS on/off (+ owner + project ID + build ID when on), stack toggles, token sync on/off, Android smoke test on/off, token gate, device verification (EAS simulator or local build; + Android if opted in), custom mappings.

**Full workflow:** [bootstrap.md](bootstrap.md) · **Templates:** [templates/README.md](../../templates/README.md)
