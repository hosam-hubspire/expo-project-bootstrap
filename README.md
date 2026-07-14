# Expo project bootstrap

Agent skill + templates for Expo React Native apps (Uniwind, Bun, Biome, design tokens, nano-icons, i18n, GraphQL or REST, Storybook, mixable Expo Router navigation).

## Install

```bash
bunx skills add hosam-hubspire/expo-project-bootstrap --skill bootstrap -g -y
# or local: bunx skills add ./path/to/expo-project-bootstrap --skill bootstrap -g -y
```

Then: `use bootstrap skill to scaffold a project`

`skills add -g` copies only `skills/bootstrap/`. Agents must use a local clone’s `templates/` or the [GitHub templates](https://github.com/hosam-hubspire/expo-project-bootstrap/tree/main/templates) URL — `../../templates` does not resolve from `~/.agents/skills/`.

## Layout

| Path | Purpose |
|------|---------|
| [`skills/bootstrap/`](./skills/bootstrap/) | Intake + workflow ([SKILL.md](./skills/bootstrap/SKILL.md)) |
| [`templates/`](./templates/) | App shell + install groups |
| [`templates/navigation/`](./templates/navigation/) | Mixable nav modules |
| [`templates/optional/`](./templates/optional/) | Minimal strip-down, REST assembly |

**Defaults:** i18n + Storybook on · API GraphQL · nav tabs + intro · EAS / token sync / smokes / permissions off.

Scaffolded apps replace stock Expo `README.md` with filled [`templates/project-README.md`](./templates/project-README.md).
