# Bootstrap templates

Canonical files for the Expo project bootstrap prompt. Copy into a new app **after** `bunx create-expo-app@latest … --template default@sdk-56` and removing default template cruft.

**Source repo:** https://github.com/hosam-hubspire/expo-project-bootstrap

## Copy order

1. Copy root config files into the project root (`biome.json`, `eslint.config.mjs`, `metro.config.js`, `jest.config.js`, `tsconfig.json`, `app.json`, `.gitignore`, `codegen.ts`).
2. Copy `scripts/`, `.github/`, `src/`, and `assets/` preserving paths.
3. When **Storybook** is enabled, copy `optional/.rnstorybook/` → `.rnstorybook/` and merge `optional/src/stories/` into `src/stories/`.
4. When running **Argent device smoke tests**, copy `optional/argent/` contents into the project root (`.cursor/`, `.mcp.json`) **or** run `npx @swmansion/argent init -y` in the new project if Argent is installed globally.
5. Adapt `app.json` `name`, `slug`, and `scheme` to **New app name / slug**.
6. Replace sample Figma raw JSON under `src/theme/tokens/raw/` when a design file is provided; run `bun run tokens:generate`.
7. After exporting project icons to `assets/icons/app-icons/`, regenerate font/glyphmap via the Expo plugin (outputs `.ttf` and `.glyphmap.json` alongside SVGs in the same directory).

## Dependencies

Install after scaffolding. Use `npx expo install` for Expo/React Native packages; `bun add` for everything else.

**Required** (from `create-expo-app` plus):

- `uniwind`, `tailwindcss`
- `zustand`, `react-native-mmkv`, `react-native-nitro-modules`
- `@biomejs/biome`, `eslint`, `eslint-plugin-react-native-a11y`, `typescript-eslint`
- `jest-expo`, `@testing-library/react-native`, `@types/jest`

**When optional capabilities are enabled:**

- Storybook: `@storybook/react-native`, `storybook`, on-device addons, `sb-rn-get-stories`
- i18n: `i18next`, `react-i18next`, `expo-localization`
- GraphQL: `@apollo/client`, `graphql`, `graphql-ws`, `apollo3-cache-persist`, `@graphql-codegen/cli`, `@graphql-codegen/client-preset`, `@graphql-typed-document-node/core`
- Icons: `react-native-nano-icons`
- Fonts (when Figma/brand requires): `expo-font`, font packages per design

## GraphQL example

Templates include a sample `GalleryCharacters` operation against `https://rickandmortyapi.com/graphql` (default in `client.ts`, `codegen.ts`, and `prefetchQueries.ts`). Replace with project operations when GraphQL is enabled.

## Icons

`react-native-nano-icons` is configured in `app.json` with `inputDir` and `outputDir` both set to `./assets/icons/app-icons`. No `.nanoicons.json` is required for Expo projects.

## Argent (optional)

Argent is **not** created by `create-expo-app` or the bootstrap scaffold. Device smoke tests need either:

- `npx @swmansion/argent init -y` run in the new project (when the Argent CLI is installed), **or**
- Copy `optional/argent/.cursor/` and `optional/argent/.mcp.json` into the project root from templates.

Argent only applies when the CLI/MCP server is installed in the agent environment.

See [expo-photo-gallery `package.json`](https://github.com/hosam-hubspire/expo-photo-gallery/blob/main/package.json) for version pins compatible with SDK 56.

## What is not included

- Demo gallery screens and photo viewer UI
- Full project icon SVG sets (placeholder icons only; sample `GalleryCharacters` GraphQL operation is included as infrastructure example)
- `package.json` scripts/deps (merge manually per capability list above)
