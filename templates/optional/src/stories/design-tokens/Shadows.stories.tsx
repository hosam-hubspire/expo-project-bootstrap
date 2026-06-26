import type { Meta, StoryObj } from "@storybook/react-native";
import { ScrollView, View } from "react-native";

import { ThemedText } from "@/components/ThemedText";

function ShadowsShowcase() {
  return (
    <ScrollView className="flex-1" contentContainerClassName="p-base gap-base">
      <View className="gap-xs">
        <ThemedText variant="heading-rider-tools-section">Shadows</ThemedText>
        <ThemedText variant="global-body-small" colorToken="text-text-secondary">
          No shadow tokens are defined in global.css yet. Add --shadow-* variables to @theme when
          Figma tokens land, then update this story.
        </ThemedText>
      </View>

      <View className="rounded-panel border border-dashed border-stroke-default bg-surface-secondary p-lg">
        <ThemedText
          variant="global-body-small"
          colorToken="text-text-secondary"
          style={{ textAlign: "center" }}
        >
          Shadow tokens pending
        </ThemedText>
      </View>
    </ScrollView>
  );
}

const meta = {
  title: "Design Tokens/Shadows",
  component: ShadowsShowcase,
} satisfies Meta<typeof ShadowsShowcase>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Placeholder: Story = {};
