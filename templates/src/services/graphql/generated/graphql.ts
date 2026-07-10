/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";

export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };

export type ExampleQueryQueryVariables = Exact<{ [key: string]: never }>;

/** Replace with project-specific result types after running graphql:generate against your schema. */
export type ExampleQueryQuery = { __typename: string };

export type ExampleMutationMutationVariables = Exact<{ [key: string]: never }>;

export type ExampleMutationMutation = { __typename: string };

export type ExampleSubscriptionSubscriptionVariables = Exact<{ [key: string]: never }>;

export type ExampleSubscriptionSubscription = { __typename: string };

export const ExampleQueryDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "ExampleQuery" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [{ kind: "Field", name: { kind: "Name", value: "__typename" } }],
      },
    },
  ],
} as unknown as DocumentNode<ExampleQueryQuery, ExampleQueryQueryVariables>;

export const ExampleMutationDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "ExampleMutation" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [{ kind: "Field", name: { kind: "Name", value: "__typename" } }],
      },
    },
  ],
} as unknown as DocumentNode<ExampleMutationMutation, ExampleMutationMutationVariables>;

export const ExampleSubscriptionDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "subscription",
      name: { kind: "Name", value: "ExampleSubscription" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [{ kind: "Field", name: { kind: "Name", value: "__typename" } }],
      },
    },
  ],
} as unknown as DocumentNode<
  ExampleSubscriptionSubscription,
  ExampleSubscriptionSubscriptionVariables
>;
