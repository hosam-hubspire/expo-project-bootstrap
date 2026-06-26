import { ActivityIndicator, type ActivityIndicatorProps } from "react-native";
import { withUniwind } from "uniwind";

import type { ColorTokenName } from "@/theme";
import { accentColorClassName } from "@/theme/typography";

const UniwindActivityIndicator = withUniwind(ActivityIndicator);

type StyledActivityIndicatorProps = ActivityIndicatorProps & {
  colorToken?: ColorTokenName;
};

export function StyledActivityIndicator({
  color,
  colorToken = "text-text-default",
  ...props
}: StyledActivityIndicatorProps) {
  if (color != null) {
    return <ActivityIndicator {...props} color={color} />;
  }

  return <UniwindActivityIndicator {...props} colorClassName={accentColorClassName(colorToken)} />;
}
