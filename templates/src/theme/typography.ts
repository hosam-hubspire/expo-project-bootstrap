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

export function typographyClassName(variant: TypographyTokenName): string {
  return typographyClassNames[variant];
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
