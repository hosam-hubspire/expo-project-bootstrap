/**
 * Custom font files loaded with `expo-font` / `useFonts` (root `IconFontLoader` + Storybook).
 *
 * Keys **Regular**, **Medium**, and **Bold** match Uniwind `@theme` `--font-*` utilities
 * (`font-Regular`, …). In React Native, weight must be a separate loaded face —
 * `font-normal` / `font-bold` do not switch custom fonts.
 *
 * Phase B: point values at brand `.ttf`s (or Expo Google Font modules) and keep keys stable.
 * `uniwindFontFamilies` values must equal the native names expo-font registers
 * (usually these same keys when loaded via this map).
 */
export const expoFontSourceMap = {
  // Regular: require("../../assets/fonts/Brand-Regular.ttf"),
  // Medium: require("../../assets/fonts/Brand-Medium.ttf"),
  // Bold: require("../../assets/fonts/Brand-Bold.ttf"),
} as const;

/**
 * Native `fontFamily` strings for Uniwind `--font-*` theme tokens.
 * Stub uses System until Phase B loads custom faces into `expoFontSourceMap`.
 */
export const uniwindFontFamilies = {
  Regular: "System",
  Medium: "System",
  Bold: "System",
} as const;

export type UniwindFontFace = keyof typeof uniwindFontFamilies;
