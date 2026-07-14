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
import { type ThemePreference, usePreferencesStore } from "@/stores/preferences-store";

export default function SettingsScreen() {
  const themePreference = usePreferencesStore((state) => state.themePreference);
  const setThemePreference = usePreferencesStore((state) => state.setThemePreference);
  const resetOnboarding = usePreferencesStore((state) => state.resetOnboarding);

  const themeOptions: { value: ThemePreference; label: string }[] = [
    { value: "system", label: "System" },
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" },
  ];

  return (
    <Screen
      edges={["top", "left", "right"]}
      scroll
      contentClassName="w-full max-w-content gap-base self-center px-lg pb-base pt-base"
    >
      <View className="flex-row items-center gap-xs">
        <Icon name="settings" size={22} colorToken="text-text-default" />
        <ThemedText variant="heading-app-section">Settings</ThemedText>
      </View>

      <SettingsPanel
        title="Appearance"
        description="Choose light, dark, or match the system setting."
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

      <ToastExamples
        title="Toasts"
        description="Sample success, error, and info toasts via @/utils/toast."
        successLabel="Success"
        errorLabel="Error"
        infoLabel="Info"
      />

      <SettingsFooterButton
        label="Replay onboarding"
        onPress={() => {
          resetOnboarding();
        }}
      />
    </Screen>
  );
}
