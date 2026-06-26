# Bootstrap templates

Reference implementation for the Expo project bootstrap prompt. **Adapt** into a new app **after** `bunx create-expo-app@latest … --template default@sdk-56` and removing default template cruft.

**Source repo:** https://github.com/hosam-hubspire/expo-project-bootstrap

## Adaptation workflow

Read template files from this directory and merge them into the scaffolded project. **Do not bulk-copy** over Expo-generated config — `create-expo-app` may already define dependencies, plugins, or lines that must be preserved.

1. **Compare** each scaffolded file (`package.json`, `app.json`, `tsconfig.json`, `metro.config.js`, etc.) with the matching template.
2. **Merge** template requirements into the scaffold:
   - Add dependencies (see **Dependencies** below) and scripts (see **Scripts** below); prefer `bunx expo install` for Expo/RN packages already partially present
   - Merge `app.json` plugins, experiments, and platform settings
   - Extend `tsconfig.json` paths and strict mode without dropping Expo base config
   - Layer Uniwind/Storybook onto the existing Metro config
3. **Add** template-only files: `biome.json`, `eslint.config.mjs`, `jest.config.js`, `codegen.ts`, `scripts/`, `.github/workflows/ci.yml`, and new paths under `src/` and `assets/`.
4. **Replace** demo routes/components removed during scaffold cleanup with the minimal shell from templates (`src/app/`, core components, theme pipeline).
5. When **Storybook** is enabled, adapt `optional/.rnstorybook/` and `optional/src/stories/` into the project.
6. Set `app.json` `name`, `slug`, and `scheme` to **New app name / slug**.
7. Replace sample Figma raw JSON under `src/theme/tokens/raw/` when a design file is provided; run `bun run tokens:generate`.
8. After exporting project icons to `assets/icons/app-icons/`, regenerate font/glyphmap via the Expo plugin (outputs `.ttf` and `.glyphmap.json` alongside SVGs in the same directory).
9. For **Argent device smoke tests**: install CLI if needed (`npm i -g @swmansion/argent`), then run `npx @swmansion/argent init -y` in the project root.

## Dependencies

Install after scaffolding. Merge into the scaffolded `package.json` — do not replace the whole file.

- **`bunx expo install`** — Expo and React Native packages (including packages the scaffold already partially lists)
- **`bun add`** — runtime JS libraries
- **`bun add -d`** — devDependencies (lint, test, codegen, Storybook)

### `dependencies` (required, beyond `create-expo-app`)

- `uniwind`, `tailwindcss`
- `zustand`, `react-native-mmkv`, `react-native-nitro-modules`

### `devDependencies` (required)

- `@biomejs/biome`, `eslint`, `eslint-plugin-react-native-a11y`, `typescript-eslint`
- `jest`, `jest-expo`, `@testing-library/react-native`, `@types/jest`

### Optional — `dependencies`

- i18n: `i18next`, `react-i18next` + `bunx expo install expo-localization`
- GraphQL: `@apollo/client`, `graphql`, `graphql-ws`, `apollo3-cache-persist`, `@graphql-typed-document-node/core`
- Icons: `react-native-nano-icons`
- Fonts (when Figma/brand requires): `bunx expo install expo-font` + font packages per design

### Optional — `devDependencies`

- Storybook: `storybook`, `@storybook/react-native`, `@storybook/addon-ondevice-actions`, `@storybook/addon-ondevice-backgrounds`, `@storybook/addon-ondevice-controls`, `@storybook/addon-ondevice-notes`
- GraphQL codegen: `@graphql-codegen/cli`, `@graphql-codegen/client-preset`

Also set `"packageManager": "bun@…"` to match the installed Bun version.

## Scripts

Merge these into the scaffolded `package.json` (keep Expo defaults like `start` / `ios` / `android` if already present):

**Required:**

| Script | Command |
|--------|---------|
| `lint` | `biome check . && eslint .` |
| `lint:fix` | `biome check --write . && eslint . --fix` |
| `lint:a11y` | `eslint .` |
| `test` | `jest --ci` |
| `test:watch` | `jest --watchAll` |
| `tokens:generate` | `node scripts/generate-design-tokens.mjs` (when Figma pipeline is in scope) |

**When optional capabilities are enabled:**

| Script | Command |
|--------|---------|
| `graphql:generate` | `graphql-codegen --config codegen.ts` |
| `storybook` | `EXPO_PUBLIC_STORYBOOK_ENABLED=true expo start` |
| `storybook-generate` | `sb-rn-get-stories` |

## GraphQL example

Templates include a sample `GalleryCharacters` operation against `https://rickandmortyapi.com/graphql` (default in `client.ts`, `codegen.ts`, and `prefetchQueries.ts`). Replace with project operations when GraphQL is enabled.

## Icons

`react-native-nano-icons` is configured in `app.json` with `inputDir` and `outputDir` both set to `./assets/icons/app-icons`. No `.nanoicons.json` is required for Expo projects. Merge this plugin block into the scaffolded `app.json`.

## Argent (device smoke tests)

Argent is **not** created by `create-expo-app`. During bootstrap:

1. Install CLI if missing: `npm i -g @swmansion/argent`
2. In the project root: `npx @swmansion/argent init -y`

This generates `.cursor/rules/argent.md`, MCP config, and related files.
