# Minimal strip-down

When the user unchecked i18n, GraphQL, and/or Storybook at intake. Copy files from `templates/optional/minimal/` into the new project.

Navigation assembly (tabs / drawer / intro / auth) is independent — follow [`navigation/README.md`](../../navigation/README.md). Minimal ships the **default** combo (tabs + intro).

## Omit i18n

- Replace `preferences-store.ts`, tab screens, `AppTabs.tsx` with minimal versions
- Replace onboarding screens with minimal (non-i18n) copies under `(onboarding)/`
- Remove `import "@/i18n"` from `_layout.tsx`
- Delete `src/i18n/`; skip `i18next` install

## Omit GraphQL

- Remove `AppApolloProvider` from `_layout.tsx` (keep `SessionProvider` at the root if auth is on)
- Delete `src/services/graphql/`, `src/providers/apollo-provider.tsx`, `codegen.ts`
- Remove `graphql:generate` script; skip GraphQL installs
- Keep `SessionProvider` if Protected routes were enabled (lives under `providers/session-provider.tsx`); keep `src/constants/session.ts` for the SecureStore key
- Note: with GraphQL omitted there is no Apollo auth link — session is still persisted via SecureStore for route guards

## Omit Storybook

- Replace `metro.config.js` with minimal version
- Remove Storybook gate from `_layout.tsx`
- Delete `.rnstorybook/`, `src/stories/`, `*.stories.tsx`
- Skip Storybook deps and scripts

## Combinations

All three unchecked → use minimal `_layout.tsx`. Partial → apply relevant sections and compose `_layout.tsx` manually.
