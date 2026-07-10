import { Pressable, View } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { toast } from "@/utils/toast";

type ToastExamplesProps = {
  title: string;
  description: string;
  successLabel: string;
  errorLabel: string;
  infoLabel: string;
};

export function ToastExamples({
  title,
  description,
  successLabel,
  errorLabel,
  infoLabel,
}: ToastExamplesProps) {
  return (
    <ThemedView colorToken="surface-secondary" className="gap-sm rounded-panel p-base">
      <View className="gap-2xs">
        <ThemedText variant="global-body-small-bold">{title}</ThemedText>
        <ThemedText variant="global-body-small" colorToken="text-text-secondary">
          {description}
        </ThemedText>
      </View>
      <View className="flex-row flex-wrap gap-xs">
        <Pressable
          onPress={() => toast.success(successLabel)}
          className="min-h-10 flex-1 items-center justify-center rounded-input border border-stroke-default bg-surface-default px-sm py-xs active:opacity-80"
          accessibilityRole="button"
        >
          <ThemedText variant="global-body-small-bold">{successLabel}</ThemedText>
        </Pressable>
        <Pressable
          onPress={() => toast.error(errorLabel)}
          className="min-h-10 flex-1 items-center justify-center rounded-input border border-stroke-default bg-surface-default px-sm py-xs active:opacity-80"
          accessibilityRole="button"
        >
          <ThemedText variant="global-body-small-bold">{errorLabel}</ThemedText>
        </Pressable>
        <Pressable
          onPress={() => toast.info(infoLabel)}
          className="min-h-10 flex-1 items-center justify-center rounded-input border border-stroke-default bg-surface-default px-sm py-xs active:opacity-80"
          accessibilityRole="button"
        >
          <ThemedText variant="global-body-small-bold">{infoLabel}</ThemedText>
        </Pressable>
      </View>
    </ThemedView>
  );
}
