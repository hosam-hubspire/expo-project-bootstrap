import { extendTailwindMerge } from "tailwind-merge";

import type { ColorTokenName } from "@/theme/tokens/generated/colors";
import type { TypographyTokenName } from "@/theme/tokens/generated/typography-classes";
import { typographyClassNames } from "@/theme/tokens/generated/typography-classes";
import {
  typographyFontFaces,
  typographyFontSizes,
  typographyLineHeights,
} from "@/theme/tokens/generated/typography-primitives";

/**
 * Custom font files for `expo-font` / `useFonts` (root `IconFontLoader` + Storybook).
 *
 * Keys **Regular**, **Medium**, and **Bold** must match Uniwind `@theme` `--font-*`
 * utilities (`font-Regular`, …) in `typography-primitives.css`. In React Native,
 * weight must be a separate loaded face — `font-normal` / `font-bold` do not switch
 * custom fonts.
 *
 * Phase B: point values at brand `.ttf`s (or Expo Google Font modules) and keep keys
 * stable. When present, `--font-*` values should equal the native names expo-font
 * registers (usually these same keys).
 */
export const expoFontSourceMap = {
  // Regular: require("../../assets/fonts/Brand-Regular.ttf"),
  // Medium: require("../../assets/fonts/Brand-Medium.ttf"),
  // Bold: require("../../assets/fonts/Brand-Bold.ttf"),
} as const;

export type ExpoFontFace = keyof typeof expoFontSourceMap;

/**
 * Merges typography + ad hoc classNames so custom `text-size-*`, `leading-*`, and
 * `font-Regular|Medium|Bold` replace earlier conflicting utilities.
 */
export const typographyTwMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: Object.keys(typographyFontSizes),
        },
      ],
      leading: [
        {
          leading: Object.keys(typographyLineHeights),
        },
      ],
      "font-family": [
        {
          font: Object.keys(typographyFontFaces),
        },
      ],
    },
  },
});

export function isLinkVariant(variant: TypographyTokenName): boolean {
  return variant.includes("underlined-links");
}

export type TypographyClassNameOptions = {
  /** When false, omit `leading-*` from the variant recipe. Default true. */
  withLineHeight?: boolean;
};

function stripLeadingUtilities(className: string): string {
  return className
    .split(/\s+/)
    .filter((token) => token.length > 0 && !/(?:^|:)leading-/.test(token))
    .join(" ");
}

/**
 * Variant recipe from generated tokens. Pass `{ withLineHeight: false }` to drop leading.
 */
export function typographyClassName(
  variant: TypographyTokenName,
  options?: TypographyClassNameOptions,
): string {
  const base = typographyClassNames[variant];
  if (options?.withLineHeight === false) {
    return stripLeadingUtilities(base);
  }
  return base;
}

export function colorClassName(colorToken: ColorTokenName): string {
  return `text-${colorToken}`;
}

/** For `colorClassName` props on withUniwind-wrapped components (ActivityIndicator, Icon, etc.) */
export function accentColorClassName(colorToken: ColorTokenName): string {
  return `accent-${colorToken}`;
}

export function bgClassName(colorToken: ColorTokenName): string {
  return `bg-${colorToken}`;
}

/** Prefer this over string-join when composing ThemedText / variant + overrides. */
export function mergeTypographyClassName(
  ...classes: Array<string | undefined | null | false>
): string {
  return typographyTwMerge(...classes.filter((c): c is string => Boolean(c)));
}
