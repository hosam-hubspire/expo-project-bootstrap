import { Pressable, View } from "react-native";

import { Icon } from "@/components/Icon";
import { Screen } from "@/components/Screen";
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
      <ThemedText variant="heading-app-section">Settings</ThemedText>

      <ThemedView colorToken="surface-secondary" className="gap-sm rounded-panel p-base">
        <View className="gap-2xs">
          <View className="flex-row items-center gap-xs">
            <Icon name="appearance" size={18} colorToken="text-text-default" />
            <ThemedText variant="global-body-small-bold">Appearance</ThemedText>
          </View>
          <ThemedText variant="global-body-small" colorToken="text-text-secondary">
            Choose light, dark, or match the system setting.
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

      <Pressable
        onPress={() => {
          resetOnboarding();
        }}
        className="items-center rounded-button border border-stroke-default px-base py-sm active:opacity-80"
        accessibilityRole="button"
      >
        <ThemedText variant="global-body-small-bold">Replay onboarding</ThemedText>
      </Pressable>
    </Screen>
  );
}
