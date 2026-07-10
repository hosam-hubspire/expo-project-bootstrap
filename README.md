# Expo project bootstrap

Agent skill + templates for Expo React Native apps (Uniwind, Bun, Biome, design tokens, nano-icons, i18n, GraphQL, Storybook, mixable Expo Router navigation). Stub tokens ship for CI/Argent; real Figma exports are copied to `raw/` after device smoke tests.

## Quick start

```
use bootstrap skill to scaffold a project
```

```bash
bunx skills add hosam-hubspire/expo-project-bootstrap --skill bootstrap -g -y
```

## Layout

| Path | Purpose |
|------|---------|
| `skills/bootstrap/` | Intake + workflow |
| `templates/` | Full app shell (default nav: **tabs + intro**) |
| `templates/navigation/` | Mixable modules — drawer, auth, flat screens, root navigator snippets |
| `templates/optional/minimal/` | Strip-down when stack items unchecked |

**Defaults:** i18n, GraphQL, and Storybook are on at intake — user unchecks to omit.

**Navigation defaults:** Tabs on · Intro on · Drawer off · Protected/auth off. Toggles combine freely (e.g. auth+tabs+drawer). See [`templates/navigation/README.md`](./templates/navigation/README.md).

## Manual prompt

```
Bootstrap a new Expo React Native app.
Workflow: https://github.com/hosam-hubspire/expo-project-bootstrap/blob/main/skills/bootstrap/bootstrap.md
Templates: https://github.com/hosam-hubspire/expo-project-bootstrap/tree/main/templates

App name/slug: <APP_NAME>
GitHub repo: <URL or local only>
Setup EAS: on by default (hubspire account; cloud simulator build in C2)
Expo account owner: hubspire (only when Setup EAS is on)
Figma design system: <URL or omit>
Stack toggles (default all on): i18n, GraphQL, Storybook
GraphQL subscriptions: off by default
Navigation toggles (default: tabs + intro): Tabs, Drawer, Intro screens, Protected/auth
Android smoke test: off by default (iOS only via Argent)
Platforms: iOS and Android only
```

## Local skill install

```bash
bunx skills add ./path/to/expo-project-bootstrap --skill bootstrap -g -y
```
