import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { Screen } from "@/components/Screen";
import { ThemedText } from "@/components/ThemedText";

/** Optional drawer-only screen — copy to `src/app/(app)/about.tsx` when Drawer is on. */
export default function AboutScreen() {
  const { t } = useTranslation();

  return (
    <Screen contentClassName="w-full max-w-content self-center justify-center gap-xs px-lg py-base">
      <View className="gap-xs">
        <ThemedText variant="heading-app-section">{t("drawer.aboutTitle")}</ThemedText>
        <ThemedText variant="global-body-small" colorToken="text-text-secondary">
          {t("drawer.aboutSubtitle")}
        </ThemedText>
      </View>
    </Screen>
  );
}
