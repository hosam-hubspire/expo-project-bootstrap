# Expo project bootstrap

Reusable **agent skill** and **canonical templates** for scaffolding Expo React Native apps (Uniwind, Bun, Biome, design tokens, nano-icons, optional Storybook / i18n / GraphQL).

## Quick start

**Cursor:**

```
use bootstrap skill to scaffold a project
```

**Install skill:**

```bash
npx skills add hosam-hubspire/expo-project-bootstrap --skill bootstrap -g -y
```

The skill is named **`bootstrap`** (formerly `expo-project-bootstrap`). Re-run the install command above to update an existing global install.

## Repository layout

| Path | Purpose |
|------|---------|
| `skills/bootstrap/` | Main skill — intake, checklist, links to workflow |
| `skills/bootstrap/bootstrap.md` | Full scaffold workflow |
| `templates/` | Config, scripts, theme pipeline, minimal app shell |
| `templates/optional/` | i18n, GraphQL, Storybook, layout variants |
| `templates/README.md` | Adaptation, grouped installs, capability merges |
| `templates/FIGMA_EXPORT.md` | Design token export (Phase B) |
| `templates/TOKENS.md` | Per-project sync tracker (copy into new apps) |

## How it fits together

```
skills/bootstrap/   ← intake + workflow
templates/          ← merge into create-expo-app output
templates/optional/ ← enable only selected capabilities
```

The agent scaffolds with `create-expo-app@latest`, then **adapts** templates — never bulk-copies over Expo-generated config.

Icons ship as sample SVGs with `react-native-nano-icons` wired up. Export icons from Figma manually and drop them into `assets/icons/`, then run `bun run icons:generate`.

## Manual prompt (without skill)

```
Bootstrap a new Expo React Native app.

Workflow: https://github.com/hosam-hubspire/expo-project-bootstrap/blob/main/skills/bootstrap/bootstrap.md
Templates: https://github.com/hosam-hubspire/expo-project-bootstrap/tree/main/templates

### Inputs
- App name / slug: <APP_NAME>
- GitHub repo: <URL or "local only">
- Figma design system: <URL or omit>
- Optional capabilities: <Storybook, i18n, GraphQL subscriptions — list only what I want>
- Platforms: iOS and Android only (no web)
```

## Develop locally

```bash
npx skills add ./path/to/expo-project-bootstrap --skill bootstrap -g -y
npx skills add ./path/to/expo-project-bootstrap --list
```
