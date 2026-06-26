import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function HomeScreen() {
  const { t } = useTranslation();

  return (
    <ThemedView className="flex-1" colorToken="surface-default">
      <SafeAreaView className="flex-1 justify-center gap-sm p-base">
        <ThemedText variant="heading-app-section">{t("home.title")}</ThemedText>
        <ThemedText variant="global-body-small" colorToken="text-text-secondary">
          {t("home.subtitle")}
        </ThemedText>
      </SafeAreaView>
    </ThemedView>
  );
}
