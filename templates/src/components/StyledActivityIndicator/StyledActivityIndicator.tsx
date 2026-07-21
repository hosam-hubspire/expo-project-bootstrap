import { ActivityIndicator, type ActivityIndicatorProps } from "react-native";

import { useTokenColor } from "@/hooks/use-token-color";
import type { ColorTokenName } from "@/theme";

type StyledActivityIndicatorProps = ActivityIndicatorProps & {
  colorToken?: ColorTokenName;
};

export function StyledActivityIndicator({
  color,
  colorToken = "text-text-default",
  ...props
}: StyledActivityIndicatorProps) {
  const tokenColor = useTokenColor(colorToken);

  return <ActivityIndicator {...props} color={color ?? tokenColor} />;
}
