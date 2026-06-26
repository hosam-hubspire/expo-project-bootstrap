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
Always bootstrap from the official Expo default template for the **latest SDK** — **do not** hand-roll `package.json` or clone a sample app repo as the project base.

1. **Create the Expo app** with `create-expo-app@latest` in the project root (no SDK pin — `@latest` + `--template default` installs the current Expo SDK). **Non-interactive only** — agents must not wait on prompts:
   - **New local directory (preferred):** `bunx create-expo-app@latest <APP_NAME> --template default` — do **not** `git init` first; `create-expo-app` initializes git. Run `git branch -M main` afterward if the default branch is not `main`.
   - **Empty git checkout or existing `.git`:** `cd` into the repo root and run `CI=true bunx create-expo-app@latest . --template default`. Never run `git init` before `create-expo-app .` without `CI=true`.
   - Set `name` / `slug` in `app.json` to match **New app name / slug** when they differ from the folder name.
2. **Remove unnecessary default template files** before layering bootstrap architecture:
   - Demo routes and screens (e.g. tab explore/demo flows, sample modals) — replace with the minimal placeholder shell from templates
   - Template-only components (`components/ui/*`, parallax/demo helpers, stock `ThemedText` / `ThemedView` when superseded)
   - Template theming not used by Uniwind (`constants/Colors.ts`, `hooks/use-color-scheme*.ts`, `StyleSheet`-based theme helpers)
   - Non-Bun lockfiles (`package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`) — keep `bun.lock` only
   - Web-only artifacts (`+html.tsx`, web scripts, `.web.tsx` variants) — iOS and Android only
   - Restructure to match template conventions (move `app/` → `src/app/`, wire `@/` path aliases in `tsconfig.json`)
3. **Install additional packages** per **Required stack** and **Optional capabilities** (see `templates/README.md` **Installing dependencies**):
   - `templates/README.md` lists **package names only** — not version ranges. Install every required/enabled package with `bun add`, `bun add -d`, or `bunx expo install`; **do not** hand-write version ranges in `package.json` — let the CLI resolve versions into `package.json` and `bun.lock`.
   - `bunx expo install` for Expo / React Native packages (SDK-aligned)
   - `bun add` for runtime libraries; `bun add -d` for devDependencies
   - **Run each install command separately** — do not chain multiple `bun add` / `bun add -d` calls with `&&`. Split required runtime, required dev, and each optional capability (Storybook, GraphQL codegen, etc.) into its own command; combined dev batches can hang on `Resolving dependencies`.
   - Run `bun install` and confirm exit code **0** before step 4 — do not continue bootstrap on a failed install
4. **Apply bootstrap templates** — read files from `templates/` and **adapt** them into the scaffolded project. **Do not bulk-copy** over `package.json`, `app.json`, `tsconfig.json`, or other files the Expo template already generated; **merge** template intent with what `create-expo-app` produced:
   - **`package.json`:** dependencies and devDependencies come from step 3 CLI installs; manually merge **scripts** and `"packageManager"` from `templates/README.md` only — keep Expo-scaffolded versions where `bunx expo install` already pinned SDK-compatible packages
   - **`app.json` / `expo` config:** merge plugins (`expo-router`, splash, `expo-localization`, `react-native-nano-icons`, etc.), `experiments`, and platform settings into the existing config; set `name` / `slug` / `scheme` from **New app name / slug**
   - **`tsconfig.json`:** extend `expo/tsconfig.base`; merge `paths` (`@/*`, `@/assets/*`) and `strict` with any Expo defaults already present
   - **`metro.config.js`:** start from the scaffolded Expo Metro config; layer Uniwind (`withUniwindConfig`) and Storybook (`withStorybook`) from templates
   - **`biome.json`, `eslint.config.mjs`, `jest.config.js`, `.gitignore`, `codegen.ts`:** adopt from templates; adjust includes/ignores if the scaffold uses different paths
   - **`scripts/generate-design-tokens.mjs`, `scripts/persist-figma-export.mjs`, `.github/workflows/ci.yml`:** add as new files (or merge CI steps if a workflow already exists)
   - **`src/`, `assets/`:** add template modules (theme, components, lib, stores, providers, minimal `src/app/` shell, i18n, GraphQL example) at the paths templates define; replace demo routes/components removed in step 2 — do not overwrite unrelated scaffold files blindly
   - **Storybook (when enabled):** adapt `optional/.rnstorybook/` and `optional/src/stories/` into the project; wire Metro and env flags per templates
   - **Figma (when URLs are provided):** run **after** scaffold + successful `bun install` — see **Figma export phases** below. Do **not** bundle token and icon export with template application; complete each phase and its gate before the next.
5. **Argent setup (for device smoke tests):** In the project root after templates are in place:
   - If `command -v argent` fails, install the CLI: `npm i -g @swmansion/argent`
   - Run `npx @swmansion/argent init -y` (or `argent init -y` when the CLI is on PATH) to generate project config (`.cursor/rules/argent.md`, MCP entries, etc.)
   - If the CLI cannot be installed in this environment, skip Argent setup and device verification; note that in the summary

**Figma export phases (when Figma URLs are provided):** MCP fetch alone is **not** export — data must be persisted to disk with `scripts/persist-figma-export.mjs` before moving on. Run tokens and icons as **separate phases** (see `templates/FIGMA_EXPORT.md`). Do not commit until every applicable gate passes.

| Phase | When | Gate (all must pass before next phase / commit) |
|-------|------|--------------------------------------------------|
| **A — Scaffold** | Always first | Templates applied; `bun install` exit 0 |
| **B — Design tokens** | **Figma design system** URL provided | Raw JSON on disk matches Figma inventory (counts + mode names); generator constants updated; `bun run tokens:generate` log matches file |
| **C — Icons** | **Figma icons section** URL provided | SVG count on disk matches inventory; font/glyphmap regenerated via nano-icons CLI |
| **D — Verify** | Before commit | lint, test, tsc; Argent smoke tests when available |

**Phase B — Design tokens (token gate):**
1. List collections (`getLocalVariableCollectionsAsync`) — record mode names and variable counts.
2. Update `LIGHT_MODE`, `DARK_MODE`, and typography/size constants in `scripts/generate-design-tokens.mjs` from discovered modes (do not assume `Dark` / `Default` from template stubs).
3. Export **one collection per** `use_figma` call (bulk multi-collection responses truncate). Write each payload to `/tmp`, then immediately:
   `node scripts/persist-figma-export.mjs token <raw-file.json> /tmp/<raw-file.json>`
4. Export text styles in a separate call; persist with `node scripts/persist-figma-export.mjs text-styles /tmp/text-styles.json`
5. **Verify on disk** — template stubs are invalid (e.g. ~8 color tokens). Re-export if counts or mode names do not match step 1.
6. `bun run tokens:generate` — confirm log shows this project's modes and counts.

**Phase C — Icons (icon gate):** Only after Phase B passes (or when no design-system URL — then after Phase A). Requires `react-native-nano-icons` installed.
1. `get_metadata` on the icons frame — inventory logical icon names and count **N**.
2. Export SVGs in batches (~20–25 per `use_figma` call); persist each batch immediately:
   `node scripts/persist-figma-export.mjs icons /tmp/icons-batch-N.json`
3. **Verify on disk:** `ls assets/icons/app-icons/*.svg | wc -l` equals **N** (deduplicated logical icons only).
4. Copy `.nanoicons.json.example` → `.nanoicons.json`; run `bunx react-native-nano-icons --path ./assets/icons/app-icons`.

Do not add ad-hoc export scripts (`save-figma-*.mjs`, icon manifests, etc.). Use `scripts/persist-figma-export.mjs` from templates or direct writes to the paths in `templates/FIGMA_EXPORT.md`.

Then continue with feature-specific work and Phase D verification.

---

### Required stack
- **Expo (latest SDK)** — scaffold with `bunx create-expo-app@latest … --template default`; use `bunx expo install` for all Expo / React Native libraries so versions stay aligned with the scaffolded SDK; read docs at https://docs.expo.dev/versions/latest/ (or the version-specific URL matching `expo` in `package.json`) before writing code
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

### Design token pipeline (when Figma design system URL is provided)

Run as **Phase B** only — after scaffold + `bun install`. See `templates/FIGMA_EXPORT.md` **Phase B**.

1. Inspect the Figma file and inventory variable collections: colors, typography, spacing/sizing, radius, shadows, etc. **Not every project has everything** — some have no dark mode, no breakpoint modes, no primitives, or different mode names. Record **expected counts and mode names** before exporting.
2. **Export via Figma MCP `use_figma`** (Plugin API) — **one collection per call**. List collections with `figma.variables.getLocalVariableCollectionsAsync()`, export each collection to the raw JSON schema, and export text styles with `figma.getLocalTextStylesAsync()` in a separate call. **Do not rely on** `get_variable_defs`, `get_design_context`, or variable search alone — they often fail or return empty without a selected layer. **Do not** export all collections in one MCP call (responses truncate).
3. **Persist immediately** after each MCP call into `src/theme/tokens/raw/` using `node scripts/persist-figma-export.mjs token …` or `text-styles …`. Templates ship **format examples only** — replace entirely with this project's exports. Map collections in `scripts/generate-design-tokens.mjs` under `RAW_FILES` when filenames differ.
4. **Adapt the generator per project** (templates ship a sample Figma structure — reconfigure, do not assume every project matches):
   - Set `RAW_FILES`, mode names (`LIGHT_MODE`, `DARK_MODE`, typography/size modes), and breakpoints from **discovered** collection modes — do not assume mode names like `Dark` until the export confirms them
   - Detect which modes exist and fall back gracefully:
     - **No dark mode:** emit `@variant light` only
     - **Typography/size breakpoints:** may be separate `sm` / `md` / `lg`, combined modes, or a single mode — emit responsive Uniwind classes only when modes exist and differ
     - **Missing optional files** (primitives, text styles): skip those outputs
   - Emit only what the project needs — typically semantic colors, spacing, and typography as Uniwind CSS variables
   - Emit Storybook metadata only when Storybook is enabled
5. Wire `src/theme/global.css` to import generated CSS and register Uniwind breakpoints when responsive tokens exist.
6. Run `bun run tokens:generate` and commit generated output. **Token gate:** log must show discovered mode names and full token counts — not stub sample counts.
7. **Never hand-edit** `src/theme/tokens/generated/*` or auto-generated story metadata files.

The template generator (`scripts/generate-design-tokens.mjs`) is a **starting point**, not a fixed spec. Trim or extend it to match this project's Figma file and goals.

If Figma JSON is not available yet, scaffold the theme folder and generator config, stub minimal tokens if needed for CI, and copy `templates/TOKENS.md` to the project root to document what remains. **Do not** claim Phase B is complete while stubs remain.

---

### Icon pipeline (when Figma icons section URL is provided)

Run as **Phase C** only — after Phase A (and Phase B when a design-system URL was provided). See `templates/FIGMA_EXPORT.md` **Phase C**. Requires successful `bun install` including `react-native-nano-icons`.

1. Open the linked section (frame, page, or component set) and inventory every distinct **logical** icon — not every layer variant. Record total count **N**.
2. **Deduplicate before export.** The source section may repeat the same icon at multiple sizes and in light/dark (or other) modes. Export **one SVG per logical icon** only:
   - Treat size variants (16, 20, 24, 32, …) as the same icon — `size` is a prop on `Icon`.
   - Treat light/dark (or filled/tinted) color variants as the same icon — `color` / `colorToken` are props on `Icon`.
   - When variants differ only by size or color, pick a single canonical source (prefer the default/neutral mode and a mid size such as 24px).
   - When variants differ by **shape** (e.g. outline vs solid, chevron-left vs chevron-right), export separate icons with distinct semantic names.
   - Normalize names to kebab-case filenames that match the glyph name (e.g. `home.svg`, `chevron-left.svg`) — never encode size or theme in the filename.
3. Export SVGs into `assets/icons/app-icons/` via **`use_figma`** (`exportAsync({ format: 'SVG' })`) in batches (~20–25 icons per call) — see `templates/FIGMA_EXPORT.md`. **Persist each batch immediately** with `node scripts/persist-figma-export.mjs icons …`. Strip hardcoded `fill` / `stroke` colors where possible so icons tint via the `Icon` component; keep viewBox/geometry intact.
4. **Icon gate:** verify `ls assets/icons/app-icons/*.svg | wc -l` equals inventory **N** before font regeneration.
5. Wire the icon font pipeline from templates:
   - `react-native-nano-icons` Expo config plugin with `inputDir` and `outputDir` both `./assets/icons/app-icons` (`.ttf` + `.glyphmap.json` at runtime via prebuild)
   - **Bootstrap / CI:** copy `assets/icons/app-icons/.nanoicons.json.example` → `.nanoicons.json`, then `bunx react-native-nano-icons --path ./assets/icons/app-icons` to regenerate font/glyphmap before prebuild
   - `Icon` wrapper in `src/components/Icon/` with typed `name`, `size`, and `color` / `colorToken` props
   - `IconFontLoader` in root layout when fonts are required
6. Exclude `assets/icons/**` from Biome/ESLint per templates; add a design-token Storybook grid under `src/stories/design-tokens/Icons.stories.tsx` when Storybook is enabled.
7. After adding or changing SVGs, regenerate the font/glyphmap and verify `Icon` renders a sample set at multiple sizes and color tokens.

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
Merge into the scaffolded `package.json` — see `templates/README.md` **Scripts** for commands. **Required:** `lint`, `lint:fix`, `lint:a11y`, `test`, `test:watch`, `tokens:generate` (when Figma is in scope). **Optional:** `graphql:generate`, Storybook scripts when those capabilities are enabled. Set `"packageManager": "bun@…"`.

---

### Git deliverable
1. **Project root:** if **New project GitHub repo** is provided, clone it locally (or use an existing empty repo checkout). Otherwise, create a new local directory only — **do not** `git init` before `create-expo-app` (see **Project scaffold** step 1).
2. **Scaffold** per **Project scaffold** above (`CI=true bunx create-expo-app@latest . …` when `.git` already exists; otherwise `bunx create-expo-app@latest <APP_NAME> …`), remove template cruft, install packages, adapt bootstrap templates into the project. Ensure `main` is the default branch (`git branch -M main` when needed).
3. **Figma Phase B** (design tokens) and **Phase C** (icons) when URLs are provided — complete each gate before the next phase.
4. Implement per Inputs and remaining sections above.
5. Run and verify (Phase D):
   - `bun install`
   - `bun run tokens:generate` (when applicable)
   - Regenerate icon font/glyphmap (when icon pipeline is in scope)
   - `bun run lint`
   - `bun run test`
   - `npx tsc --noEmit`
6. **Device smoke test (before commit/push, when Argent is available):** confirm Argent is installed (`command -v argent` or `mcp__argent__*` tools present). Project config should already exist from **Project scaffold** step 5 (`argent init`). If yes, run the app on **both iOS and Android devices** (simulator, emulator, or connected hardware) and verify there are no issues before pushing:
   - Boot or use a running iOS simulator and Android emulator (`list-devices` → prefer already-booted targets)
   - Start Metro if needed, then launch the app on each platform (`launch-app` / Expo dev client workflow)
   - Smoke-test the initial shell: app launches without redbox/crash, root layout and placeholder screen(s) render, theme/icons/fonts load if in scope, and basic navigation works when multiple screens exist
   - Use Argent discovery tools (`describe`, `debugger-component-tree`) before interactions — do not guess tap coordinates from screenshots
   - Fix any launch, runtime, or visible UI issues found; re-run lint/tests after fixes
   - If Argent is **not** installed, skip device verification, note that in the summary, and still complete static checks above
7. One initial commit on `main` (or ask if the repo is not empty).
8. **Push (only when New project GitHub repo is provided):** add `origin` if needed, then push to the remote. If no GitHub repo was given, stop after the local commit and report the local path.
9. Reply with: local project path, remote repo URL (if pushed), commit SHA, what was enabled vs omitted, Figma file key (if any), **token gate:** mode names, raw files, and variable counts on disk, **icon gate:** icon count exported (and how duplicates were collapsed, if any), **device verification results on iOS and Android (or that Argent was unavailable)**, and any custom Figma → code mappings.

---

### Constraints
- Start from `bunx create-expo-app@latest … --template default` — do not pin an SDK version (`@sdk-NN`) or skip the official template; do not clone a sample app as the project base. When scaffolding into `.` inside an existing git repo, prefix with `CI=true` so the git-init prompt does not block non-interactive runs
- Install bootstrap dependencies with `bun add` / `bunx expo install` — do not invent version ranges in `package.json`; run each install command separately (see `templates/README.md` **Installing dependencies**); `bun install` must succeed before Figma export, token generation, lint, or commit
- Run Figma **Phase B (tokens)** and **Phase C (icons)** separately — persist each MCP payload to disk before the next call; MCP success in chat is not export complete
- Adapt bootstrap `templates/` into the scaffolded project (merge config, add `src/` modules) — do not bulk-replace Expo-generated `package.json` / `app.json` / `tsconfig.json`, and do not invent parallel architecture from scratch when a template file exists
- Do not add one-off Figma export helper scripts — use `scripts/persist-figma-export.mjs` from templates
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
Run Phase B only (design tokens). One collection per use_figma call; persist immediately; token gate must pass before commit. Light-only or single-breakpoint projects are valid — do not add dark or responsive output the Figma file does not define.
```

**Figma icons only**
```
Run Phase C only (icons) after scaffold + bun install. Export from <FIGMA_ICONS_URL> in batches; persist each batch before the next. Deduplicate size and light/dark variants — one SVG per logical icon; size and color are Icon props. Icon gate: SVG count on disk must match inventory. Document any ambiguous variants (same name, different shape) in the bootstrap summary.
```

**Device verification (Argent)**
```
Install Argent if needed (`npm i -g @swmansion/argent`), run `npx @swmansion/argent init -y` in the project root during scaffold, then boot iOS simulator and Android emulator, launch the app on both, and confirm no crashes/redboxes and the placeholder shell renders correctly. Report devices used and any issues fixed.
```
