import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

/** Optional drawer-only screen — copy to `src/app/(app)/about.tsx` when Drawer is on. */
export default function AboutScreen() {
  const { t } = useTranslation();

  return (
    <ThemedView className="flex-1" colorToken="surface-default">
      <SafeAreaView className="flex-1 justify-center gap-sm p-base">
        <ThemedText variant="heading-app-section">{t("drawer.aboutTitle")}</ThemedText>
        <ThemedText variant="global-body-small" colorToken="text-text-secondary">
          {t("drawer.aboutSubtitle")}
        </ThemedText>
      </SafeAreaView>
    </ThemedView>
  );
}
