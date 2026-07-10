import type { ReactNode } from "react";
import { ScrollView, View, type ViewProps } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedView } from "@/components/ThemedView";
import type { ColorTokenName } from "@/theme";

export type SafeAreaEdge = "top" | "right" | "bottom" | "left";

export type ScreenProps = ViewProps & {
  children: ReactNode;
  /** Extra content pinned below the main area (e.g. primary CTA). Inherits horizontal + bottom insets. */
  footer?: ReactNode;
  /** Which edges receive inset padding. Default: all four. Tab screens usually omit `bottom`. */
  edges?: SafeAreaEdge[];
  /** Background token for the outer shell. */
  colorToken?: ColorTokenName;
  /** Uniwind classes for the padded content column. */
  contentClassName?: string;
  /** Wrap children in a ScrollView. */
  scroll?: boolean;
};

const DEFAULT_EDGES: SafeAreaEdge[] = ["top", "right", "bottom", "left"];

/**
 * Screen shell using [`useSafeAreaInsets`](https://docs.expo.dev/versions/latest/sdk/safe-area-context/#usesafeareainsets).
 * Insets go on `style` so Uniwind `className` padding on the content column is not overwritten.
 */
export function Screen({
  children,
  footer,
  edges = DEFAULT_EDGES,
  colorToken = "surface-default",
  className,
  contentClassName,
  scroll = false,
  style,
  ...rest
}: ScreenProps) {
  const insets = useSafeAreaInsets();
  const edgeSet = new Set(edges);

  const insetStyle = {
    paddingTop: edgeSet.has("top") ? insets.top : 0,
    paddingRight: edgeSet.has("right") ? insets.right : 0,
    paddingBottom: edgeSet.has("bottom") ? insets.bottom : 0,
    paddingLeft: edgeSet.has("left") ? insets.left : 0,
  };

  const body = scroll ? (
    <ScrollView
      className="flex-1"
      contentContainerClassName={["flex-grow", contentClassName].filter(Boolean).join(" ")}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View className={["flex-1", contentClassName].filter(Boolean).join(" ")}>{children}</View>
  );

  return (
    <ThemedView className={["flex-1", className].filter(Boolean).join(" ")} colorToken={colorToken}>
      <View className="flex-1" style={[insetStyle, style]} {...rest}>
        {body}
        {footer != null ? <View className="px-lg pb-base pt-sm">{footer}</View> : null}
      </View>
    </ThemedView>
  );
}
