# Minimal strip-down

When the user unchecked i18n, GraphQL, and/or Storybook at intake. Copy files from `templates/optional/minimal/` into the new project.

## Omit i18n

- Replace `preferences-store.ts`, tab screens, `AppTabs.tsx` with minimal versions
- Remove `import "@/i18n"` from `_layout.tsx`
- Delete `src/i18n/`; skip `i18next` install

## Omit GraphQL

- Remove `AppApolloProvider` from `_layout.tsx`
- Delete `src/services/graphql/`, `src/providers/`, `codegen.ts`
- Remove `graphql:generate` script; skip GraphQL installs

## Omit Storybook

- Replace `metro.config.js` with minimal version
- Remove Storybook gate from `_layout.tsx`
- Delete `.rnstorybook/`, `src/stories/`, `*.stories.tsx`
- Skip Storybook deps and scripts

## Combinations

All three unchecked → use minimal `_layout.tsx`. Partial → apply relevant sections and compose `_layout.tsx` manually.
