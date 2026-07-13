# Minimal strip-down

When the user unchecked i18n and/or Storybook, or set **API client** to **none** (or REST — see [`optional/rest`](../rest/README.md)). Copy files from `templates/optional/minimal/` into the new project as needed.

Navigation assembly (tabs / drawer / intro / auth) is independent — follow [`navigation/README.md`](../../navigation/README.md). Minimal ships the **default** combo (tabs + intro).

## Omit i18n

- Replace `preferences-store.ts`, tab screens, `AppTabs.tsx` with minimal versions
- Replace onboarding screens with minimal (non-i18n) copies under `(onboarding)/`
- Remove `import "@/i18n"` from `_layout.tsx`
- Delete `src/i18n/`; skip `i18next` install
- If GraphQL remains: keep or re-add `<GraphQLExamples />` on Home with English labels
- If REST remains: keep or re-add `<RestExamples />` on Home with English labels

## Omit GraphQL / API none

- Remove `AppApolloProvider` from `_layout.tsx` (keep `SessionProvider` at the root if auth is on)
- Delete `src/services/graphql/`, `src/providers/apollo-provider.tsx`, `codegen.ts`, `src/components/GraphQLExamples/`
- Remove `<GraphQLExamples />` from Home (tabs + flat screens)
- Remove `graphql:generate` script; skip GraphQL installs
- Keep `SessionProvider` if Protected routes were enabled; keep `src/constants/session.ts` for the SecureStore key
- Note: with GraphQL omitted there is no Apollo auth link — session is still persisted via SecureStore for route guards

When GraphQL is on but **subscriptions are off**: query example still works; WS stays disabled unless `EXPO_PUBLIC_GRAPHQL_SUBSCRIPTIONS_ENABLED=true`.

## API client REST

Do **not** use this minimal GraphQL-omit alone and leave default GraphQL Home. Follow [`optional/rest/README.md`](../rest/README.md): copy REST client + RestExamples, REST `_layout`/Home, skip GraphQL entirely.

## Omit Storybook

- Replace `metro.config.js` with minimal version
- Remove Storybook gate from `_layout.tsx`
- Delete `.rnstorybook/`, `src/stories/`, `*.stories.tsx`
- Skip Storybook deps and scripts

## Combinations

i18n + Storybook + API none unchecked → use minimal `_layout.tsx`. Partial → apply relevant sections and compose `_layout.tsx` manually. REST + Storybook + i18n → `optional/rest` layout (no Apollo).
