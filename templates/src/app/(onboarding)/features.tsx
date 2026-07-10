import { useTranslation } from "react-i18next";
import { Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { usePreferencesStore } from "@/stores/preferences-store";

export default function OnboardingFeaturesScreen() {
  const { t } = useTranslation();
  const completeOnboarding = usePreferencesStore((state) => state.completeOnboarding);

  return (
    <ThemedView className="flex-1" colorToken="surface-default">
      <SafeAreaView className="flex-1 justify-center gap-base p-base">
        <ThemedText variant="heading-app-section">{t("onboarding.featuresTitle")}</ThemedText>
        <ThemedText variant="global-body-small" colorToken="text-text-secondary">
          {t("onboarding.featuresSubtitle")}
        </ThemedText>
        <Pressable
          onPress={() => {
            completeOnboarding();
          }}
          className="items-center rounded-button bg-button-button-primary px-base py-sm active:opacity-80"
          accessibilityRole="button"
        >
          <ThemedText variant="global-body-small-bold" colorToken="surface-default">
            {t("onboarding.getStarted")}
          </ThemedText>
        </Pressable>
      </SafeAreaView>
    </ThemedView>
  );
}
