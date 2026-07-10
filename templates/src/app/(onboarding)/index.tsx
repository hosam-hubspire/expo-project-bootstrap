import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function OnboardingWelcomeScreen() {
  const { t } = useTranslation();

  return (
    <ThemedView className="flex-1" colorToken="surface-default">
      <SafeAreaView className="flex-1 justify-center gap-base p-base">
        <ThemedText variant="heading-app-section">{t("onboarding.welcomeTitle")}</ThemedText>
        <ThemedText variant="global-body-small" colorToken="text-text-secondary">
          {t("onboarding.welcomeSubtitle")}
        </ThemedText>
        <Pressable
          onPress={() => {
            router.push("/(onboarding)/features");
          }}
          className="items-center rounded-button bg-button-button-primary px-base py-sm active:opacity-80"
          accessibilityRole="button"
        >
          <ThemedText variant="global-body-small-bold" colorToken="surface-default">
            {t("onboarding.continue")}
          </ThemedText>
        </Pressable>
      </SafeAreaView>
    </ThemedView>
  );
}
