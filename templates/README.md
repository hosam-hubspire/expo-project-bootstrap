# Bootstrap templates

Adapt into a new app **after** `bunx create-expo-app@latest … --template default` and removing default cruft.

## Steps

1. Merge scaffold with templates — don't bulk-copy `package.json`, `app.json`, `tsconfig.json`.
2. Install deps (below) — skip groups for unchecked stack items. **Expo packages:** `bunx expo install` (SDK-compatible). **All other packages:** `bun add …@latest`. Never copy version pins from this repo.
3. Add template files: lint/CI, `.rnstorybook/`, `codegen.ts`, `src/`, `assets/`. Include `eas.json` only when **Setup EAS** is on at intake.
4. **Token scripts** — copy `scripts/discover-figma-raw.mjs`, `scripts/generate-design-tokens.mjs`, `scripts/figma-export-helpers.js`, and empty `src/theme/tokens/raw/` (README only) **only when Sync design tokens is on** at intake. When off (default), copy pre-built `src/theme/tokens/generated/` only — no `raw/`, no token scripts, no `tokens:discover` / `tokens:generate` in `package.json`.
5. Replace demo routes with template `src/app/`. Merge `assets/images/tabIcons/settings.png` (+ `@2x`/`@3x`) from `templates/assets/images/tabIcons/` — the default Expo scaffold ships `home.png` but not `settings.png`.
6. Strip unchecked stack — [`optional/minimal/README.md`](./optional/minimal/README.md).
7. **Biome** — after copying `biome.json`, run `bunx biome migrate --write` (installs schema matching the installed CLI).
8. **Uniwind types** — `bunx uniwind generate-artifacts --css ./src/theme/global.css --dts ./src/uniwind-types.d.ts`
9. Argent — `bunx @swmansion/argent init -y`.
10. EAS (when enabled at intake) — merge `eas.json`, set `expo.owner`, `bunx expo install expo-dev-client`, `bunx eas-cli init --non-interactive` (see bootstrap skill Phase A2).
11. Design tokens (if enabled at intake) — **after C2** — collect Figma URL at intake; export per [`FIGMA_EXPORT.md`](./FIGMA_EXPORT.md).

**`.gitignore` merge** — add to scaffold `.gitignore` (do not replace): `.env`, `src/uniwind-types.d.ts`, `.test-screenshots/`, `coverage/`.

## Installs

**Version policy:**

| Package type | Command | Version |
|--------------|---------|---------|
| Expo / SDK-aligned | `bunx expo install <pkg>` | SDK-compatible (no `@latest`) |
| Everything else | `bun add <pkg>@latest` or `bun add -d <pkg>@latest` | `@latest` always |

**Never pass `--verbose` to `bunx expo install`** — it is not supported. Use `--verbose` on `bun add` only.

### Core (always)

```bash
bunx expo install expo-localization expo-font jest-expo
bun add --verbose uniwind@latest tailwindcss@latest zustand@latest react-native-mmkv@latest react-native-nitro-modules@latest react-native-nano-icons@latest
bun add -d --verbose @biomejs/biome@latest eslint@latest eslint-plugin-react-native-a11y@latest typescript-eslint@latest @testing-library/react-native@latest @types/jest@latest jest@latest
bunx biome migrate --write
```

### EAS (when Setup EAS is on at intake)

```bash
bunx expo install expo-dev-client
```

### Default stack (unless unchecked)

```bash
bun add --verbose i18next@latest react-i18next@latest
bun add --verbose @apollo/client@latest graphql@latest graphql-ws@latest apollo3-cache-persist@latest @graphql-typed-document-node/core@latest
bun add -d --verbose @graphql-codegen/cli@latest @graphql-codegen/client-preset@latest
bun add -d --verbose storybook@latest @storybook/react-native@latest @storybook/addon-ondevice-actions@latest @storybook/addon-ondevice-backgrounds@latest @storybook/addon-ondevice-controls@latest @storybook/addon-ondevice-notes@latest
bun install --verbose
```

### GraphQL dev placeholder

When GraphQL is enabled, add `.env.example` and a local `.env` (gitignored) before C2:

```bash
EXPO_PUBLIC_GRAPHQL_URL=https://countries.trevorblades.com/
```

The bundled `ExampleQuery` (`__typename`) works against any GraphQL endpoint. Replace with your project URL before shipping. Subscriptions: `EXPO_PUBLIC_GRAPHQL_SUBSCRIPTIONS_ENABLED=true` (+ optional `EXPO_PUBLIC_GRAPHQL_WS_URL`).

Run `graphql:generate` when `.graphql` ops change (requires `EXPO_PUBLIC_GRAPHQL_URL`).

**Fonts:** after Phase B, install packages matching exported Figma families; load via `expo-font`. See `font-families.css` from `tokens:generate`.

## Scripts

| Script | When |
|--------|------|
| `lint` / `lint:fix` / `lint:a11y` | always |
| `test` / `test:watch` | always |
| `tokens:discover` | token sync enabled — Phase B |
| `tokens:generate` | token sync enabled — Phase B |
| `graphql:generate` | GraphQL enabled |
| `storybook` / `storybook-generate` | Storybook enabled |

Add token scripts to `package.json` **only when Sync design tokens is on**:

```json
"tokens:discover": "node scripts/discover-figma-raw.mjs",
"tokens:generate": "node scripts/generate-design-tokens.mjs"
```

## Icons

Sample SVGs + glyphmap in `assets/icons/`. Replace SVGs from Figma → `bunx expo prebuild`.

Tab bar PNGs: scaffold provides `home.png`; merge `settings.png` (+ `@2x`/`@3x`) from `templates/assets/images/tabIcons/`.

## Stub tokens (sync off — default)

When **Sync design tokens** is off at intake (default), ship pre-built `src/theme/tokens/generated/` from templates. No `raw/`, no token scripts, no `tokens:*` scripts in `package.json`. Enable sync later via intake + Phase B — [`FIGMA_EXPORT.md`](./FIGMA_EXPORT.md).
