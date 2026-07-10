import { useTranslation } from "react-i18next";
import { Pressable, View } from "react-native";

import { Icon } from "@/components/Icon";
import { Screen } from "@/components/Screen";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ToastExamples } from "@/components/ToastExamples";
// When any permission toggle is on at intake, uncomment:
// import { PermissionsExamples } from "@/components/PermissionsExamples";
import type { SupportedLanguage } from "@/i18n";
import { type ThemePreference, usePreferencesStore } from "@/stores/preferences-store";

type OptionButtonProps<T extends string> = {
  label: string;
  value: T;
  selected: boolean;
  onSelect: (value: T) => void;
};

function OptionButton<T extends string>({
  label,
  value,
  selected,
  onSelect,
}: OptionButtonProps<T>) {
  return (
    <Pressable
      onPress={() => onSelect(value)}
      className={`min-h-10 flex-1 flex-row items-center justify-center gap-2xs rounded-input border px-sm py-xs active:opacity-80 ${
        selected
          ? "border-button-button-primary bg-surface-tertiary"
          : "border-transparent bg-surface-default"
      }`}
      accessibilityRole="button"
      accessibilityState={{ selected }}
    >
      {selected ? <Icon name="check" size={14} colorToken="button-button-primary" /> : null}
      <ThemedText variant="global-body-small-bold">{label}</ThemedText>
    </Pressable>
  );
}

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

      <ThemedView colorToken="surface-secondary" className="gap-sm rounded-panel p-base">
        <View className="gap-2xs">
          <View className="flex-row items-center gap-xs">
            <Icon name="appearance" size={18} colorToken="text-text-default" />
            <ThemedText variant="global-body-small-bold">{t("settings.appearance")}</ThemedText>
          </View>
          <ThemedText variant="global-body-small" colorToken="text-text-secondary">
            {t("settings.appearanceDescription")}
          </ThemedText>
        </View>
        <View className="flex-row gap-xs">
          {themeOptions.map((option) => (
            <OptionButton
              key={option.value}
              label={option.label}
              value={option.value}
              selected={themePreference === option.value}
              onSelect={setThemePreference}
            />
          ))}
        </View>
      </ThemedView>

      <ThemedView colorToken="surface-secondary" className="gap-sm rounded-panel p-base">
        <View className="gap-2xs">
          <View className="flex-row items-center gap-xs">
            <Icon name="language" size={18} colorToken="text-text-default" />
            <ThemedText variant="global-body-small-bold">{t("settings.language")}</ThemedText>
          </View>
          <ThemedText variant="global-body-small" colorToken="text-text-secondary">
            {t("settings.languageDescription")}
          </ThemedText>
        </View>
        <View className="flex-row gap-xs">
          {languageOptions.map((option) => (
            <OptionButton
              key={option.value}
              label={option.label}
              value={option.value}
              selected={language === option.value}
              onSelect={setLanguage}
            />
          ))}
        </View>
      </ThemedView>

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

      <Pressable
        onPress={() => {
          resetOnboarding();
        }}
        className="items-center rounded-button border border-stroke-default px-base py-sm active:opacity-80"
        accessibilityRole="button"
      >
        <ThemedText variant="global-body-small-bold">{t("settings.replayOnboarding")}</ThemedText>
      </Pressable>
    </Screen>
  );
}
