# REST (axios) assembly

Use when intake **API client** is **REST**. Mutually exclusive with GraphQL — do not ship both Apollo and axios stacks.

Default `templates/src/app/` is GraphQL. For REST:

1. **Install** — `bun add --verbose axios@latest` and `bunx expo install expo-secure-store` (Bearer interceptor uses SecureStore even when auth routes are off).
2. **Copy** — `templates/src/services/rest/` → `src/services/rest/`; `templates/src/components/RestExamples/` → `src/components/RestExamples/`.
3. **Do not copy** GraphQL — skip `src/services/graphql/`, `src/providers/apollo-provider.tsx`, `src/components/GraphQLExamples/`, `codegen.ts`, GraphQL installs/scripts.
4. **Root layout** — copy [`src/app/_layout.tsx`](./src/app/_layout.tsx) (no `AppApolloProvider`). When auth is on, nest `SessionProvider` inside `GestureHandlerRootView` (same as GraphQL-off + auth in [`optional/minimal`](../minimal/README.md)).
5. **Home** — tabs: copy [`src/app/(app)/(tabs)/index.tsx`](./src/app/(app)/(tabs)/index.tsx). Flat (tabs off): copy [`screens/index.tsx`](./screens/index.tsx) → `(app)/index.tsx`.
6. **Env** — `.env` / `.env.example`:

```bash
EXPO_PUBLIC_API_URL=https://jsonplaceholder.typicode.com
```

Dev demo: `GET /todos/1` via `fetchExampleTodo`. Replace with your base URL and endpoints under `src/services/rest/`.

7. **i18n** — default locales already include `home.rest*` keys. If i18n is off, use English string props on `<RestExamples />` (same pattern as GraphQL on minimal Home).

**Auth:** axios request interceptor reads `SESSION_STORAGE_KEY` from SecureStore — do not wire the client to React session context.
