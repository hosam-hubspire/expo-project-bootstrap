import { View } from "react-native";

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
    <BottomSheetExamplesRoot
      title="Bottom sheets"
      description="Inline sheet with custom backdrop, and modal sheet with scrim, keyboard padding, and accessibility."
      inlineLabel="Open inline"
      modalLabel="Open modal"
      inlineSheetTitle="Inline sheet"
      modalSheetTitle="Modal sheet"
      closeLabel="Close"
      dismissBackdropLabel="Dismiss sheet"
      noteLabel="Note"
      notePlaceholder="Focus here — the sheet grows with the keyboard."
      noteHelper="Uses KeyboardAwareScrollView + animateContentHeight={false} for a content detent."
      inlineBody="Renders in the screen layout. Tap the dimmed backdrop, swipe down, or Close to dismiss."
      modalBody="Portaled modal with scrimColor / scrimOpacities. Tap the scrim or Close to dismiss."
      openedAnnouncement="Bottom sheet opened"
      closedAnnouncement="Bottom sheet closed"
    >
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

        <BottomSheetExamples />

        <SettingsFooterButton
          label="Replay onboarding"
          onPress={() => {
            resetOnboarding();
          }}
        />
      </Screen>
    </BottomSheetExamplesRoot>
  );
}
