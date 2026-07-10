/* eslint-disable */
import * as types from "./graphql";

/**
 * Map of all GraphQL operations in the project.
 *
 * Regenerate with `EXPO_PUBLIC_GRAPHQL_URL=<your-endpoint> bun run graphql:generate`.
 * Against the countries.dev placeholder, only ExampleQuery validates — point at your
 * schema (or temporarily exclude mutation/subscription documents) before generating.
 */
type Documents = {
  "query ExampleQuery {\n  __typename\n}": typeof types.ExampleQueryDocument;
  "mutation ExampleMutation {\n  __typename\n}": typeof types.ExampleMutationDocument;
  "subscription ExampleSubscription {\n  __typename\n}": typeof types.ExampleSubscriptionDocument;
};
const documents: Documents = {
  "query ExampleQuery {\n  __typename\n}": types.ExampleQueryDocument,
  "mutation ExampleMutation {\n  __typename\n}": types.ExampleMutationDocument,
  "subscription ExampleSubscription {\n  __typename\n}": types.ExampleSubscriptionDocument,
};

export function graphql(source: string): unknown;

export function graphql(
  source: "query ExampleQuery {\n  __typename\n}",
): (typeof documents)["query ExampleQuery {\n  __typename\n}"];
export function graphql(
  source: "mutation ExampleMutation {\n  __typename\n}",
): (typeof documents)["mutation ExampleMutation {\n  __typename\n}"];
export function graphql(
  source: "subscription ExampleSubscription {\n  __typename\n}",
): (typeof documents)["subscription ExampleSubscription {\n  __typename\n}"];

export function graphql(source: string): unknown {
  return (documents as unknown as Record<string, unknown>)[source];
}
