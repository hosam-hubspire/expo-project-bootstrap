import { Text, type TextProps } from "react-native";
import type { ColorTokenName, TypographyTokenName } from "@/theme";
import {
  colorClassName,
  isLinkVariant,
  mergeTypographyClassName,
  typographyClassName,
} from "@/theme/typography";

export type ThemedTextProps = TextProps & {
  variant?: TypographyTokenName;
  colorToken?: ColorTokenName;
  className?: string;
  /**
   * When false, omit the variant’s `leading-*` utility so line height is not applied.
   * Default true (full typography recipe).
   */
  withLineHeight?: boolean;
};

export function ThemedText({
  className,
  variant = "global-body-base",
  colorToken,
  withLineHeight = true,
  ...rest
}: ThemedTextProps) {
  const resolvedColorClass =
    isLinkVariant(variant) && colorToken == null
      ? colorClassName("text-text-link")
      : colorClassName(colorToken ?? "text-text-default");

  return (
    <Text
      className={mergeTypographyClassName(
        typographyClassName(variant, { withLineHeight }),
        resolvedColorClass,
        className,
      )}
      {...rest}
    />
  );
}
