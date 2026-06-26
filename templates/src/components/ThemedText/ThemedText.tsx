import { Text, type TextProps } from "react-native";
import type { ColorTokenName, TypographyTokenName } from "@/theme";
import { colorClassName, isLinkVariant, typographyClassName } from "@/theme/typography";

export type ThemedTextProps = TextProps & {
  variant?: TypographyTokenName;
  colorToken?: ColorTokenName;
  className?: string;
};

export function ThemedText({
  className,
  variant = "global-body-base",
  colorToken,
  ...rest
}: ThemedTextProps) {
  const resolvedColorClass =
    isLinkVariant(variant) && colorToken == null
      ? colorClassName("text-text-link")
      : colorClassName(colorToken ?? "text-text-default");

  return (
    <Text
      className={[typographyClassName(variant), resolvedColorClass, className]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    />
  );
}
