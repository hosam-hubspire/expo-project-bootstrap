/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";

export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };

export type ExampleQueryQueryVariables = Exact<{ [key: string]: never }>;

/** Rick and Morty placeholder — regenerate against your schema with graphql:generate. */
export type ExampleQueryQuery = {
  character?: {
    id?: string | null;
    name?: string | null;
    status?: string | null;
    species?: string | null;
  } | null;
};

export const ExampleQueryDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "ExampleQuery" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "character" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: { kind: "IntValue", value: "1" },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "status" } },
                { kind: "Field", name: { kind: "Name", value: "species" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ExampleQueryQuery, ExampleQueryQueryVariables>;
