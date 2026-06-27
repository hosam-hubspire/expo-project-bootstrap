import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";

import { ThemedView } from "@/components/ThemedView";
import { typographyVariants } from "@/stories/design-tokens/token-definitions";
import type { TypographyTokenName } from "@/theme";

import { ThemedText } from "./ThemedText";

const meta = {
  title: "Components/ThemedText",
  component: ThemedText,
  decorators: [
    (Story) => (
      <ThemedView className="flex-1 p-base" colorToken="surface-default">
        <Story />
      </ThemedView>
    ),
  ],
} satisfies Meta<typeof ThemedText>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Default body text",
    variant: "global-body-base",
  },
};

export const Section: Story = {
  args: {
    children: "Section heading",
    variant: "heading-app-section",
  },
};

export const AllVariants: Story = {
  render: () => (
    <View className="gap-sm">
      {typographyVariants.map((variant) => (
        <ThemedText key={variant.name} variant={variant.name as TypographyTokenName}>
          {variant.label}
        </ThemedText>
      ))}
      <ThemedText variant="global-body-base" colorToken="text-text-secondary">
        Secondary color override
      </ThemedText>
    </View>
  ),
};
