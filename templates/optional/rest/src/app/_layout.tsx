import "@/global.css";
import "@/i18n";
import "@/stores/preferences-store";

import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useUniwind } from "uniwind";

import { AppToast } from "@/components/AppToast";
import { IconFontLoader } from "@/components/IconFontLoader";
import { SplashScreenController } from "@/components/SplashScreenController";
import { usePreferencesStore } from "@/stores/preferences-store";
import StorybookUIRoot from "../../.rnstorybook";

const isStorybookEnabled = process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === "true";

/**
 * REST stack root: no AppApolloProvider.
 * When auth is on, wrap with SessionProvider (inside GestureHandlerRootView) per navigation/README.md.
 * Axios reads SESSION_STORAGE_KEY from SecureStore in its request interceptor.
 */
export default function RootLayout() {
  const { theme } = useUniwind();

  if (isStorybookEnabled) {
    return <StorybookUIRoot />;
  }

  return (
    <GestureHandlerRootView className="flex-1">
      <IconFontLoader>
        <ThemeProvider value={theme === "dark" ? DarkTheme : DefaultTheme}>
          <SplashScreenController />
          <RootNavigator />
          <AppToast />
        </ThemeProvider>
      </IconFontLoader>
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
