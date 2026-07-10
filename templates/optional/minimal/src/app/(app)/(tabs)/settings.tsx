import { Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Icon } from "@/components/Icon";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { type ThemePreference, usePreferencesStore } from "@/stores/preferences-store";

type OptionButtonProps = {
  label: string;
  value: ThemePreference;
  selected: boolean;
  onSelect: (value: ThemePreference) => void;
};

function OptionButton({ label, value, selected, onSelect }: OptionButtonProps) {
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
  const themePreference = usePreferencesStore((state) => state.themePreference);
  const setThemePreference = usePreferencesStore((state) => state.setThemePreference);
  const resetOnboarding = usePreferencesStore((state) => state.resetOnboarding);

  const themeOptions: { value: ThemePreference; label: string }[] = [
    { value: "system", label: "System" },
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" },
  ];

  return (
    <ThemedView className="flex-1">
      <SafeAreaView className="w-full max-w-content flex-1 gap-base self-center px-lg pb-base pt-base ios:pb-[66px] android:pb-[96px]">
        <ThemedText variant="heading-app-section">Settings</ThemedText>

        <ThemedView colorToken="surface-secondary" className="gap-xs rounded-panel p-base">
          <View className="flex-row items-center gap-xs">
            <Icon name="appearance" size={18} colorToken="text-text-default" />
            <ThemedText variant="global-body-small-bold">Appearance</ThemedText>
          </View>
          <ThemedText variant="global-body-small" colorToken="text-text-secondary">
            Choose light, dark, or match the system setting.
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

        <Pressable
          onPress={() => {
            resetOnboarding();
          }}
          className="items-center rounded-button border border-stroke-default px-base py-sm active:opacity-80"
          accessibilityRole="button"
        >
          <ThemedText variant="global-body-small-bold">Replay onboarding</ThemedText>
        </Pressable>
      </SafeAreaView>
    </ThemedView>
  );
}
