import type { ColorTokenName } from "@/theme/tokens/generated/colors";
import type { TypographyTokenName } from "@/theme/tokens/generated/typography-classes";
import { typographyClassNames } from "@/theme/tokens/generated/typography-classes";

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
