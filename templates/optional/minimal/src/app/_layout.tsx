import "@/global.css";
import "@/stores/preferences-store";

import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { useUniwind } from "uniwind";
import { AppToast } from "@/components/AppToast";
import { IconFontLoader } from "@/components/IconFontLoader";
import { SplashScreenController } from "@/components/SplashScreenController";
import { usePreferencesStore } from "@/stores/preferences-store";

/** Minimal root (no i18n / GraphQL / Storybook). Default nav: tabs + intro. */
export default function RootLayout() {
  const { theme } = useUniwind();

  return (
    <GestureHandlerRootView className="flex-1">
      <KeyboardProvider>
        <IconFontLoader>
          <ThemeProvider value={theme === "dark" ? DarkTheme : DefaultTheme}>
            <SplashScreenController />
            <RootNavigator />
            <AppToast />
          </ThemeProvider>
        </IconFontLoader>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}

function RootNavigator() {
  const hasCompletedOnboarding = usePreferencesStore((state) => state.hasCompletedOnboarding);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!hasCompletedOnboarding}>
        <Stack.Screen name="(onboarding)" />
      </Stack.Protected>

      <Stack.Protected guard={hasCompletedOnboarding}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>
    </Stack>
  );
}
