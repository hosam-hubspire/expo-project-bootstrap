# REST (axios) assembly

Intake **API client = REST**. Mutually exclusive with GraphQL.

1. **Install** — `bun add axios@latest` (`expo-secure-store` is already in Core via `secureStorage`)
2. **Copy** — `src/services/rest/`, `src/components/RestExamples/`
3. **Skip** — GraphQL services/provider/examples, `codegen.ts`, GraphQL installs/scripts
4. **Layout** — [`src/app/_layout.tsx`](./src/app/_layout.tsx). Auth on → `SessionProvider` (no Apollo)
5. **Home** — tabs: [`(app)/(tabs)/index.tsx`](./src/app/(app)/(tabs)/index.tsx). Flat: [`screens/index.tsx`](./screens/index.tsx) → `(app)/index.tsx`
6. **Env** — `EXPO_PUBLIC_API_URL=https://jsonplaceholder.typicode.com` (demo: `GET /todos/1`)
7. **i18n off** — English props on `<RestExamples />`

Axios interceptor reads `SESSION_STORAGE_KEY` from `secureStorage` — not React context.
