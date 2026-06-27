/* eslint-disable */
import * as types from "./graphql";
import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";

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

export function graphql(source: string) {
  return (documents as Record<string, DocumentNode>)[source] ?? {};
}
