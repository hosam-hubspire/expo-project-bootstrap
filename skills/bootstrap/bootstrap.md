# Bootstrap workflow

Bootstrap a new Expo React Native app using templates in this repository.

**Intake:** see [SKILL.md](SKILL.md). Do not start until all inputs are confirmed.

**Templates:** https://github.com/hosam-hubspire/expo-project-bootstrap/tree/main/templates

---

## Project scaffold

Always use `bunx create-expo-app@latest … --template default` for the latest SDK.

1. **Create the app** (non-interactive):
   - New folder: `bunx create-expo-app@latest <APP_NAME> --template default` — then `git branch -M main` if needed.
   - Existing `.git`: `CI=true bunx create-expo-app@latest . --template default`.
   - Set `name` / `slug` in `app.json` when they differ from the folder name.
   - **Do not** call `move_agent_to_root` during bootstrap.
2. **Remove default cruft:** demo routes, `components/ui/*`, stock themed helpers, non-Bun lockfiles, web artifacts (`+html.tsx`, `.web.tsx`). Move `app/` → `src/app/`; wire `@/` aliases in `tsconfig.json`.
3. **Install dependencies** — grouped commands with `--verbose` in `templates/README.md`. Run `bun install --verbose` after; exit **0** required before step 4.
4. **Apply templates** — merge, do not bulk-copy over Expo-generated config:
   - **`package.json`:** deps from CLI installs; merge scripts + `"packageManager"` from templates
   - **`app.json`:** merge plugins, experiments, platform settings; set name/slug/scheme
   - **`tsconfig.json`:** extend `expo/tsconfig.base`; merge paths and `strict`
   - **`metro.config.js`:** Uniwind from templates; Storybook overlay from `optional/` when enabled
   - **Lint/test/CI:** adopt `biome.json`, `eslint.config.mjs`, `jest.config.js`, `.github/workflows/ci.yml`
   - **`scripts/`:** `generate-design-tokens.mjs`, `persist-figma-export.mjs`
   - **`src/`, `assets/`:** minimal shell from templates; enable optional blocks per user selection (see `templates/README.md` **Capability merges**)
   - **Figma tokens:** after scaffold + successful install — Phase B when a design-system URL was provided; complete token gate before verify/commit
   - **Icons:** templates include sample SVGs and `react-native-nano-icons` setup. When the user has icon SVGs from Figma, copy them into `assets/icons/` and run `bun run icons:generate`
5. **Argent (device smoke tests):** `npm i -g @swmansion/argent` if missing; `npx @swmansion/argent init -y` in project root. Skip if CLI unavailable.

### Phase gates

| Phase | When | Gate |
|-------|------|------|
| **A — Scaffold** | Always | Templates applied; `bun install` exit 0 |
| **B — Tokens** | Design-system URL | [`FIGMA_EXPORT.md`](../../templates/FIGMA_EXPORT.md) token gate |
| **C — Verify** | Before commit | lint, test, tsc; Argent when available |

---

## Required stack

- **Expo (latest SDK)** — `bunx expo install` for Expo/RN packages
- **expo-router** — `src/app/`, typed routes, `reactCompiler` in `app.json`
- **Uniwind + Tailwind v4** — `src/theme/global.css`, `className` styling, `@variant light/dark` when Figma provides modes
- **Bun** — `bun.lock`, `"packageManager": "bun@…"`
- **Biome** — lint + format (`biome.json` from templates)
- **ESLint** — `eslint-plugin-react-native-a11y` only (`eslint.config.mjs`)
- **Jest** — `jest-expo`, Testing Library, `@/` aliases
- **GitHub Actions CI** — frozen lockfile → lint → test
- **TypeScript** — strict, `@/` paths
- **State** — Zustand + MMKV (`src/lib/mmkv.ts`, `src/stores/`)
- **Icons** — `react-native-nano-icons` with sample SVGs in `assets/icons/`; `Icon` + `IconFontLoader` in templates

---

## Optional capabilities

Enable **only** what the user selected. Files live under `templates/optional/` — see `templates/README.md` for merge steps.

| Capability | What to add |
|------------|-------------|
| **i18n** | `optional/src/i18n/`, replace tab screens + `AppTabs` + `preferences-store`, use `_layout.with-i18n.tsx` |
| **GraphQL** | `optional/src/services/graphql/`, `optional/src/providers/`, `optional/codegen.ts`, `_layout.with-graphql.tsx`; run `bun run graphql:generate` |
| **GraphQL subscriptions** | Set `EXPO_PUBLIC_GRAPHQL_SUBSCRIPTIONS_ENABLED=true`; optional `EXPO_PUBLIC_GRAPHQL_WS_URL` |
| **Storybook** | `optional/.rnstorybook/`, `optional/src/stories/`, colocated `optional/src/components/*/*.stories.tsx`, `metro.config.with-storybook.js`, `_layout.with-storybook.tsx` |
| **Fonts** | `expo-font` when Figma/brand requires; stacks in `global.css` |

**Shortcuts:**

- **Tokens only:** Phase B — [`FIGMA_EXPORT.md`](../../templates/FIGMA_EXPORT.md)
- **Storybook:** confirm tokens render per theme/breakpoint; document non-obvious mappings in `TOKENS.md`

---

## App architecture

```
src/
  app/                    # expo-router — kebab-case routes
  components/             # PascalCase folders + index.ts barrels
  theme/global.css
  theme/tokens/raw|generated/
  stories/design-tokens/  # when Storybook enabled
  hooks/                  # kebab-case
  stores/
  lib/mmkv.ts
  services/graphql/       # when GraphQL enabled
  i18n/                   # when i18n enabled
assets/icons/             # SVGs + generated .ttf / .glyphmap.json
```

- User-facing text through `ThemedText`; layout via Uniwind `className`
- Navigation: `accessibilityRole`, `accessibilityLabel`, `accessibilityHint`
- Generated CSS variables are the source of truth for semantic tokens
- Never hand-edit `src/theme/tokens/generated/*`

**Design tokens:** Phase B only — full steps in [`FIGMA_EXPORT.md`](../../templates/FIGMA_EXPORT.md). If Figma JSON is pending, copy `templates/TOKENS.md` to the project root; do not claim Phase B complete with stubs.

---

## Minimal initial app

Default shell: Home + Settings tabs, theme toggle on Settings, providers in root layout. Do not add sample APIs or domain flows unless requested.

---

## Git deliverable

1. Clone GitHub repo or create local directory (no `git init` before `create-expo-app`).
2. Scaffold, install, apply templates, optional Figma token export (Phase B).
3. Verify (Phase C): `bun install`, `tokens:generate` / `icons:generate` when applicable, `lint`, `test`, `npx tsc --noEmit`.
4. **Argent smoke test** when available: launch on iOS + Android; fix redboxes before push.
5. Initial commit on `main`; push when GitHub repo was provided.
6. Completion summary — see [SKILL.md](SKILL.md).

---

## Constraints

- Latest Expo default template — no SDK pin, no sample-app clone
- Grouped `bun add` / `bunx expo install --verbose` — see `templates/README.md`
- Merge templates into scaffold — do not bulk-replace Expo config
- Figma tokens: `/tmp` + `persist-figma-export.mjs` only — no bridge scripts
- iOS/Android only; Bun only; no secrets in git; no fonts absent from Figma/brand
- CI must pass before push
