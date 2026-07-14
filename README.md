# Expo project bootstrap

Agent skill + templates for Expo React Native apps.

## Install

```bash
bunx skills add hosam-hubspire/expo-project-bootstrap --skill bootstrap -g -y
```

Then: `use bootstrap skill to scaffold a project`

## Features

Intake: app name → **defaults** or customize ([SKILL.md](./skills/bootstrap/SKILL.md)).

| Area | Mixable inputs |
|------|----------------|
| Stack | i18n · Storybook |
| API | GraphQL · REST · none (exclusive) |
| Navigation | Tabs · Drawer · Intro · Auth — any combo; both Tabs + Drawer off → flat Stack |
| Permissions | Mic · Location fg/bg · Notifications · Image picker · Documents |
| Infra | GitHub repo · EAS · design-token sync · iOS / Android smokes |

Always on: Uniwind · Bun · Biome · forms (RHF + zod) · keyboard controller · bottom sheets · toasts · nano-icons · `Screen` + insets.

**Defaults:** i18n + Storybook on · API GraphQL · nav tabs + intro · EAS / token sync / smokes / permissions off.

Scaffolded apps replace stock Expo `README.md` with filled [`templates/project-README.md`](./templates/project-README.md).

## Layout

| Path | Purpose |
|------|---------|
| [`skills/bootstrap/`](./skills/bootstrap/) | Intake + workflow ([SKILL.md](./skills/bootstrap/SKILL.md)) |
| [`templates/`](./templates/) | App shell + install groups |
| [`templates/navigation/`](./templates/navigation/) | Mixable nav modules |
| [`templates/optional/`](./templates/optional/) | Minimal strip-down |
