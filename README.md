# Expo project bootstrap

Reusable agent prompt and **canonical templates** for scaffolding new Expo React Native apps (latest Expo SDK via `create-expo-app@latest`, Uniwind, Bun, Biome, design tokens, optional Storybook / GraphQL / icons).

## Usage

1. Open [PROJECT_BOOTSTRAP.md](./PROJECT_BOOTSTRAP.md)
2. Copy the prompt block into a new agent chat
3. Fill in the placeholders (`<APP_NAME>`, Figma links, optional GitHub repo, etc.)

The agent scaffolds with `create-expo-app@latest`, then **refers to and adapts** files from [`templates/`](./templates/) into the new project (merging with Expo-generated config rather than bulk-copying).

## Repository layout

| Path | Purpose |
|------|---------|
| `PROJECT_BOOTSTRAP.md` | Full agent prompt |
| `templates/` | Reference config, scripts, theme pipeline, minimal app shell, optional Storybook |
| `templates/README.md` | Adaptation workflow and dependency groups |
| `templates/FIGMA_EXPORT.md` | Figma MCP export workflow (`use_figma`), persistence, icon font regen |
| `templates/TOKENS.md` | Template to copy when Figma export is pending |
