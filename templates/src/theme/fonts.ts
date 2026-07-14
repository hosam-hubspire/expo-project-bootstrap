import { Platform } from "react-native";

/**
 * Native font family names for expo-font loading.
 * After Phase B, align keys with Figma families from `fontFamilies` in
 * `src/stories/design-tokens/token-definitions.ts` (via `bun run tokens:sync`).
 */
export const Fonts = Platform.select({
  ios: {},
  android: {},
  default: {},
}) as Record<string, string>;
