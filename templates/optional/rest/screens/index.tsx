import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { Icon } from "@/components/Icon";
import { RestExamples } from "@/components/RestExamples";
import { Screen } from "@/components/Screen";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

/** Flat home when Tabs is off and API client is REST — copy to `src/app/(app)/index.tsx`. */
export default function HomeScreen() {
  const { t } = useTranslation();

  return (
    <Screen scroll contentClassName="w-full max-w-content self-center gap-base px-lg py-base">
      <ThemedView
        colorToken="surface-secondary"
        className="h-16 w-16 items-center justify-center rounded-panel"
      >
        <Icon name="home" size={28} colorToken="button-button-primary" />
      </ThemedView>
      <View className="gap-xs">
        <ThemedText variant="heading-app-section">{t("home.title")}</ThemedText>
        <ThemedText variant="global-body-small" colorToken="text-text-secondary">
          {t("home.subtitle")}
        </ThemedText>
      </View>

      <RestExamples
        title={t("home.restTitle")}
        description={t("home.restDescription")}
        fetchLabel={t("home.restFetch")}
        fetchLoading={t("home.restFetchLoading")}
        fetchError={t("home.restFetchError")}
      />
    </Screen>
  );
}
