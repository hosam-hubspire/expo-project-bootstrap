import reactNativeA11y from "eslint-plugin-react-native-a11y";
import tseslint from "typescript-eslint";

/** React Native accessibility rules only — formatting and general lint stay in Biome. */
export default tseslint.config(
  {
    ignores: [
      "**/.expo/**",
      "**/android/**",
      "**/ios/**",
      "**/coverage/**",
      "**/dist/**",
      "**/web-build/**",
      "**/node_modules/**",
      "**/src/theme/tokens/generated/**",
      "**/src/services/graphql/generated/**",
      "**/src/stories/design-tokens/token-definitions.ts",
      "**/assets/icons/**",
      "**/assets/expo.icon/**",
      "**/.rnstorybook/storybook.requires.ts",
    ],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "react-native-a11y": reactNativeA11y,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        __DEV__: "readonly",
      },
    },
    rules: {
      ...reactNativeA11y.configs.all.rules,
    },
  },
);
