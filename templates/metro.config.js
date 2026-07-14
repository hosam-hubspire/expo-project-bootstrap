const { getDefaultConfig } = require("expo/metro-config");
const { withStorybook } = require("@storybook/react-native/metro/withStorybook");
const { withUniwindConfig } = require("uniwind/metro");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

const storybookConfig = withStorybook(config, {
  enabled: process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === "true",
  configPath: "./.rnstorybook",
});

// Uniwind must be the outermost Metro wrapper (https://docs.uniwind.dev/quickstart).
module.exports = withUniwindConfig(storybookConfig, {
  // CSS entry under src/ so Tailwind auto-scans all app classNames (not nested in theme/).
  cssEntryFile: "./src/global.css",
  dtsFile: "./src/uniwind-types.d.ts",
  extraThemes: [],
});
