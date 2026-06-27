# Expo project bootstrap

Reusable **agent skill** and **canonical templates** for scaffolding Expo React Native apps (Uniwind, Bun, Biome, design tokens, nano-icons, i18n, GraphQL, Storybook). Templates use **project-agnostic placeholders** — raw token JSON, GraphQL endpoint, font families, and `app.json` name/slug are replaced during bootstrap intake and Phase B Figma export.

## Quick start

**Cursor:**

```
use bootstrap skill to scaffold a project
```

**Install skill:**

```bash
bunx skills add hosam-hubspire/expo-project-bootstrap --skill bootstrap -g -y
```

## Repository layout

| Path | Purpose |
|------|---------|
| `skills/bootstrap/` | Main skill — intake, checklist, workflow |
| `templates/` | Full app shell (i18n, GraphQL, Storybook, `.rnstorybook/`) |
| `templates/optional/minimal/` | Strip-down files when user unchecks stack items |
| `templates/README.md` | Adaptation, installs, scripts |
| `templates/FIGMA_EXPORT.md` | Design token export (Phase B) |

## How it fits together

```
skills/bootstrap/              ← intake + workflow
templates/                     ← full stack merged into create-expo-app output
templates/optional/minimal/    ← use when user unchecks i18n / GraphQL / Storybook
```

**Intake:** i18n, GraphQL, and Storybook are **on by default** — user unchecks any they don't need.

## Manual prompt (without skill)

```
Bootstrap a new Expo React Native app.

Workflow: https://github.com/hosam-hubspire/expo-project-bootstrap/blob/main/skills/bootstrap/bootstrap.md
Templates: https://github.com/hosam-hubspire/expo-project-bootstrap/tree/main/templates

### Inputs
- App name / slug: <APP_NAME>
- GitHub repo: <URL or "local only">
- Figma design system: <URL or omit>
- Stack toggles (default all on): i18n, GraphQL, Storybook — uncheck any not needed
- GraphQL subscriptions: off by default
- Platforms: iOS and Android only (no web)
```

## Develop locally

```bash
bunx skills add ./path/to/expo-project-bootstrap --skill bootstrap -g -y
bunx skills add ./path/to/expo-project-bootstrap --list
```
