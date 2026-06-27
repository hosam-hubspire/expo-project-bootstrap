# Bootstrap templates

Reference implementation for the bootstrap skill. **Adapt** into a new app **after** `bunx create-expo-app@latest … --template default` and removing default cruft.

**Non-interactive:** new folder → `bunx create-expo-app@latest <APP_NAME> …`. Existing `.git` → `CI=true bunx create-expo-app@latest . …`.

**Source:** https://github.com/hosam-hubspire/expo-project-bootstrap

## Adaptation workflow

1. **Compare** scaffolded files with templates — merge, do not bulk-copy `package.json`, `app.json`, `tsconfig.json`.
2. **Install** dependencies (grouped commands below) — CLI resolves versions; merge scripts manually.
3. **Add** template-only files: lint config, `scripts/`, CI, `FIGMA_EXPORT.md`, `TOKENS.md`, `src/`, `assets/`.
4. **Replace** demo routes with the minimal shell from `src/app/`.
5. **Enable optional capabilities** from `optional/` — see **Capability merges**.
6. **Figma tokens** (when a design-system URL is provided): Phase B after `bun install` — [`FIGMA_EXPORT.md`](./FIGMA_EXPORT.md).
7. **Argent:** `npm i -g @swmansion/argent`; `npx @swmansion/argent init -y` in project root.

## Installing dependencies

Package checklist only — no `templates/package.json`, no hand-written version ranges.

- **`bunx expo install --verbose …`** — Expo / React Native packages
- **`bun add --verbose …`** — runtime libraries
- **`bun add -d --verbose …`** — devDependencies

Install in **logical groups** (one shell command per group). Use `--verbose` so Bun logs stream in the UI. Wait for each group to finish (non-zero exit = stop). After all groups: `bun install --verbose`.

Merge **scripts** and `"packageManager": "bun@…"` from **Scripts** below into `package.json`.

### Required groups

```bash
# Expo / localization
bunx expo install --verbose expo-localization

# Styling + state
bun add --verbose uniwind tailwindcss zustand react-native-mmkv react-native-nitro-modules

# Icons (nano-icons font pipeline)
bun add --verbose react-native-nano-icons

# Lint + format
bun add -d --verbose @biomejs/biome eslint eslint-plugin-react-native-a11y typescript-eslint

# Test
bun add -d --verbose jest jest-expo @testing-library/react-native @types/jest

bun install --verbose
```

### Optional groups (enabled capabilities only)

```bash
# i18n
bun add --verbose i18next react-i18next

# GraphQL runtime
bun add --verbose @apollo/client graphql graphql-ws apollo3-cache-persist @graphql-typed-document-node/core

# GraphQL codegen (dev)
bun add -d --verbose @graphql-codegen/cli @graphql-codegen/client-preset

# Storybook (dev)
bun add -d --verbose storybook @storybook/react-native @storybook/addon-ondevice-actions @storybook/addon-ondevice-backgrounds @storybook/addon-ondevice-controls @storybook/addon-ondevice-notes

# Fonts (when Figma/brand requires)
bunx expo install --verbose expo-font

bun install --verbose
```

## Capability merges

Apply only for capabilities the user selected.

### i18n

1. Copy `optional/src/i18n/` → `src/i18n/`
2. Replace `src/stores/preferences-store.ts` with `optional/src/stores/preferences-store.ts`
3. Replace `src/app/(tabs)/index.tsx`, `settings.tsx`, `src/components/AppTabs/AppTabs.tsx` with optional versions
4. Replace `src/app/_layout.tsx` with `optional/src/app/_layout.with-i18n.tsx` (or merge the `@/i18n` import)

### GraphQL

1. Copy `optional/src/services/graphql/` → `src/services/graphql/`
2. Copy `optional/src/providers/` → `src/providers/`
3. Copy `optional/codegen.ts` → project root
4. Merge `_layout.with-graphql.tsx` — wrap app in `AppApolloProvider`
5. Run `bun run graphql:generate`

Example operation: `GalleryCharacters` against Rick & Morty API — replace with project operations.

### Storybook

1. Copy `optional/.rnstorybook/` → `.rnstorybook/`
2. Copy `optional/src/stories/` → `src/stories/`
3. Copy colocated `optional/src/components/*/*.stories.tsx` into matching `src/components/` folders
4. Replace `metro.config.js` with `optional/metro.config.with-storybook.js`
5. Replace or merge `_layout.with-storybook.tsx` (Storybook env gate)

### GraphQL + i18n + Storybook

Compose layout merges — e.g. i18n import + Apollo wrapper + Storybook branch.

## Scripts

Merge into scaffolded `package.json`:

| Script | Command |
|--------|---------|
| `lint` | `biome check . && eslint .` |
| `lint:fix` | `biome check --write . && eslint . --fix` |
| `lint:a11y` | `eslint .` |
| `test` | `jest --ci` |
| `test:watch` | `jest --watchAll` |
| `tokens:generate` | `node scripts/generate-design-tokens.mjs` |
| `graphql:generate` | `graphql-codegen --config codegen.ts` (GraphQL) |
| `storybook` | `EXPO_PUBLIC_STORYBOOK_ENABLED=true expo start` (Storybook) |
| `storybook-generate` | `sb-rn-get-stories` (Storybook) |
| `icons:generate` | `react-native-nano-icons --path ./assets/icons` (icons) |

## Icons

`react-native-nano-icons` is configured in `app.json`: `inputDir` and `outputDir` → `./assets/icons`. Sample SVGs ship in `assets/icons/` so the app compiles out of the box.

**Adding icons from Figma:** export SVGs from Figma and place them in `assets/icons/` (kebab-case filenames, e.g. `home.svg`). Use `fill="currentColor"` / `stroke="currentColor"` so icons respect theme colors. Then regenerate the font:

| Context | Regenerate `.ttf` + `.glyphmap.json` |
|---------|--------------------------------------|
| Prebuild / dev client | Expo config plugin |
| Bootstrap / CI | Copy `.nanoicons.json.example` → `.nanoicons.json`, then `bun run icons:generate` |

Set `fontFamily` to `"nanoicons"` in `.nanoicons.json`. Wire `Icon` and `IconFontLoader` from templates (already in the default shell).

## Argent

Not created by `create-expo-app`. During bootstrap: install CLI if needed, run `npx @swmansion/argent init -y` in project root.

## Raw token stubs

`src/theme/tokens/raw/` ships **3 sample files** (`color-tokens`, `size-tokens`, `typography-tokens`) so CI compiles before Phase B. Replace entirely during Figma export — see [`FIGMA_EXPORT.md`](./FIGMA_EXPORT.md).
