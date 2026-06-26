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

## Before you start (STRICT — always ask first)

**Always run an intake step before any scaffold work** — even when the user's first message already includes app name, GitHub URL, Figma links, or optional features.

Do **not** infer missing inputs, skip questions, or start Phase A until intake is complete.

### Intake rules

1. **Use AskQuestion** when the tool is available — one form covering all inputs below.
2. **Pre-fill** options from the user's first message where they already stated a value (e.g. mark the suggested app name, repo, or Figma URLs as the recommended/default option).
3. **Still ask every field** — required and optional — so the user can confirm, change, or explicitly omit each one.
4. If AskQuestion is unavailable, ask the same fields conversationally in one message before proceeding.
5. **Do not** clone repos, run `create-expo-app`, install packages, or call Figma MCP until the user has answered.

### Inputs to collect

| Input | Required | Notes |
|-------|----------|-------|
| **App name / slug** | Yes | Folder name and `app.json` name/slug |
| **GitHub repo URL** | No | Omit for local-only; push when provided |
| **Figma design system URL** | No | Enables Phase B (tokens) |
| **Figma icons section URL** | No | Enables Phase C (icons); auto-enables icon font pipeline |
| **Optional capabilities** | No | Storybook, i18n, GraphQL subscriptions — enable only what the user selects |

### AskQuestion shape (when available)

Use a single intake form with separate questions for:

1. **App name / slug** — text or options; pre-select if user already named the app
2. **GitHub repo** — include "Local only (no remote)" as an explicit option
3. **Figma design tokens** — include "Skip / not yet" as an explicit option
4. **Figma icons** — include "Skip / not yet" as an explicit option
5. **Optional capabilities** — `allow_multiple: true`; list Storybook, i18n, GraphQL subscriptions; include "None" or omit selections = none enabled

After answers are in, **record resolved values** (what was confirmed vs omitted), then follow [bootstrap.md](bootstrap.md) in full.

## Phase checklist

Track progress; do not skip gates:

```
- [ ] 0 — Intake: AskQuestion (or conversational) for all inputs; pre-fill from first message but confirm every field
- [ ] A — Scaffold: create-expo-app, remove cruft, install deps, apply templates, bun install exit 0
- [ ] B — Design tokens (if Figma design system URL): persist exports, token gate passes
- [ ] C — Icons (if Figma icons URL): **read and follow [figma-icons-sync](../figma-icons-sync/SKILL.md)**; icon gate passes
- [ ] D — Verify: lint, test, tsc; Argent smoke tests on iOS + Android when available
- [ ] E — Commit (+ push if GitHub repo provided)
```

## Quick rules (do not skip)

- `bunx create-expo-app@latest` with `--template default` — never hand-roll `package.json` or clone a sample app as the base
- **Always ask first** — run intake (AskQuestion) for all inputs before Phase A, even when the user pre-filled some in the first message
- **Do not** call `move_agent_to_root` during bootstrap — use absolute paths until scaffold + commit are done
- **One package per install** — never `bun add pkg1 pkg2 …`. Each package gets its own **foreground** shell step so Bun’s live output (`Resolving dependencies`, installs, warnings) streams in the UI while it runs; never background installs, chain with `&&`, or wrap commands in `echo`
- Figma: one collection per MCP call; persist each payload with `scripts/persist-figma-export.mjs` before the next call
- iOS and Android only — no web artifacts
- Bun only — no npm/yarn lockfiles

## Figma export (STRICT — no exceptions)

This is the **only** allowed Figma → disk pipeline. Do not invent alternatives when payloads are large or persistence is awkward.

**Allowed loop (repeat per collection / batch):**

1. `use_figma` — **one** variable collection or text-styles call (~20–25 icon batches are handled by **figma-icons-sync**, not inline here)
2. Write the MCP JSON to `/tmp/<name>.json` (Write tool or shell — **not** a new project script)
3. Run `node scripts/persist-figma-export.mjs …` **immediately** (see `templates/FIGMA_EXPORT.md`)
4. Verify counts/modes on disk **before** the next `use_figma` call

**Forbidden — never do these:**

- Add project scripts to bridge Figma export (`save-figma-*.mjs`, `save-json.mjs`, `flush-*`, batch importers, icon manifests, etc.)
- Delegate **token** export to a subagent/Task instead of running the loop yourself
- Run **Phase C icons** without reading **[figma-icons-sync](../figma-icons-sync/SKILL.md)** (parallel slice workers are defined there)
- Treat a successful `use_figma` response in chat as export complete without `persist-figma-export.mjs`
- Export multiple collections in one `use_figma` call
- Proceed to the next phase or commit while template stub token/icon counts remain on disk

**When MCP JSON is large:** write it to `/tmp` and call `persist-figma-export.mjs`. That is the designed path — do not add helper scripts to the repo.

**Token example (one collection):**

```bash
node scripts/persist-figma-export.mjs token color-tokens.json /tmp/color-tokens.json
node -e "const d=require('./src/theme/tokens/raw/color-tokens.json'); console.log(d.modes, d.variables.length)"
```

Full phase gates and token export helpers: `templates/FIGMA_EXPORT.md` and **Phase B** in [bootstrap.md](bootstrap.md).

**Phase C (icons):** when a Figma icons URL was provided in intake, **read and follow [figma-icons-sync](../figma-icons-sync/SKILL.md)** before Phase D. Do not inline a different icon export strategy.

## Optional add-ons

When the user requests specific capabilities, also apply the matching block in [addons.md](addons.md):

- GraphQL subscriptions
- Storybook
- Figma tokens only (Phase B)
- Figma icons only (Phase C) — **[figma-icons-sync](../figma-icons-sync/SKILL.md)**
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
