# Bootstrap templates

Adapt into a new app **after** `bunx create-expo-app@latest … --template default` and removing default cruft.

## Steps

1. Merge scaffold with templates — don't bulk-copy `package.json`, `app.json`, `tsconfig.json`.
2. Install deps (below) — skip groups for unchecked stack items.
3. Add template files: lint/CI, `scripts/`, `.rnstorybook/`, `codegen.ts`, `eas.json`, `src/`, `assets/`.
4. Replace demo routes with template `src/app/`.
5. Strip unchecked stack — [`optional/minimal/README.md`](./optional/minimal/README.md).
6. Argent — `bunx @swmansion/argent init -y`.
7. EAS — merge `eas.json`, set `expo.owner`, `bunx expo install expo-dev-client`, `bunx eas-cli init --non-interactive` (see bootstrap skill Phase A2).
8. Design tokens (if enabled at intake) — **after Argent** — [`FIGMA_EXPORT.md`](./FIGMA_EXPORT.md).

## Installs

Run in groups with `--verbose`, then `bun install --verbose`.

### Core (always)

```bash
bunx expo install --verbose expo-localization expo-font expo-dev-client
bun add --verbose uniwind tailwindcss zustand react-native-mmkv react-native-nitro-modules react-native-nano-icons
bun add -d --verbose @biomejs/biome eslint eslint-plugin-react-native-a11y typescript-eslint jest jest-expo @testing-library/react-native @types/jest
```

### Default stack (unless unchecked)

```bash
bun add --verbose i18next react-i18next
bun add --verbose @apollo/client graphql graphql-ws apollo3-cache-persist @graphql-typed-document-node/core
bun add -d --verbose @graphql-codegen/cli @graphql-codegen/client-preset
bun add -d --verbose storybook @storybook/react-native @storybook/addon-ondevice-actions @storybook/addon-ondevice-backgrounds @storybook/addon-ondevice-controls @storybook/addon-ondevice-notes
bun install --verbose
```

Set `EXPO_PUBLIC_GRAPHQL_URL` when GraphQL is enabled. Run `graphql:generate` when `.graphql` ops change. Subscriptions: `EXPO_PUBLIC_GRAPHQL_SUBSCRIPTIONS_ENABLED=true` (+ optional `EXPO_PUBLIC_GRAPHQL_WS_URL`).

**Fonts:** after Phase B, install packages matching exported Figma families; load via `expo-font`. See `font-families.css` from `tokens:generate`.

## Scripts

| Script | When |
|--------|------|
| `lint` / `lint:fix` / `lint:a11y` | always |
| `test` / `test:watch` | always |
| `tokens:discover` | Phase B — inspect raw exports |
| `tokens:generate` | always (stubs at scaffold; real tokens after Phase B) |
| `graphql:generate` | GraphQL enabled |
| `storybook` / `storybook-generate` | Storybook enabled |

Add to `package.json`:

```json
"tokens:discover": "node scripts/discover-figma-raw.mjs",
"tokens:generate": "node scripts/generate-design-tokens.mjs"
```

## Icons

Sample SVGs + glyphmap in `assets/icons/`. Replace SVGs from Figma → `bunx expo prebuild`.

## Raw token stubs

`src/theme/tokens/raw/` — minimal stubs for CI/Argent. Replace in Phase B — [`FIGMA_EXPORT.md`](./FIGMA_EXPORT.md). Exports may use any file/folder names; discovery is automatic.
