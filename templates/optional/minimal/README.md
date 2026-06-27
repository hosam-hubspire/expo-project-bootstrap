# Minimal strip-down

Use when the user **unchecked** i18n, GraphQL, and/or Storybook during intake.

Source files live in the bootstrap repo under `templates/optional/minimal/`. Copy or merge into the **new project** — do not expect `optional/minimal/` to exist in the scaffolded app unless you copied it.

## Omit i18n

1. Replace `src/stores/preferences-store.ts` with the minimal version from `templates/optional/minimal/src/stores/preferences-store.ts`
2. Replace `src/app/(tabs)/index.tsx`, `settings.tsx`, and `src/components/AppTabs/AppTabs.tsx` with minimal versions
3. Remove `import "@/i18n"` from `src/app/_layout.tsx` (keep GraphQL / Storybook wiring if those stay enabled)
4. Delete `src/i18n/`
5. Remove `expo-localization` from `app.json` plugins if nothing else uses it
6. Skip `i18next` / `react-i18next` install

## Omit GraphQL

1. Remove `AppApolloProvider` wrapper and its import from `src/app/_layout.tsx`
2. Delete `src/services/graphql/`, `src/providers/`
3. Delete `codegen.ts` and remove `graphql:generate` from `package.json` scripts
4. Skip GraphQL package installs

## Omit Storybook

1. Replace `metro.config.js` with the minimal version from `templates/optional/minimal/metro.config.js`
2. Remove the Storybook env gate, import, and early return from `src/app/_layout.tsx`
3. Delete `.rnstorybook/`, `src/stories/`, and colocated `*.stories.tsx` under `src/components/`
4. Skip Storybook devDependencies and storybook scripts

## Omit all three

Apply all sections above, then replace `src/app/_layout.tsx` with `templates/optional/minimal/src/app/_layout.tsx`.

## Partial combinations

When only some items are unchecked, apply the relevant sections and **compose** `_layout.tsx` manually — e.g. keep `AppApolloProvider` and Storybook gate but drop the `@/i18n` import.
