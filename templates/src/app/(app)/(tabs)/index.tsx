import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { Icon } from "@/components/Icon";
import { Screen } from "@/components/Screen";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

/** Tab screens omit bottom inset — NativeTabs already clears the home indicator. */
export default function HomeScreen() {
  const { t } = useTranslation();

  return (
    <Screen
      edges={["top", "left", "right"]}
      contentClassName="w-full max-w-content self-center justify-center gap-base px-lg py-base"
    >
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
    </Screen>
  );
}
