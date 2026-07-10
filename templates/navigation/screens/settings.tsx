import { useTranslation } from "react-i18next";
import { View } from "react-native";

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
// When any permission toggle is on at intake, uncomment:
// import { PermissionsExamples } from "@/components/PermissionsExamples";
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
    <Screen scroll contentClassName="w-full max-w-content gap-base self-center px-lg pb-base pt-base">
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

      {/*
        When any permission toggle is on at intake, uncomment and keep only labels
        for selected capabilities (also trim unused imports in PermissionsExamples):

      <PermissionsExamples
        title={t("settings.permissions")}
        description={t("settings.permissionsDescription")}
        statusLabel={t("settings.permissionStatus")}
        requestLabel={t("settings.permissionRequest")}
        openSettingsLabel={t("settings.permissionOpenSettings")}
        labels={{
          microphone: t("settings.permissionMicrophone"),
          locationForeground: t("settings.permissionLocationForeground"),
          locationBackground: t("settings.permissionLocationBackground"),
          locationServices: t("settings.permissionLocationServices"),
          notifications: t("settings.permissionNotifications"),
          camera: t("settings.permissionCamera"),
          mediaLibrary: t("settings.permissionMediaLibrary"),
        }}
      />
      */}

      <SettingsFooterButton
        label={t("settings.replayOnboarding")}
        onPress={() => {
          resetOnboarding();
        }}
      />
    </Screen>
  );
}
