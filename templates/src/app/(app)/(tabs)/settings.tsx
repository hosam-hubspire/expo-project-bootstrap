import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { AnalyticsExamples } from "@/components/AnalyticsExamples";
import {
  BottomSheetExamples,
  BottomSheetExamplesRoot,
} from "@/components/BottomSheetExamples";
import { Icon } from "@/components/Icon";
import { Screen } from "@/components/Screen";
import {
  SettingsButtonRow,
  SettingsFooterButton,
  SettingsOptionChip,
  SettingsPanel,
} from "@/components/SettingsUI";
import { ThemedText } from "@/components/ThemedText";
import { ToastExamples } from "@/components/ToastExamples";
import type { SupportedLanguage } from "@/i18n";
import { type ThemePreference, usePreferencesStore } from "@/stores/preferences-store";

export default function SettingsScreen() {
  const { t } = useTranslation();
  const themePreference = usePreferencesStore((state) => state.themePreference);
  const setThemePreference = usePreferencesStore((state) => state.setThemePreference);
  const language = usePreferencesStore((state) => state.language);
  const setLanguage = usePreferencesStore((state) => state.setLanguage);
  const resetOnboarding = usePreferencesStore((state) => state.resetOnboarding);

  const themeOptions: { value: ThemePreference; label: string }[] = [
    { value: "system", label: t("settings.themeSystem") },
    { value: "light", label: t("settings.themeLight") },
    { value: "dark", label: t("settings.themeDark") },
  ];

  const languageOptions: { value: SupportedLanguage; label: string }[] = [
    { value: "en", label: t("settings.languageEnglish") },
    { value: "es", label: t("settings.languageSpanish") },
  ];

  return (
    <BottomSheetExamplesRoot
      title={t("settings.bottomSheets")}
      description={t("settings.bottomSheetsDescription")}
      inlineLabel={t("settings.bottomSheetInline")}
      modalLabel={t("settings.bottomSheetModal")}
      inlineSheetTitle={t("settings.bottomSheetInlineTitle")}
      modalSheetTitle={t("settings.bottomSheetModalTitle")}
      closeLabel={t("settings.bottomSheetClose")}
      dismissBackdropLabel={t("settings.bottomSheetDismissBackdrop")}
      noteLabel={t("settings.bottomSheetNoteLabel")}
      notePlaceholder={t("settings.bottomSheetNotePlaceholder")}
      noteHelper={t("settings.bottomSheetNoteHelper")}
      inlineBody={t("settings.bottomSheetInlineBody")}
      modalBody={t("settings.bottomSheetModalBody")}
      openedAnnouncement={t("settings.bottomSheetOpenedA11y")}
      closedAnnouncement={t("settings.bottomSheetClosedA11y")}
    >
      <Screen
        edges={["top", "left", "right"]}
        scroll
        contentClassName="w-full max-w-content gap-base self-center px-lg pb-base pt-base"
      >
        <View className="flex-row items-center gap-xs">
          <Icon name="settings" size={22} colorToken="text-text-default" />
          <ThemedText variant="heading-app-section">{t("settings.title")}</ThemedText>
        </View>

        <SettingsPanel
          title={t("settings.appearance")}
          description={t("settings.appearanceDescription")}
          icon="appearance"
        >
          <SettingsButtonRow>
            {themeOptions.map((option) => (
              <SettingsOptionChip
                key={option.value}
                label={option.label}
                value={option.value}
                selected={themePreference === option.value}
                onSelect={setThemePreference}
              />
            ))}
          </SettingsButtonRow>
        </SettingsPanel>

        <SettingsPanel
          title={t("settings.language")}
          description={t("settings.languageDescription")}
          icon="language"
        >
          <SettingsButtonRow>
            {languageOptions.map((option) => (
              <SettingsOptionChip
                key={option.value}
                label={option.label}
                value={option.value}
                selected={language === option.value}
                onSelect={setLanguage}
              />
            ))}
          </SettingsButtonRow>
        </SettingsPanel>

        <ToastExamples
          title={t("settings.toasts")}
          description={t("settings.toastsDescription")}
          successLabel={t("settings.toastSuccess")}
          errorLabel={t("settings.toastError")}
          infoLabel={t("settings.toastInfo")}
        />

        <AnalyticsExamples
          title={t("settings.analytics")}
          description={t("settings.analyticsDescription")}
          trackLabel={t("settings.analyticsTrack")}
          identifyLabel={t("settings.analyticsIdentify")}
          resetLabel={t("settings.analyticsReset")}
        />

        <BottomSheetExamples />

        <SettingsFooterButton
          label={t("settings.replayOnboarding")}
          onPress={() => {
            resetOnboarding();
          }}
        />
      </Screen>
    </BottomSheetExamplesRoot>
  );
}
