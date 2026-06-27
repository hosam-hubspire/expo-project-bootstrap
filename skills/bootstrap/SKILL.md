---
name: bootstrap
description: >-
  Bootstrap a new Expo React Native app from architectural templates (Uniwind,
  Bun, Biome, design tokens, nano-icons, optional Storybook/i18n/GraphQL). Use when
  the user asks to scaffold, bootstrap, or create a new Expo app or React Native
  project.
disable-model-invocation: true
---

# Bootstrap

Scaffold a new Expo app using templates from this repository.

**Repository:** https://github.com/hosam-hubspire/expo-project-bootstrap

## Before you start (STRICT)

Run intake **before** any scaffold work — even when the user's first message includes app name, Figma links, or optional features.

1. **Use AskQuestion** when available — one form for all inputs below.
2. **Pre-fill** from the user's first message where stated; still ask every field.
3. If AskQuestion is unavailable, ask conversationally in one message.
4. **Do not** clone, `create-expo-app`, install, or call Figma MCP until intake is complete.

| Input | Required | Notes |
|-------|----------|-------|
| App name / slug | Yes | Folder name and `app.json` name/slug |
| GitHub repo URL | No | Omit for local-only |
| Figma design system URL | No | Phase B (tokens) |
| Optional capabilities | No | Storybook, i18n, GraphQL subscriptions — only what user selects |

After intake, follow **[bootstrap.md](bootstrap.md)** in full.

## Phase checklist

```
- [ ] 0 — Intake complete
- [ ] A — Scaffold: create-expo-app, remove cruft, install deps, apply templates, bun install exit 0
- [ ] B — Design tokens (if Figma design system URL): see templates/FIGMA_EXPORT.md
- [ ] C — Verify: lint, test, tsc; Argent smoke tests when available
- [ ] D — Commit (+ push if GitHub repo provided)
```

## Quick rules

- `bunx create-expo-app@latest --template default` — never hand-roll `package.json`
- **Do not** call `move_agent_to_root` during bootstrap
- Install deps in **logical groups** with `--verbose` — see `templates/README.md`
- Figma tokens: one collection per MCP call → `/tmp` → `persist-figma-export.mjs` — see `templates/FIGMA_EXPORT.md`
- Icons: export SVGs from Figma manually into `assets/icons/`, then `bun run icons:generate` — see `templates/README.md` **Icons**
- **Never** add bridge scripts under `scripts/` (`save-figma-*.mjs`, etc.)
- iOS and Android only — no web artifacts
- Bun only — no npm/yarn lockfiles

## Templates source

1. Local clone: `templates/` at repo root
2. GitHub: https://github.com/hosam-hubspire/expo-project-bootstrap/tree/main/templates

Key docs: `templates/README.md`, `templates/FIGMA_EXPORT.md`, `templates/TOKENS.md`.

## Completion summary

Reply with: local path, remote URL (if pushed), commit SHA, enabled vs omitted capabilities, Figma file key (if any), **token gate** (modes, raw files, counts), **device verification** (iOS/Android or Argent unavailable), custom Figma → code mappings.

## Full workflow

**[bootstrap.md](bootstrap.md)** — scaffold, stack, optional capabilities, architecture, git deliverable.
