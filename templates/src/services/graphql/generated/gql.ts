/* eslint-disable */
import * as types from "./graphql";

/**
 * Map of all GraphQL operations in the project.
 *
 * Regenerate with `EXPO_PUBLIC_GRAPHQL_URL=<your-endpoint> bun run graphql:generate`.
 */
type Documents = {
  "query ExampleQuery {\n  character(id: 1) {\n    id\n    name\n    status\n    species\n  }\n}": typeof types.ExampleQueryDocument;
};
const documents: Documents = {
  "query ExampleQuery {\n  character(id: 1) {\n    id\n    name\n    status\n    species\n  }\n}":
    types.ExampleQueryDocument,
};

export function graphql(source: string): unknown;

export function graphql(
  source: "query ExampleQuery {\n  character(id: 1) {\n    id\n    name\n    status\n    species\n  }\n}",
): (typeof documents)["query ExampleQuery {\n  character(id: 1) {\n    id\n    name\n    status\n    species\n  }\n}"];

export function graphql(source: string): unknown {
  return (documents as unknown as Record<string, unknown>)[source];
}
