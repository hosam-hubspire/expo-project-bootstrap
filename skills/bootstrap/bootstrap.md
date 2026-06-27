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
   - Set `name` / `slug` / `scheme` in `app.json` from intake (template uses `my-app` placeholders).
   - **Do not** call `move_agent_to_root` during bootstrap.
2. **Remove default cruft:** demo routes, `components/ui/*`, stock themed helpers, non-Bun lockfiles, web artifacts (`+html.tsx`, `.web.tsx`). Move `app/` → `src/app/`; wire `@/` aliases in `tsconfig.json`.
3. **Install dependencies** — grouped commands with `--verbose` in `templates/README.md`. Install **core + default stack** groups unless the user unchecked i18n, GraphQL, or Storybook at intake. Run `bun install --verbose` after; exit **0** required before step 4.
4. **Apply templates** — merge, do not bulk-copy over Expo-generated config:
   - Full template includes i18n, GraphQL, Storybook, `.rnstorybook/`, `codegen.ts`, design-token stories, and colocated component stories
   - **`package.json`:** deps from CLI installs; merge scripts + `"packageManager"` from templates
   - **`app.json`:** merge plugins, experiments, platform settings; set name/slug/scheme
   - **`tsconfig.json`:** extend `expo/tsconfig.base`; merge paths and `strict`
   - **`metro.config.js`:** Uniwind + Storybook from templates
   - **Lint/test/CI:** adopt `biome.json`, `eslint.config.mjs`, `jest.config.js`, `.github/workflows/ci.yml`
   - **`scripts/`:** `generate-design-tokens.mjs`, `persist-figma-export.mjs`
   - **`src/`, `assets/`:** full app shell from templates (includes committed `src/services/graphql/generated/` — run `bun run graphql:generate` only when operations change)
   - **Strip down** when user unchecked stack toggles — [`optional/minimal/README.md`](../../templates/optional/minimal/README.md)
   - **Figma tokens:** Phase B when a design-system URL was provided
   - **Icons:** sample SVGs included; replace from Figma + `bunx expo prebuild` when needed
5. **Argent:** `bun install -g @swmansion/argent` if missing; `bunx @swmansion/argent init -y` in project root. Skip if CLI unavailable.

### Phase gates

| Phase | When | Gate |
|-------|------|------|
| **A — Scaffold** | Always | Templates applied; `bun install` exit 0 |
| **B — Tokens** | Design-system URL | [`FIGMA_EXPORT.md`](../../templates/FIGMA_EXPORT.md) token gate |
| **C — Verify** | Before commit | lint, test, tsc; Argent when available |

---

## Default stack

Templates ship with all of the below. User can **uncheck** any item during intake — then strip per [`templates/optional/minimal/README.md`](../../templates/optional/minimal/README.md).

- **Expo (latest SDK)** — `bunx expo install` for Expo/RN packages
- **expo-router** — `src/app/`, typed routes, `reactCompiler` in `app.json`
- **Uniwind + Tailwind v4** — `src/theme/global.css`, `className` styling
- **Bun** — `bun.lock`, `"packageManager": "bun@…"`
- **Biome + ESLint a11y + Jest + GitHub Actions CI**
- **TypeScript** — strict, `@/` paths
- **State** — Zustand + MMKV
- **Icons** — `react-native-nano-icons`, sample SVGs, `Icon` + `IconFontLoader`
- **i18n** — `i18next`, `expo-localization`, EN/ES shell, language toggle on Settings
- **GraphQL** — Apollo Client v4, codegen, placeholder `ExampleQuery` operation, cache persist + prefetch; requires `EXPO_PUBLIC_GRAPHQL_URL`
- **Storybook** — on-device, design-token stories, colocated component stories

**GraphQL subscriptions:** off by default — set `EXPO_PUBLIC_GRAPHQL_SUBSCRIPTIONS_ENABLED=true` only when selected at intake.

**Fonts:** stub tokens use system stacks with a generic `"System"` placeholder family until Phase B. After export, install and load font packages that match **exported Figma family names** — typography classes reference `--font-family-*` CSS variables, not `font-sans` / `font-mono`. See `templates/README.md` **Project fonts**.

---

## App architecture

```
src/
  app/
  components/
  theme/
  stories/design-tokens/
  i18n/
  services/graphql/
  providers/
  stores/
  lib/mmkv.ts
.rnstorybook/
assets/icons/
```

- User-facing text through `ThemedText` (i18n via `react-i18next` when enabled)
- Generated CSS variables are the source of truth for semantic tokens
- Never hand-edit `src/theme/tokens/generated/*`

**Design tokens:** Phase B — [`FIGMA_EXPORT.md`](../../templates/FIGMA_EXPORT.md).

---

## Initial app

Home + Settings tabs, theme and language toggles on Settings, Apollo provider, Storybook env gate in root layout. Replace the placeholder `ExampleQuery` GraphQL operation with project queries when ready. Set `EXPO_PUBLIC_GRAPHQL_URL` for GraphQL at runtime.

---

## Git deliverable

1. Clone GitHub repo or create local directory.
2. Scaffold, install, apply templates, strip unchecked stack items; run Phase B when a Figma design-system URL was provided.
3. Verify: `bun install`, `tokens:generate` when applicable, `lint`, `test`, `bunx tsc --noEmit`.
4. Argent smoke test when available.
5. Commit on `main`; push when GitHub repo provided.
6. Completion summary — see [SKILL.md](SKILL.md).

---

## Constraints

- Latest Expo default template; grouped `bun add` / `bunx expo install --verbose`
- Merge templates into scaffold — do not bulk-replace Expo config
- Figma tokens: `/tmp` + `persist-figma-export.mjs` only
- iOS/Android only; Bun only; CI must pass before push
