/* eslint-disable */
import * as types from "./graphql";

/**
 * Map of all GraphQL operations in the project.
 *
 * Regenerate with `EXPO_PUBLIC_GRAPHQL_URL=<your-endpoint> bun run graphql:generate`.
 */
type Documents = {
  "query ExampleQuery {\n  __typename\n}": typeof types.ExampleQueryDocument;
};
const documents: Documents = {
  "query ExampleQuery {\n  __typename\n}": types.ExampleQueryDocument,
};

export function graphql(source: string): unknown;

export function graphql(
  source: "query ExampleQuery {\n  __typename\n}",
): (typeof documents)["query ExampleQuery {\n  __typename\n}"];

export function graphql(source: string): unknown {
  return (documents as unknown as Record<string, unknown>)[source];
}
