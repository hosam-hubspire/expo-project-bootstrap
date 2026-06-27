import type { CodegenConfig } from "@graphql-codegen/cli";

const schema = process.env.EXPO_PUBLIC_GRAPHQL_URL?.trim();

if (!schema) {
  throw new Error(
    "Set EXPO_PUBLIC_GRAPHQL_URL before running graphql:generate (see templates/README.md).",
  );
}

const config: CodegenConfig = {
  schema,
  documents: ["src/services/graphql/operations/**/*.graphql"],
  ignoreNoDocuments: true,
  generates: {
    "src/services/graphql/generated/": {
      preset: "client",
      presetConfig: {
        fragmentMasking: false,
      },
    },
  },
};

export default config;
