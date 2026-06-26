# Project bootstrap prompt

Reusable prompt for scaffolding a new Expo app. Copy the block below into a new agent chat and fill in the placeholders.

**Canonical templates:** https://github.com/hosam-hubspire/expo-project-bootstrap (`templates/` directory)

---

```
Bootstrap a new Expo React Native app using the architectural templates in the expo-project-bootstrap repository.

### Inputs
- **Bootstrap templates:** https://github.com/hosam-hubspire/expo-project-bootstrap (`templates/` — clone or read files from `main`)
- **New project GitHub repo:** <GITHUB_REPO_URL> (optional — omit to scaffold locally only; push when provided)
- **Figma design system:** <FIGMA_FILE_URL> (omit if not using Figma tokens yet)
- **Figma icons section:** <FIGMA_ICONS_URL> (optional — link to any Figma frame/page/section that contains the icon set to export as SVGs; omit if icons are not in scope yet)
- **New app name / slug:** <APP_NAME>
- **Default branch:** main
- **Target platforms:** iOS and Android only (no web)
- **Optional capabilities** (include only what I list): Storybook, i18n, GraphQL subscriptions, custom icon font pipeline (enable automatically when **Figma icons section** is provided)

### Goal
Create the initial project with the **tooling, folder conventions, and design-token workflow** defined in the bootstrap templates — adapted to this project's Figma file and feature scope. When **New project GitHub repo** is provided, deliver an initial commit there; otherwise scaffold locally and report the working directory path.

Figma token values, collection names, and raw export filenames will differ per project. The workflow stays the same when tokens are in scope:

discover Figma variables → raw JSON exports → generate script → generated CSS/TS → Uniwind consumption in the app (and Storybook when enabled).

Do not copy demo gallery screens, photo flows, or domain APIs from sample repos. **Refer to** bootstrap `templates/` and **adapt** them into the scaffolded project — the new `create-expo-app` output may already define dependencies, plugins, or config lines that must be preserved or merged.

---

### Project scaffold
Always bootstrap from the official Expo default template for SDK 56 — **do not** hand-roll `package.json` or clone a sample app repo as the project base.

1. **Create the Expo app** with `create-expo-app@latest` in the project root:
   - New local directory: `bunx create-expo-app@latest <APP_NAME> --template default@sdk-56`
   - Empty git checkout: `cd` into the repo root and run `bunx create-expo-app@latest . --template default@sdk-56`
   - Set `name` / `slug` in `app.json` to match **New app name / slug** when they differ from the folder name.
2. **Remove unnecessary default template files** before layering bootstrap architecture:
   - Demo routes and screens (e.g. tab explore/demo flows, sample modals) — replace with the minimal placeholder shell from templates
   - Template-only components (`components/ui/*`, parallax/demo helpers, stock `ThemedText` / `ThemedView` when superseded)
   - Template theming not used by Uniwind (`constants/Colors.ts`, `hooks/use-color-scheme*.ts`, `StyleSheet`-based theme helpers)
   - Non-Bun lockfiles (`package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`) — keep `bun.lock` only
   - Web-only artifacts (`+html.tsx`, web scripts, `.web.tsx` variants) — iOS and Android only
   - Restructure to match template conventions (move `app/` → `src/app/`, wire `@/` path aliases in `tsconfig.json`)
3. **Install additional packages** per **Required stack** and **Optional capabilities**:
   - `bun add` for JS libraries (Uniwind, Tailwind, Biome, Zustand, MMKV, etc.)
   - `npx expo install` for Expo / React Native packages so versions stay compatible with SDK 56
   - See `templates/README.md` for dependency groups per capability
4. **Apply bootstrap templates** — read files from `templates/` and **adapt** them into the scaffolded project. **Do not bulk-copy** over `package.json`, `app.json`, `tsconfig.json`, or other files the Expo template already generated; **merge** template intent with what `create-expo-app` produced:
   - **`package.json`:** add scripts and dependencies from templates/README.md; keep Expo-scaffolded versions where `npx expo install` already pinned SDK 56–compatible packages
   - **`app.json` / `expo` config:** merge plugins (`expo-router`, splash, `expo-localization`, `react-native-nano-icons`, etc.), `experiments`, and platform settings into the existing config; set `name` / `slug` / `scheme` from **New app name / slug**
   - **`tsconfig.json`:** extend `expo/tsconfig.base`; merge `paths` (`@/*`, `@/assets/*`) and `strict` with any Expo defaults already present
   - **`metro.config.js`:** start from the scaffolded Expo Metro config; layer Uniwind (`withUniwindConfig`) and Storybook (`withStorybook`) from templates
   - **`biome.json`, `eslint.config.mjs`, `jest.config.js`, `.gitignore`, `codegen.ts`:** adopt from templates; adjust includes/ignores if the scaffold uses different paths
   - **`scripts/generate-design-tokens.mjs`, `.github/workflows/ci.yml`:** add as new files (or merge CI steps if a workflow already exists)
   - **`src/`, `assets/`:** add template modules (theme, components, lib, stores, providers, minimal `src/app/` shell, i18n, GraphQL example) at the paths templates define; replace demo routes/components removed in step 2 — do not overwrite unrelated scaffold files blindly
   - **Storybook (when enabled):** adapt `optional/.rnstorybook/` and `optional/src/stories/` into the project; wire Metro and env flags per templates
   - **Figma tokens / icons:** replace sample raw JSON and placeholder SVGs when project inputs provide them; run `bun run tokens:generate` and regenerate icon font as needed
5. **Argent setup (for device smoke tests):** In the project root after templates are in place:
   - If `command -v argent` fails, install the CLI: `npm i -g @swmansion/argent`
   - Run `npx @swmansion/argent init -y` (or `argent init -y` when the CLI is on PATH) to generate project config (`.cursor/rules/argent.md`, MCP entries, etc.)
   - If the CLI cannot be installed in this environment, skip Argent setup and device verification; note that in the summary

Then continue with design tokens, icons, and feature-specific work.

---

### Required stack
- **Expo SDK 56** — scaffold with `bunx create-expo-app@latest … --template default@sdk-56`; use `npx expo install` for Expo libraries; read version-matched docs at https://docs.expo.dev/versions/v56.0.0/ (or `/versions/latest/` if newer) before writing code
- **expo-router** — file-based routing in `src/app/`, typed routes; enable `experiments.typedRoutes` and `reactCompiler` in `app.json` (per templates)
- **Uniwind + Tailwind CSS v4**
  - CSS entry: `src/theme/global.css`
  - `metro.config.js` with `withUniwindConfig({ cssEntryFile: "./src/theme/global.css" })`
  - Theme modes via `Uniwind.setTheme("light" | "dark" | "system")` when the design supports them
  - Semantic tokens in `@layer theme` with `@variant light` / `@variant dark` when Figma provides them (https://docs.uniwind.dev/theming/basics)
  - Styling via `className` — no `StyleSheet` for layout/theme unless a third-party API requires it
- **Bun** — package manager (`bun.lock`, `"packageManager": "bun@…"`; no `package-lock.json`)
- **Biome** — lint + format (`biome.json` from templates):
  - `a11y` preset
  - `nursery/noReactNativeRawText` with `ThemedText` in `skip`
  - `style/useFilenamingConvention` with path overrides for components, routes, and design-token stories
  - Exclude generated tokens, generated assets, and native folders from lint
- **ESLint** — React Native accessibility only (`eslint.config.mjs` from templates):
  - `eslint-plugin-react-native-a11y` with `configs.all`
  - `typescript-eslint` parser only — do not duplicate Biome rules
  - When `accessibilityLabel` is set, also provide `accessibilityHint`
  - Use `withUniwind` + `accent-*` classes for third-party color props where needed
- **Jest** — `jest-expo`, `@testing-library/react-native`, `@/` path aliases (`jest.config.js` from templates)
- **GitHub Actions CI** — `bun install --frozen-lockfile` → `bun run lint` → `bun run test` (`.github/workflows/ci.yml` from templates)
- **TypeScript** — strict mode, `@/` path aliases (`tsconfig.json` from templates)
- **State / storage** — Zustand + react-native-mmkv; shared MMKV adapter in `src/lib/mmkv.ts`; persisted stores in `src/stores/` (templates include theme/language preferences)

### Optional stack (enable only when listed in Inputs)
- **Storybook (on-device)** — `.rnstorybook/` from `templates/optional/`, gated by `EXPO_PUBLIC_STORYBOOK_ENABLED`; colocate component stories; design-token stories under `src/stories/design-tokens/` when used
- **i18n** — `i18next`, `react-i18next`, `expo-localization` (templates include `src/i18n/` shell)
- **GraphQL** — Apollo Client v4 with codegen (`graphql:generate`); templates ship example `GalleryCharacters` operation and generated types against `https://rickandmortyapi.com/graphql` (override via `EXPO_PUBLIC_GRAPHQL_URL`); operations in `src/services/graphql/operations/*.graphql`, generated output in `src/services/graphql/generated/`, singleton client in `src/services/graphql/client.ts`; **cache persist (MMKV via `apollo3-cache-persist`) and startup prefetch enabled by default** via `prefetchQueries.ts`; WebSocket subscriptions **optional** (`EXPO_PUBLIC_GRAPHQL_SUBSCRIPTIONS_ENABLED=true`, optional `EXPO_PUBLIC_GRAPHQL_WS_URL`); replace the example operation with project queries when GraphQL is enabled
- **Icons** — when **Figma icons section** is provided, follow the icon pipeline below (SVG → `react-native-nano-icons` font); otherwise use placeholder icons from templates or omit until a link is provided
- **Fonts** — load via `expo-font` only when Figma or brand guidelines require them; define stacks in `src/theme/global.css`

---

### Design token pipeline (when Figma is provided)
1. Inspect the Figma file and inventory variable collections: colors, typography, spacing/sizing, radius, shadows, etc. **Not every project has everything** — some have no dark mode, no breakpoint modes, no primitives, or different mode names.
2. Export raw JSON (Figma MCP, Variables export, or manual extraction) into `src/theme/tokens/raw/`. **Filenames and collections are project-specific** — map them in `scripts/generate-design-tokens.mjs` under `RAW_FILES`.
3. **Adapt the generator per project** (templates ship a sample Figma structure — reconfigure, do not assume every project matches):
   - Configure `RAW_FILES`, mode names (`LIGHT_MODE`, `DARK_MODE`, typography/size modes), and breakpoints
   - Detect which modes exist and fall back gracefully:
     - **No dark mode:** emit `@variant light` only
     - **Typography/size breakpoints:** may be separate `sm` / `md` / `lg`, combined modes, or a single mode — emit responsive Uniwind classes only when modes exist and differ
     - **Missing optional files** (primitives, text styles): skip those outputs
   - Emit only what the project needs — typically semantic colors, spacing, and typography as Uniwind CSS variables
   - Emit Storybook metadata only when Storybook is enabled
4. Wire `src/theme/global.css` to import generated CSS and register Uniwind breakpoints when responsive tokens exist.
5. Run `bun run tokens:generate` and commit generated output.
6. **Never hand-edit** `src/theme/tokens/generated/*` or auto-generated story metadata files.

The template generator (`scripts/generate-design-tokens.mjs`) is a **starting point**, not a fixed spec. Trim or extend it to match this project's Figma file and goals.

If Figma JSON is not available yet, scaffold the theme folder and generator config, stub minimal tokens if needed for CI, and document what remains in `TOKENS.md`.

---

### Icon pipeline (when Figma icons section is provided)
1. Open the linked section (frame, page, or component set) and inventory every distinct **logical** icon — not every layer variant.
2. **Deduplicate before export.** The source section may repeat the same icon at multiple sizes and in light/dark (or other) modes. Export **one SVG per logical icon** only:
   - Treat size variants (16, 20, 24, 32, …) as the same icon — `size` is a prop on `Icon`.
   - Treat light/dark (or filled/tinted) color variants as the same icon — `color` / `colorToken` are props on `Icon`.
   - When variants differ only by size or color, pick a single canonical source (prefer the default/neutral mode and a mid size such as 24px).
   - When variants differ by **shape** (e.g. outline vs solid, chevron-left vs chevron-right), export separate icons with distinct semantic names.
   - Normalize names to kebab-case filenames that match the glyph name (e.g. `home.svg`, `chevron-left.svg`) — never encode size or theme in the filename.
3. Export SVGs into `assets/icons/app-icons/`. Strip hardcoded `fill` / `stroke` colors where possible so icons tint via the `Icon` component; keep viewBox/geometry intact.
4. Wire the icon font pipeline from templates:
   - `react-native-nano-icons` Expo config plugin with `inputDir` and `outputDir` both `./assets/icons/app-icons` (`.ttf` + `.glyphmap.json` generated alongside SVGs — no `.nanoicons.json` needed for Expo)
   - `Icon` wrapper in `src/components/Icon/` with typed `name`, `size`, and `color` / `colorToken` props
   - `IconFontLoader` in root layout when fonts are required
5. Exclude `assets/icons/**` from Biome/ESLint per templates; add a design-token Storybook grid under `src/stories/design-tokens/Icons.stories.tsx` when Storybook is enabled.
6. After adding or changing SVGs, regenerate the font/glyphmap and verify `Icon` renders a sample set at multiple sizes and color tokens.

If the icons link is omitted, keep placeholder SVGs from templates or scaffold `assets/icons/app-icons/` empty only when I asked for the icon font pipeline in **Optional capabilities**.

---

### App architecture (conventions, not a fixed file list)

    src/
      app/                         # expo-router — kebab-case routes (e.g. settings.tsx, user-profile/[id].tsx)
      components/
        Button/                    # PascalCase folder
          Button.tsx
          Button.stories.tsx       # when Storybook is enabled
          Button.test.ts           # when tests exist
          index.ts                 # barrel re-export
      theme/
        global.css                 # CSS entry (import in root layout)
        typography.ts              # className helpers for tokens
        tokens/raw/
        tokens/generated/
      stories/design-tokens/       # optional — token Storybook stories only
      hooks/                       # kebab-case files
      providers/
      stores/                      # Zustand stores (MMKV-persisted preferences, etc.)
      lib/
        mmkv.ts                    # shared MMKV adapter for Zustand persist
      services/
        graphql/
          client.ts
          apollo-cache-storage.ts
          prefetchQueries.ts
          operations/
          generated/
      i18n/                        # optional

**File naming (enforce with Biome `useFilenamingConvention` overrides from templates):**
- **Components:** PascalCase folders and files (`src/components/Button/Button.tsx`); import via barrel `@/components/Button`
- **Component stories/tests:** colocated in the component folder
- **App routes:** kebab-case files and folders; Expo Router route groups `(group)` and dynamic segments `[param]` are allowed
- **Design token stories:** `src/stories/design-tokens/` with PascalCase story files (when Storybook is enabled)
- **Everything else under `src/`:** kebab-case
- **Barrel `index.ts` in component folders:** allowed; exempt from PascalCase via Biome override

**Styling conventions:**
- Route all user-facing text through `ThemedText` (or equivalent token-aware primitives from templates)
- Layout and colors through Uniwind `className`
- Third-party components that only accept color/style props: `withUniwind` or `useResolveClassNames`
- Navigation targets: `accessibilityRole`, `accessibilityLabel`, `accessibilityHint`; prefer `Link` with `asChild` + `Pressable` where applicable

**Theming:**
- Generated CSS variables are the source of truth for semantic tokens
- Components reference tokens via Tailwind/Uniwind classes (`text-*`, `bg-*`, etc.)
- Persist theme preference and apply with `Uniwind.setTheme` when light/dark/system is in scope

---

### Minimal initial app
Templates ship a thin shell: Home + Settings tabs, theme/language toggles on Settings, root layout with providers. Unless I specify otherwise:
- Keep or simplify that shell — do not add sample APIs, galleries, or domain flows unless I list them in Inputs
- All interactive elements meet the a11y rules above

---

### Scripts (package.json)
**Required:**
- `start`, `ios`, `android`
- `lint` (`biome check . && eslint .`), `lint:fix`, `lint:a11y`
- `test`, `test:watch`
- `tokens:generate` (when Figma pipeline is in scope)

**When optional capabilities are enabled:**
- GraphQL: `graphql:generate` (`codegen.ts` → `src/services/graphql/generated/`)
- Storybook: `storybook`, `storybook:ios`, `storybook:android`, `storybook-generate`

---

### Git deliverable
1. **Project root:** if **New project GitHub repo** is provided, clone it locally (or use an existing empty repo checkout). Otherwise, create a new local directory and `git init` with `main` as the default branch.
2. **Scaffold** per **Project scaffold** above (`bunx create-expo-app@latest … --template default@sdk-56`, remove template cruft, install packages, adapt bootstrap templates into the project).
3. Implement per Inputs and remaining sections above.
4. Run and verify:
   - `bun install`
   - `bun run tokens:generate` (when applicable)
   - Regenerate icon font/glyphmap (when icon pipeline is in scope)
   - `bun run lint`
   - `bun run test`
   - `npx tsc --noEmit`
5. **Device smoke test (before commit/push, when Argent is available):** confirm Argent is installed (`command -v argent` or `mcp__argent__*` tools present). Project config should already exist from **Project scaffold** step 5 (`argent init`). If yes, run the app on **both iOS and Android devices** (simulator, emulator, or connected hardware) and verify there are no issues before pushing:
   - Boot or use a running iOS simulator and Android emulator (`list-devices` → prefer already-booted targets)
   - Start Metro if needed, then launch the app on each platform (`launch-app` / Expo dev client workflow)
   - Smoke-test the initial shell: app launches without redbox/crash, root layout and placeholder screen(s) render, theme/icons/fonts load if in scope, and basic navigation works when multiple screens exist
   - Use Argent discovery tools (`describe`, `debugger-component-tree`) before interactions — do not guess tap coordinates from screenshots
   - Fix any launch, runtime, or visible UI issues found; re-run lint/tests after fixes
   - If Argent is **not** installed, skip device verification, note that in the summary, and still complete static checks above
6. One initial commit on `main` (or ask if the repo is not empty).
7. **Push (only when New project GitHub repo is provided):** add `origin` if needed, then push to the remote. If no GitHub repo was given, stop after the local commit and report the local path.
8. Reply with: local project path, remote repo URL (if pushed), commit SHA, what was enabled vs omitted, Figma file key (if any), mode names and raw files used, icon count exported (and how duplicates were collapsed, if any), **device verification results on iOS and Android (or that Argent was unavailable)**, and any custom Figma → code mappings.

---

### Constraints
- Start from `bunx create-expo-app@latest … --template default@sdk-56` — do not skip the official template or clone a sample app as the project base
- Adapt bootstrap `templates/` into the scaffolded project (merge config, add `src/` modules) — do not bulk-replace Expo-generated `package.json` / `app.json` / `tsconfig.json`, and do not invent parallel architecture from scratch when a template file exists
- iOS and Android only — no web deployment, no `.web.tsx` variants, no `expo start --web`
- Biome for formatting/general lint; ESLint only for `eslint-plugin-react-native-a11y`
- Bun only (no npm/yarn)
- No secrets or `.env` in git
- No font families absent from Figma or brand guidelines
- No `StyleSheet` where Uniwind `className` applies
- Keep generated tokens in sync; CI must pass before push (when a remote repo is provided)
- When Argent is available and a remote repo is provided, do not push until iOS and Android device smoke tests pass with no launch/runtime/UI issues
- Biome-formatted, `@/` path aliases, strict TypeScript
```

---

### Optional add-on blocks

Copy any of these into the main prompt when needed.

**GraphQL subscriptions**
```
Enable WebSocket subscriptions: set EXPO_PUBLIC_GRAPHQL_SUBSCRIPTIONS_ENABLED=true and optionally EXPO_PUBLIC_GRAPHQL_WS_URL (defaults to the HTTP endpoint with ws/wss). Keep cache persist and prefetch enabled unless I say otherwise.
```

**Storybook**
```
Enable on-device Storybook. Before pushing, confirm tokens render for each theme mode and breakpoint this project supports. Document non-obvious Figma → code mappings in TOKENS.md.
```

**Figma / tokens only**
```
Light-only or single-breakpoint projects are valid — do not add dark or responsive output the Figma file does not define.
```

**Figma icons only**
```
Export icons from <FIGMA_ICONS_URL>. Deduplicate size and light/dark variants — one SVG per logical icon; size and color are Icon props. Document any ambiguous variants (same name, different shape) in the bootstrap summary.
```

**Device verification (Argent)**
```
Install Argent if needed (`npm i -g @swmansion/argent`), run `npx @swmansion/argent init -y` in the project root during scaffold, then boot iOS simulator and Android emulator, launch the app on both, and confirm no crashes/redboxes and the placeholder shell renders correctly. Report devices used and any issues fixed.
```
