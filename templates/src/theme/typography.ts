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
