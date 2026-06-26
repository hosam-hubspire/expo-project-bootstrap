---
name: expo-project-bootstrap
description: >-
  Bootstrap a new Expo React Native app from architectural templates (Uniwind,
  Bun, Biome, design tokens, optional Storybook/i18n/GraphQL/icons). Use when
  the user asks to scaffold, bootstrap, or create a new Expo app, React Native
  project, or mentions expo-project-bootstrap.
disable-model-invocation: true
---

# Expo Project Bootstrap

Scaffold a new Expo app using templates from this repository (`templates/` on `main`).

**Repository:** https://github.com/hosam-hubspire/expo-project-bootstrap

## Before you start

Collect inputs. Use AskQuestion when available; otherwise ask conversationally. Do not begin scaffold until **app name** is known.

| Input | Required | Notes |
|-------|----------|-------|
| **App name / slug** | Yes | Folder name and `app.json` name/slug |
| **GitHub repo URL** | No | Omit for local-only; push when provided |
| **Figma design system URL** | No | Enables Phase B (tokens) |
| **Figma icons section URL** | No | Enables Phase C (icons); auto-enables icon font pipeline |
| **Optional capabilities** | No | Storybook, i18n, GraphQL subscriptions — enable only what the user lists |

Record resolved values, then follow [bootstrap.md](bootstrap.md) in full.

## Phase checklist

Track progress; do not skip gates:

```
- [ ] A — Scaffold: create-expo-app, remove cruft, install deps, apply templates, bun install exit 0
- [ ] B — Design tokens (if Figma design system URL): persist exports, token gate passes
- [ ] C — Icons (if Figma icons URL): persist SVGs, icon gate passes
- [ ] D — Verify: lint, test, tsc; Argent smoke tests on iOS + Android when available
- [ ] E — Commit (+ push if GitHub repo provided)
```

## Quick rules (do not skip)

- `bunx create-expo-app@latest` with `--template default` — never hand-roll `package.json` or clone a sample app as the base
- **Do not** call `move_agent_to_root` during bootstrap — use absolute paths until scaffold + commit are done
- **One package per install** — never `bun add pkg1 pkg2 …`. Each package gets its own **foreground** shell step so Bun’s live output (`Resolving dependencies`, installs, warnings) streams in the UI while it runs; never background installs, chain with `&&`, or wrap commands in `echo`
- Figma: one collection per MCP call; persist each payload with `scripts/persist-figma-export.mjs` before the next call
- iOS and Android only — no web artifacts
- Bun only — no npm/yarn lockfiles

## Optional add-ons

When the user requests specific capabilities, also apply the matching block in [addons.md](addons.md):

- GraphQL subscriptions
- Storybook
- Figma tokens only (Phase B)
- Figma icons only (Phase C)
- Device verification (Argent)

## Templates source

Read template files from:

1. **This repo** — `templates/` at the repository root (when cloned locally, e.g. `~/Documents/expo-project-bootstrap/templates/`)
2. **GitHub** — https://github.com/hosam-hubspire/expo-project-bootstrap/tree/main/templates

Key template docs: `templates/README.md`, `templates/FIGMA_EXPORT.md`, `templates/TOKENS.md`.

## Completion summary

Reply with: local project path, remote repo URL (if pushed), commit SHA, enabled vs omitted capabilities, Figma file key (if any), **token gate** (mode names, raw files, counts), **icon gate** (SVG count, dedup notes), **device verification** (iOS/Android results or Argent unavailable), and any custom Figma → code mappings.

## Full workflow

All scaffold steps, required/optional stack, Figma phases, architecture conventions, git deliverable, and constraints: **[bootstrap.md](bootstrap.md)**.
