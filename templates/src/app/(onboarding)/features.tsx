import { useTranslation } from "react-i18next";
import { Pressable, View } from "react-native";

import { Screen } from "@/components/Screen";
import { ThemedText } from "@/components/ThemedText";
import { usePreferencesStore } from "@/stores/preferences-store";

export default function OnboardingFeaturesScreen() {
  const { t } = useTranslation();
  const completeOnboarding = usePreferencesStore((state) => state.completeOnboarding);

  return (
    <Screen
      contentClassName="w-full max-w-content self-center justify-center gap-base px-lg"
      footer={
        <Pressable
          onPress={() => {
            completeOnboarding();
          }}
          className="w-full max-w-content items-center self-center rounded-button bg-button-button-primary px-base py-sm active:opacity-80"
          accessibilityRole="button"
        >
          <ThemedText variant="global-body-small-bold" colorToken="surface-default">
            {t("onboarding.getStarted")}
          </ThemedText>
        </Pressable>
      }
    >
      <View className="gap-xs">
        <ThemedText variant="heading-app-section">{t("onboarding.featuresTitle")}</ThemedText>
        <ThemedText variant="global-body-small" colorToken="text-text-secondary">
          {t("onboarding.featuresSubtitle")}
        </ThemedText>
      </View>
    </Screen>
  );
}
