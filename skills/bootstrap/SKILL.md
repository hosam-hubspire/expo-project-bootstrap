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

Scaffold a new Expo app using templates from this repository.

**Repository:** https://github.com/hosam-hubspire/expo-project-bootstrap

## Before you start (STRICT)

Run intake **before** any scaffold work — even when the user's first message includes app name, Figma links, or stack preferences.

1. **Use AskQuestion** when available — one form for all inputs below.
2. **Pre-fill** from the user's first message where stated; still ask every field.
3. If AskQuestion is unavailable, ask conversationally in one message.
4. **Do not** clone, `create-expo-app`, install, or call Figma MCP until intake is complete.

| Input | Required | Notes |
|-------|----------|-------|
| App name / slug | Yes | Folder name and `app.json` name/slug |
| GitHub repo URL | No | Omit for local-only |
| Figma design system URL | No | Phase B (tokens) |
| **Stack toggles** | Yes (confirm) | i18n, GraphQL, Storybook — **all on by default**; user unchecks to omit |

### Stack toggles (AskQuestion)

Use **`allow_multiple: true`**. Pre-check **all three** unless the user already said to skip one:

1. **i18n** — `i18next`, localized tab screens, language toggle on Settings
2. **GraphQL** — Apollo Client, placeholder `ExampleQuery`, codegen (`graphql:generate`); set `EXPO_PUBLIC_GRAPHQL_URL`
3. **Storybook** — on-device Storybook, design-token stories, colocated component stories

Also ask (separate question or follow-up when GraphQL stays enabled):

- **GraphQL subscriptions** — off by default; enable only when selected

Record what stays **enabled** vs **omitted**, then follow **[bootstrap.md](bootstrap.md)**.

## Phase checklist

```
- [ ] 0 — Intake complete (stack toggles confirmed)
- [ ] A — Scaffold: create-expo-app, remove cruft, install deps, apply templates, strip if needed, bun install exit 0
- [ ] B — Design tokens (if Figma design system URL): see templates/FIGMA_EXPORT.md
- [ ] C — Verify: lint, test, tsc; Argent smoke tests when available
- [ ] D — Commit (+ push if GitHub repo provided)
```

## Quick rules

- `bunx create-expo-app@latest --template default` — never hand-roll `package.json`
- **Do not** call `move_agent_to_root` during bootstrap
- Install deps in **logical groups** with `--verbose` — see `templates/README.md`; skip groups for unchecked stack items
- Apply **full templates by default**; strip per `templates/optional/minimal/README.md` when user unchecked items
- Copy `FIGMA_EXPORT.md` and `TOKENS.md` into the new project when Figma is in scope
- Figma tokens: one collection per MCP call → `/tmp` → `persist-figma-export.mjs` — see `templates/FIGMA_EXPORT.md`
- Icons: export SVGs from Figma into `assets/icons/`; regenerate via `bunx expo prebuild`
- **Never** add bridge scripts under `scripts/`
- iOS and Android only; Bun only

## Templates source

1. Local clone: `templates/` at repo root
2. GitHub: https://github.com/hosam-hubspire/expo-project-bootstrap/tree/main/templates

Key docs: `templates/README.md`, `templates/FIGMA_EXPORT.md`, `templates/TOKENS.md`.

## Completion summary

Reply with: local path, remote URL (if pushed), commit SHA, **stack toggles** (enabled vs omitted), Figma file key (if any), **token gate**, **device verification**, custom Figma → code mappings.

## Full workflow

**[bootstrap.md](bootstrap.md)** — scaffold, stack, architecture, git deliverable.
