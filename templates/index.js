/**
 * App entry. When Storybook is on, skip expo-router entirely so native-only
 * app modules (MMKV / NitroModules, bottom sheet, Apollo persistence, etc.)
 * are never evaluated — Storybook can run in Expo Go.
 */
if (process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === "true") {
  const { registerRootComponent } = require("expo");
  const StorybookUIRoot = require("./.rnstorybook").default;
  registerRootComponent(StorybookUIRoot);
} else {
  require("expo-router/entry");
}
