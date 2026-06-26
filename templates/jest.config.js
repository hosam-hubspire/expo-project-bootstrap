/** @type {import('jest').Config} */
module.exports = {
  preset: "jest-expo",
  testMatch: ["**/*.{test,spec}.{ts,tsx}"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@/assets/(.*)$": "<rootDir>/assets/$1",
  },
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg|uniwind|tailwindcss)",
  ],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/theme/tokens/generated/**",
    "!src/services/graphql/generated/**",
    "!src/**/*.stories.tsx",
    "!src/stories/**",
  ],
};
