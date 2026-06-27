/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";

export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };

export type ExampleQueryQueryVariables = Exact<{ [key: string]: never }>;

/** Replace with project-specific result types after running graphql:generate against your schema. */
export type ExampleQueryQuery = { __typename: string };

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
