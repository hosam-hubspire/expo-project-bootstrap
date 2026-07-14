# Expo project bootstrap

Agent skill + templates for Expo React Native apps.

## Install

```bash
bunx skills add hosam-hubspire/expo-project-bootstrap --skill bootstrap -g -y
# or local: bunx skills add ./path/to/expo-project-bootstrap --skill bootstrap -g -y
```

Then: `use bootstrap skill to scaffold a project`

## Layout

| Path | Purpose |
|------|---------|
| [`skills/bootstrap/`](./skills/bootstrap/) | Intake + workflow ([SKILL.md](./skills/bootstrap/SKILL.md)) |
| [`templates/`](./templates/) | App shell + install groups |
| [`templates/navigation/`](./templates/navigation/) | Mixable nav modules |
| [`templates/optional/`](./templates/optional/) | Minimal strip-down, REST assembly |

**Defaults:** i18n + Storybook on · API GraphQL · nav tabs + intro · EAS / token sync / smokes / permissions off.

Scaffolded apps replace stock Expo `README.md` with filled [`templates/project-README.md`](./templates/project-README.md).
