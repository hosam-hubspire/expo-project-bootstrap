import { router } from "expo-router";
import { Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function OnboardingWelcomeScreen() {
  return (
    <ThemedView className="flex-1" colorToken="surface-default">
      <SafeAreaView className="flex-1 justify-center gap-base p-base">
        <ThemedText variant="heading-app-section">Welcome</ThemedText>
        <ThemedText variant="global-body-small" colorToken="text-text-secondary">
          A short intro shown once after install. Replace these screens with your product
          onboarding.
        </ThemedText>
        <Pressable
          onPress={() => {
            router.push("/(onboarding)/features");
          }}
          className="items-center rounded-button bg-button-button-primary px-base py-sm active:opacity-80"
          accessibilityRole="button"
        >
          <ThemedText variant="global-body-small-bold" colorToken="surface-default">
            Continue
          </ThemedText>
        </Pressable>
      </SafeAreaView>
    </ThemedView>
  );
}
