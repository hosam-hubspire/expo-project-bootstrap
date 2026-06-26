# Bootstrap templates

Reference implementation for the Expo project bootstrap prompt. **Adapt** into a new app **after** `bunx create-expo-app@latest … --template default` and removing default template cruft.

**Non-interactive scaffold:** use `bunx create-expo-app@latest <APP_NAME> …` for a new folder (no prior `git init`). When `.git` already exists, run `CI=true bunx create-expo-app@latest . …`.

**Source repo:** https://github.com/hosam-hubspire/expo-project-bootstrap

## Adaptation workflow

Read template files from this directory and merge them into the scaffolded project. **Do not bulk-copy** over Expo-generated config — `create-expo-app` may already define dependencies, plugins, or lines that must be preserved.

1. **Compare** each scaffolded file (`package.json`, `app.json`, `tsconfig.json`, `metro.config.js`, etc.) with the matching template.
2. **Merge** template requirements into the scaffold:
   - Install dependencies via CLI (see `templates/README.md` **Installing dependencies**) — checklist only, no hand-written versions; then merge scripts
   - Merge `app.json` plugins, experiments, and platform settings
   - Extend `tsconfig.json` paths and strict mode without dropping Expo base config
   - Layer Uniwind/Storybook onto the existing Metro config
3. **Add** template-only files: `biome.json`, `eslint.config.mjs`, `jest.config.js`, `codegen.ts`, `scripts/`, `FIGMA_EXPORT.md`, `TOKENS.md`, `.github/workflows/ci.yml`, and new paths under `src/` and `assets/`.
4. **Replace** demo routes/components removed during scaffold cleanup with the minimal shell from templates (`src/app/`, core components, theme pipeline).
5. When **Storybook** is enabled, adapt `optional/.rnstorybook/` and `optional/src/stories/` into the project.
6. Set `app.json` `name`, `slug`, and `scheme` to **New app name / slug**.
7. **Figma export (when a design file is provided):** run **Phase B (tokens)** and **Phase C (icons)** as separate gated steps after `bun install` — see [`FIGMA_EXPORT.md`](./FIGMA_EXPORT.md). MCP fetch alone is not export; persist each payload with `scripts/persist-figma-export.mjs` and verify counts on disk before `tokens:generate` or icon font regeneration.
8. For **Argent device smoke tests**: install CLI if needed (`npm i -g @swmansion/argent`), then run `npx @swmansion/argent init -y` in the project root.

## Dependencies

Install after scaffolding. The lists below are a **package checklist only** — there is no `templates/package.json` and **no version pins**. Do not replace the scaffolded `package.json`; add packages with the CLI so Bun/npm resolve real versions into `package.json` and `bun.lock`.

- **`bunx expo install <pkg> …`** — Expo and React Native packages (including packages the scaffold already partially lists)
- **`bun add <pkg> …`** — runtime JS libraries
- **`bun add -d <pkg> …`** — devDependencies (lint, test, codegen, Storybook)

### Installing dependencies

1. Read the checklist sections below for **which** packages to add (required + enabled optional capabilities).
2. Install with the CLI — **never** type `"name": "^x.y.z"` into `package.json` by hand.
3. **Run each command separately** — do not chain multiple `bun add` / `bun add -d` calls with `&&`. Large combined devDependency installs (especially Storybook + GraphQL codegen in one batch) can hang on `Resolving dependencies`.
4. Merge **scripts** and `"packageManager": "bun@…"` from **Scripts** below into `package.json` manually.
5. Run `bun install` (or `bun install --frozen-lockfile` after the lockfile exists) and **stop if it fails** — do not proceed to Figma export, `tokens:generate`, lint, or commit until install succeeds.
6. To verify a version before pinning a nightly or override: `npm view <pkg> version` or `npm view <pkg> dist-tags`.

**Required — run in order (one command per line):**

```bash
bunx expo install expo-localization
bun add uniwind tailwindcss zustand react-native-mmkv react-native-nitro-modules
bun add react-native-nano-icons
bun add -d @biomejs/biome eslint eslint-plugin-react-native-a11y typescript-eslint jest jest-expo @testing-library/react-native @types/jest
```

**Optional — add only enabled capabilities (one command per line):**

```bash
# i18n (runtime)
bun add i18next react-i18next

# GraphQL (runtime)
bun add @apollo/client graphql graphql-ws apollo3-cache-persist @graphql-typed-document-node/core

# Storybook (dev)
bun add -d storybook @storybook/react-native @storybook/addon-ondevice-actions @storybook/addon-ondevice-backgrounds @storybook/addon-ondevice-controls @storybook/addon-ondevice-notes

# GraphQL codegen (dev)
bun add -d @graphql-codegen/cli @graphql-codegen/client-preset

# Fonts (when Figma/brand requires)
bunx expo install expo-font
```

After all applicable commands finish, run `bun install` once to confirm the lockfile is consistent.

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

**Figma export (when a design file is provided):** see [`FIGMA_EXPORT.md`](./FIGMA_EXPORT.md). Persist MCP payloads with `scripts/persist-figma-export.mjs` — do not add project-specific export scripts.

**When optional capabilities are enabled:**

| Script | Command |
|--------|---------|
| `graphql:generate` | `graphql-codegen --config codegen.ts` |
| `storybook` | `EXPO_PUBLIC_STORYBOOK_ENABLED=true expo start` |
| `storybook-generate` | `sb-rn-get-stories` |
| `icons:generate` | `react-native-nano-icons --path ./assets/icons` (when icon font pipeline is in scope) |

## GraphQL example

Templates include a sample `GalleryCharacters` operation against `https://rickandmortyapi.com/graphql` (default in `client.ts`, `codegen.ts`, and `prefetchQueries.ts`). Replace with project operations when GraphQL is enabled.

## Icons

`react-native-nano-icons` is configured in `app.json` with `inputDir` and `outputDir` both set to `./assets/icons`. SVGs, `.nanoicons.json`, `.ttf`, and `.glyphmap.json` all live in that folder — not a nested `app-icons/` subfolder.

| When | Regenerate `.ttf` + `.glyphmap.json` |
|------|--------------------------------------|
| **Expo prebuild / dev client build** | Expo config plugin (no `.nanoicons.json` required) |
| **Bootstrap / CI before prebuild** | Copy `assets/icons/.nanoicons.json.example` → `assets/icons/.nanoicons.json`, then `bun run icons:generate` |

**Never** run `react-native-nano-icons` without `--path ./assets/icons` (or the `icons:generate` script) — the default cwd is the project root and produces a stray root-level `app-icons.glyphmap.json`. Add `/app-icons.glyphmap.json` and `/app-icons.ttf` to `.gitignore` as a safety net.

Merge the plugin block into the scaffolded `app.json`. Export and persist SVGs per [`FIGMA_EXPORT.md`](./FIGMA_EXPORT.md).

## Argent (device smoke tests)

Argent is **not** created by `create-expo-app`. During bootstrap:

1. Install CLI if missing: `npm i -g @swmansion/argent`
2. In the project root: `npx @swmansion/argent init -y`

This generates `.cursor/rules/argent.md`, MCP config, and related files.
