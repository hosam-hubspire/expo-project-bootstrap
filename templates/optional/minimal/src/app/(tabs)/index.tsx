import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function HomeScreen() {
  return (
    <ThemedView className="flex-1" colorToken="surface-default">
      <SafeAreaView className="flex-1 justify-center gap-sm p-base">
        <ThemedText variant="heading-app-section">Home</ThemedText>
        <ThemedText variant="global-body-small" colorToken="text-text-secondary">
          Expo bootstrap shell — add screens and features here.
        </ThemedText>
      </SafeAreaView>
    </ThemedView>
  );
}
