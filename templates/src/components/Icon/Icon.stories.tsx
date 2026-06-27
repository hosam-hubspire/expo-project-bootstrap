import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

import { Icon } from "./Icon";

const meta = {
  title: "Components/Icon",
  component: Icon,
  decorators: [
    (Story) => (
      <ThemedView
        className="flex-1 items-center justify-center p-base"
        colorToken="surface-default"
      >
        <Story />
      </ThemedView>
    ),
  ],
} satisfies Meta<typeof Icon>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "home",
    size: 32,
    colorToken: "text-text-default",
  },
};

export const CustomColor: Story = {
  args: {
    name: "settings",
    size: 32,
    color: "#12284b",
  },
};

export const Sizes: Story = {
  args: {
    name: "search",
    size: 24,
    color: "#12284b",
  },
  render: () => (
    <View className="flex-row items-end gap-base">
      {[16, 24, 32, 48].map((size) => (
        <View key={size} className="items-center gap-2xs">
          <Icon name="search" size={size} color="#12284b" />
          <ThemedText variant="global-body-xxs" colorToken="text-text-secondary">
            {size}
          </ThemedText>
        </View>
      ))}
    </View>
  ),
};
