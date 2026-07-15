# Expo project bootstrap

Agent skill + templates for Expo React Native apps.

## Install

```bash
bunx skills add hosam-hubspire/expo-project-bootstrap --skill bootstrap -g -y
```

Then: `use bootstrap skill to scaffold a project`

## Features

During intake you give the app a name, then either accept the defaults or customize options ([SKILL.md](./skills/bootstrap/SKILL.md)).

### Optional (mix and match)

- **Add-ons** — i18n, Storybook
- **API** — GraphQL, REST, or none (pick one)
- **Navigation** — Tabs, Drawer, Intro, and Auth in any combination. If Tabs and Drawer are both off, you get a flat Stack.
- **Permissions** — Microphone, location (foreground / background), notifications, image picker, documents
- **Infra** — GitHub repo, EAS, design-token sync, iOS / Android smoke tests

### Always included

Uniwind, Bun, Biome, forms (React Hook Form + Zod), keyboard controller, bottom sheets, toasts, nano-icons, and a `Screen` helper with safe-area insets.

### Defaults

i18n and Storybook on; API set to GraphQL; navigation with tabs and intro; EAS, token sync, smoke tests, and permissions off.

## Layout

| Path | Purpose |
|------|---------|
| [`skills/bootstrap/`](./skills/bootstrap/) | Intake + workflow ([SKILL.md](./skills/bootstrap/SKILL.md)) |
| [`templates/`](./templates/) | App shell + install groups |
| [`templates/navigation/`](./templates/navigation/) | Mixable nav modules |
| [`templates/optional/`](./templates/optional/) | Minimal strip-down |
