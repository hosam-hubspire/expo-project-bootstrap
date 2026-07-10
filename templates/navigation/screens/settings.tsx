import { useTranslation } from "react-i18next";
import { Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Icon } from "@/components/Icon";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
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
      className={`rounded-input border px-base py-xs active:opacity-80 ${
        selected
          ? "border-button-button-primary bg-surface-tertiary"
          : "border-transparent bg-surface-secondary"
      }`}
      accessibilityRole="button"
      accessibilityState={{ selected }}
    >
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
    <ThemedView className="flex-1">
      <SafeAreaView className="w-full max-w-content flex-1 gap-base self-center px-lg pb-base pt-base ios:pb-[66px] android:pb-[96px]">
        <ThemedText variant="heading-app-section">{t("settings.title")}</ThemedText>

        <ThemedView colorToken="surface-secondary" className="gap-xs rounded-panel p-base">
          <View className="flex-row items-center gap-xs">
            <Icon name="appearance" size={18} colorToken="text-text-default" />
            <ThemedText variant="global-body-small-bold">{t("settings.appearance")}</ThemedText>
          </View>
          <ThemedText variant="global-body-small" colorToken="text-text-secondary">
            {t("settings.appearanceDescription")}
          </ThemedText>
          <View className="flex-row flex-wrap gap-xs">
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

        <ThemedView colorToken="surface-secondary" className="gap-xs rounded-panel p-base">
          <View className="flex-row items-center gap-xs">
            <Icon name="language" size={18} colorToken="text-text-default" />
            <ThemedText variant="global-body-small-bold">{t("settings.language")}</ThemedText>
          </View>
          <ThemedText variant="global-body-small" colorToken="text-text-secondary">
            {t("settings.languageDescription")}
          </ThemedText>
          <View className="flex-row flex-wrap gap-xs">
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

        <Pressable
          onPress={() => {
            resetOnboarding();
          }}
          className="items-center rounded-button border border-stroke-default px-base py-sm active:opacity-80"
          accessibilityRole="button"
        >
          <ThemedText variant="global-body-small-bold">{t("settings.replayOnboarding")}</ThemedText>
        </Pressable>
      </SafeAreaView>
    </ThemedView>
  );
}
