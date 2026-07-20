# Minimal strip-down

When i18n / Storybook unchecked, or API is **none** (REST → [`optional/rest`](../rest/README.md)). Nav is independent — [`navigation/README.md`](../../navigation/README.md). Minimal ships tabs + intro.

**Keep analytics / toast / storage / secure-storage adapters** — always included; do not strip `src/services/{analytics,toast,storage,secure-storage}`, `<AnalyticsScreenTracker />`, or `<AppToast />`.

## Omit i18n

- Replace `preferences-store`, tab screens, `AppTabs`, onboarding with minimal copies
- Remove `import "@/i18n"`; delete `src/i18n/`; skip `i18next`
- Keep GraphQL/REST examples on Home with English labels if API remains

## Omit GraphQL / API none

- Remove `AppApolloProvider`, GraphQL services/provider/examples, `codegen.ts`, `graphql:generate`, GraphQL installs
- Keep `SessionProvider` if auth on; keep `session.ts` if auth on **or** GraphQL/REST remains

## API REST

Use [`optional/rest`](../rest/README.md) — do not only strip GraphQL and leave GraphQL Home.

## Omit Storybook

- Point `"main"` back to `expo-router/entry` (or omit root `index.js`); minimal `metro.config.js`; delete `.rnstorybook/`, `src/stories/`, `*.stories.tsx`; skip Storybook deps/scripts

## Combinations

All three off → minimal `_layout.tsx`. Partial → compose manually. REST + add-ons → rest layout (no Apollo).
