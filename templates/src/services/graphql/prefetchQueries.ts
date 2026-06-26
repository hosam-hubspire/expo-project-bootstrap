import type { ApolloClient } from "@apollo/client";

/** Queries prefetched on app startup. Add typed entries here as the app grows. */
export const PREFETCH_QUERIES: [] = [];

/** Prefetches selected queries on startup when PREFETCH_QUERIES is non-empty. */
export function prefetchQueries(_client: ApolloClient): void {
  // Intentionally empty for bootstrap shell — extend when GraphQL operations exist.
}
