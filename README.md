# Expo project bootstrap

Reusable **agent skill**, prompt entry point, and **canonical templates** for scaffolding new Expo React Native apps (latest Expo SDK via `create-expo-app@latest`, Uniwind, Bun, Biome, design tokens, optional Storybook / GraphQL / icons).

## Quick start

**Cursor (recommended):**

```
use expo-project-bootstrap skill to bootstrap a project
```

**Install the skill:**

```bash
npx skills add hosam-hubspire/expo-project-bootstrap --skill expo-project-bootstrap -g -y
npx skills add hosam-hubspire/expo-project-bootstrap --skill figma-icons-sync -g -y
```

`figma-icons-sync` is invoked automatically by `expo-project-bootstrap` Phase C when a Figma icons URL is provided. Install it separately only if you sync icons outside bootstrap.

**Manual prompt:** see [PROJECT_BOOTSTRAP.md](./PROJECT_BOOTSTRAP.md).

## Repository layout

| Path | Purpose |
|------|---------|
| `skills/expo-project-bootstrap/` | Agent skill (`SKILL.md`, `bootstrap.md`, `addons.md`) — bootstrap workflow |
| `skills/figma-icons-sync/` | Icon export from Figma (batched `/tmp` JSON, parallel slices) — Phase C |
| `templates/` | Reference config, scripts, theme pipeline, minimal app shell, optional Storybook |
| `PROJECT_BOOTSTRAP.md` | Thin prompt wrapper — links to skill, no duplicated workflow |
| `templates/README.md` | Adaptation workflow and one-package-per-install dependency list |
| `templates/FIGMA_EXPORT.md` | Figma MCP export workflow |
| `templates/TOKENS.md` | Copy to new projects when Figma export is pending |

## How it fits together

```
skills/expo-project-bootstrap/   ← bootstrap workflow
skills/figma-icons-sync/         ← Phase C icon sync (called when icons URL provided)
templates/                       ← files to merge into the new app
```

The agent scaffolds with `create-expo-app@latest`, then **adapts** `templates/` into the new project (merging with Expo-generated config — not bulk-copying).

## Develop locally

Clone this repo, then install the skill from your checkout:

```bash
npx skills add ./path/to/expo-project-bootstrap --skill expo-project-bootstrap -g -y
```

Verify discoverability:

```bash
npx skills add ./path/to/expo-project-bootstrap --list
```
