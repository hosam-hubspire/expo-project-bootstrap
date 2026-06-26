import { View, type ViewProps } from "react-native";

import type { ColorTokenName } from "@/theme";

export type ThemedViewProps = ViewProps & {
  colorToken?: ColorTokenName;
  className?: string;
};

export function ThemedView({ className, colorToken, ...otherProps }: ThemedViewProps) {
  const backgroundClass = `bg-${colorToken ?? "surface-default"}`;

  return (
    <View className={[backgroundClass, className].filter(Boolean).join(" ")} {...otherProps} />
  );
}
