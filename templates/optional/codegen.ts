import type { CodegenConfig } from "@graphql-codegen/cli";

const schema = process.env.EXPO_PUBLIC_GRAPHQL_URL?.trim() ?? "https://rickandmortyapi.com/graphql";

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
