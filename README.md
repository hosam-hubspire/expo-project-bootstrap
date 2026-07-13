# Expo project bootstrap

Agent skill + templates for Expo React Native apps (Uniwind, Bun, Biome, design tokens, nano-icons, i18n, GraphQL or REST, Storybook, mixable Expo Router navigation). Stub tokens ship for CI; real Figma exports land in `raw/` in Phase B (after C2 when smoke tests run, else after Phase C).

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

**Defaults:** i18n and Storybook on; **API client GraphQL (Apollo)**; user can choose REST (axios) or none instead.

**Navigation defaults:** Tabs on · Intro on · Drawer off · Protected/auth off. Toggles combine freely (e.g. auth+tabs+drawer). See [`templates/navigation/README.md`](./templates/navigation/README.md).

**REST assembly:** [`templates/optional/rest/README.md`](./templates/optional/rest/README.md).

**Scaffolded app README:** agents replace the stock Expo `README.md` with a filled [`templates/project-README.md`](./templates/project-README.md) before the first commit.

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
Stack toggles (default on): i18n, Storybook
API client (default GraphQL): GraphQL | REST (axios) | none
GraphQL subscriptions: off by default (only when GraphQL)
Navigation toggles (default: tabs + intro): Tabs, Drawer, Intro screens, Protected/auth
Permission toggles (default: all off): Microphone, Location foreground, Location background, Notifications, Image picker (camera + photos/videos), Documents/file system
iOS Argent smoke (C2): off by default
Android smoke test: off by default
Platforms: iOS and Android only
```

**Global skill install:** `skills add -g` copies only `skills/bootstrap/`. Agents must use a local clone’s `templates/` or the GitHub `templates/` URL — relative `../../templates` does not resolve from `~/.agents/skills/`.

## Local skill install

```bash
bunx skills add ./path/to/expo-project-bootstrap --skill bootstrap -g -y
```
