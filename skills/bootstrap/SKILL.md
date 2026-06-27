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

Run intake first — even when the user already gave app name, Figma URL, or stack prefs.

1. **AskQuestion** (one form) when available; otherwise one conversational message.
2. Pre-fill from the user's message; still confirm every field.
3. **Do not** scaffold, install, or call Figma MCP until intake is done.

| Input | Required | Notes |
|-------|----------|-------|
| App name / slug | Yes | Folder + `app.json` |
| GitHub repo | No | Local-only if omitted |
| Figma design system URL | No | Phase B (after Argent) |
| Stack toggles | Yes | i18n, GraphQL, Storybook — **all on by default** |

**Stack toggles** — `allow_multiple: true`, pre-check all three unless user said to skip:

- **i18n** — `i18next`, localized tabs, language toggle
- **GraphQL** — Apollo, `ExampleQuery`, codegen; needs `EXPO_PUBLIC_GRAPHQL_URL`
- **Storybook** — on-device, token + component stories

Also ask: **GraphQL subscriptions** — off by default.

Then follow **[bootstrap.md](bootstrap.md)**.

## Phases

```
- [ ] 0 — Intake
- [ ] A — Scaffold (templates, bun install exit 0)
- [ ] C — lint, test, tsc (stub tokens OK)
- [ ] C2 — Argent smoke test (iOS + Android)
- [ ] B — Figma sync (if URL) — copy to raw/, confirm, discover, tokens:generate, re-verify
- [ ] D — Commit (+ push if repo provided)
```

## Rules

- `bunx create-expo-app@latest --template default` — never hand-roll `package.json`
- No `move_agent_to_root` during bootstrap
- Grouped installs — `templates/README.md`; skip unchecked stack groups
- Full templates by default; strip — `templates/optional/minimal/README.md`
- **Figma Phase B after C2:** read `templates/FIGMA_EXPORT.md` from bootstrap repo — do not copy into project
- Copy Figma exports into `src/theme/tokens/raw/` (any files/folders); wait for user confirm; run `discover-figma-raw.mjs`; adapt `generate-design-tokens.mjs`; `tokens:generate`
- Icons: SVGs to `assets/icons/` → `bunx expo prebuild`
- No one-off bridge scripts under `scripts/`; iOS/Android only; Bun only
- **`argent init` ≠ smoke test** — init in Phase A; launch + verify in C2
- **No commit or push until C2 passes** (when Argent available) **and** Phase B complete when Figma URL was given

## Completion summary

Path, remote URL, commit SHA, stack toggles, Figma file key, token gate, device verification, custom mappings.

**Full workflow:** [bootstrap.md](bootstrap.md) · **Templates:** [templates/README.md](../../templates/README.md)
