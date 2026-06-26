# Bootstrap templates

Canonical files for the Expo project bootstrap prompt. Copy into a new app **after** `bunx create-expo-app@latest … --template default@sdk-56` and removing default template cruft.

**Source repo:** https://github.com/hosam-hubspire/expo-project-bootstrap

## Copy order

1. Copy root config files into the project root (`biome.json`, `eslint.config.mjs`, `metro.config.js`, `jest.config.js`, `tsconfig.json`, `app.json`, `.nanoicons.json`, `.gitignore`, `codegen.ts`).
2. Copy `scripts/`, `.github/`, `.cursor/`, `.mcp.json`, `src/`, and `assets/` preserving paths.
3. When **Storybook** is enabled, also copy `optional/.rnstorybook/` → `.rnstorybook/` and merge `optional/src/stories/` into `src/stories/`.
4. Adapt `app.json` `name`, `slug`, and `scheme` to **New app name / slug**.
5. Replace sample Figma raw JSON under `src/theme/tokens/raw/` when a design file is provided; run `bun run tokens:generate`.
6. After exporting project icons to `assets/icons/app-icons/`, regenerate nano-icons font/glyphmap.

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

See [expo-photo-gallery `package.json`](https://github.com/hosam-hubspire/expo-photo-gallery/blob/main/package.json) for version pins compatible with SDK 56.

## What is not included

- Demo gallery screens, photo viewer, or domain GraphQL operations
- Full project icon SVG sets (placeholder icons only)
- `package.json` scripts/deps (merge manually per capability list above)
