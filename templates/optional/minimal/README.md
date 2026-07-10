# Minimal strip-down

When the user unchecked i18n, GraphQL, and/or Storybook at intake. Copy files from `templates/optional/minimal/` into the new project.

Navigation assembly (tabs / drawer / intro / auth) is independent — follow [`navigation/README.md`](../../navigation/README.md). Minimal ships the **default** combo (tabs + intro).

## Omit i18n

- Replace `preferences-store.ts`, tab screens, `AppTabs.tsx` with minimal versions
- Replace onboarding screens with minimal (non-i18n) copies under `(onboarding)/`
- Remove `import "@/i18n"` from `_layout.tsx`
- Delete `src/i18n/`; skip `i18next` install
- If GraphQL remains on: keep or re-add `<GraphQLExamples />` on Home with English labels (default i18n Home includes it)

## Omit GraphQL

- Remove `AppApolloProvider` from `_layout.tsx` (keep `SessionProvider` at the root if auth is on)
- Delete `src/services/graphql/`, `src/providers/apollo-provider.tsx`, `codegen.ts`, `src/components/GraphQLExamples/`
- Remove `<GraphQLExamples />` from Home (tabs + flat screens)
- Remove `graphql:generate` script; skip GraphQL installs
- Keep `SessionProvider` if Protected routes were enabled (lives under `providers/session-provider.tsx`); keep `src/constants/session.ts` for the SecureStore key
- Note: with GraphQL omitted there is no Apollo auth link — session is still persisted via SecureStore for route guards

When GraphQL is on but **subscriptions are off**: keep mutation/query examples; subscription UI stays hidden unless `EXPO_PUBLIC_GRAPHQL_SUBSCRIPTIONS_ENABLED=true`. Optionally delete `operations/exampleSubscription.graphql` and trim generated stubs.

## Omit Storybook

- Replace `metro.config.js` with minimal version
- Remove Storybook gate from `_layout.tsx`
- Delete `.rnstorybook/`, `src/stories/`, `*.stories.tsx`
- Skip Storybook deps and scripts

## Combinations

All three unchecked → use minimal `_layout.tsx`. Partial → apply relevant sections and compose `_layout.tsx` manually.
