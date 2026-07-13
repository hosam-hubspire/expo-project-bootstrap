import type { Meta, StoryObj } from "@storybook/react-native";
import { ScrollView, View } from "react-native";

import glyphMap from "@/assets/icons/nanoicons.glyphmap.json";
import { Icon, type IconName } from "@/components/Icon";
import { ThemedText } from "@/components/ThemedText";

const sampleIcons = Object.keys(glyphMap.i) as IconName[];

function IconsShowcase() {
  return (
    <ScrollView className="flex-1" contentContainerClassName="p-base gap-base">
      <View className="gap-xs">
        <ThemedText variant="heading-app-section">Icons</ThemedText>
        <ThemedText variant="global-body-small" colorToken="text-text-secondary">
          All {sampleIcons.length} sample icons (replace SVGs in assets/icons/ and prebuild to
          update)
        </ThemedText>
      </View>

      <View className="flex-row flex-wrap gap-base">
        {sampleIcons.map((name) => (
          <View key={name} className="w-[22%] items-center gap-2xs">
            <View className="rounded-panel bg-surface-secondary p-sm">
              <Icon name={name} size={24} color="#12284b" />
            </View>
            <ThemedText
              variant="global-body-xxs"
              colorToken="text-text-secondary"
              numberOfLines={2}
              style={{ textAlign: "center" }}
            >
              {name}
            </ThemedText>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const meta = {
  title: "Design Tokens/Icons",
  component: IconsShowcase,
} satisfies Meta<typeof IconsShowcase>;

export default meta;

type Story = StoryObj<typeof meta>;

export const SampleGrid: Story = {};
