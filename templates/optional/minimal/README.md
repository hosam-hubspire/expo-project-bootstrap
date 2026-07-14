# Minimal strip-down

When i18n / Storybook unchecked, or API is **none** (REST → [`optional/rest`](../rest/README.md)). Nav is independent — [`navigation/README.md`](../../navigation/README.md). Minimal ships tabs + intro.

## Omit i18n

- Replace `preferences-store`, tab screens, `AppTabs`, onboarding with minimal copies
- Remove `import "@/i18n"`; delete `src/i18n/`; skip `i18next`
- Keep GraphQL/REST examples on Home with English labels if API remains

## Omit GraphQL / API none

- Remove `AppApolloProvider`, GraphQL services/provider/examples, `codegen.ts`, `graphql:generate`, GraphQL installs
- Keep `SessionProvider` + `session.ts` if auth on

## API REST

Use [`optional/rest`](../rest/README.md) — do not only strip GraphQL and leave GraphQL Home.

## Omit Storybook

- Minimal `metro.config.js`; remove Storybook gate from `_layout`; delete `.rnstorybook/`, `src/stories/`, `*.stories.tsx`; skip Storybook deps/scripts

## Combinations

All three off → minimal `_layout.tsx`. Partial → compose manually. REST + stack → rest layout (no Apollo).
