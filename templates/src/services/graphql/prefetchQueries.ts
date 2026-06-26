import type { ApolloClient, TypedDocumentNode } from "@apollo/client";

import { GalleryCharactersDocument } from "@/services/graphql/generated/graphql";

type PrefetchQueryConfig<TData, TVariables> = {
  query: TypedDocumentNode<TData, TVariables>;
  variables?: TVariables;
};

function prefetchQuery<TData, TVariables>(
  config: PrefetchQueryConfig<TData, TVariables>,
): PrefetchQueryConfig<TData, TVariables> {
  return config;
}

/**
 * Queries prefetched on app startup. Add entries here as the app grows.
 */
export const PREFETCH_QUERIES = [
  prefetchQuery({
    query: GalleryCharactersDocument,
  }),
];

/**
 * Prefetches selected queries on startup. With `cache-first`, reads from the
 * persisted Apollo cache when available and only fetches from the network when missing.
 */
export function prefetchQueries(client: ApolloClient): void {
  void Promise.allSettled(
    PREFETCH_QUERIES.map((entry) =>
      client.query({
        query: entry.query,
        ...("variables" in entry && entry.variables !== undefined
          ? { variables: entry.variables }
          : {}),
        fetchPolicy: "cache-first",
        errorPolicy: "all",
      } as Parameters<ApolloClient["query"]>[0]),
    ),
  );
}
