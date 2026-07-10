import "@/theme/global.css";
import "@/i18n";
import "@/stores/preferences-store";

import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useUniwind } from "uniwind";

import { IconFontLoader } from "@/components/IconFontLoader";
import { AppToast } from "@/components/AppToast";
import { SplashScreenController } from "@/components/SplashScreenController";
import { AppApolloProvider } from "@/providers/apollo-provider";
import { usePreferencesStore } from "@/stores/preferences-store";
import StorybookUIRoot from "../../.rnstorybook";

const isStorybookEnabled = process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === "true";

/**
 * Default root: tabs + intro onboarding (no auth, no drawer).
 * When intake enables auth/drawer/flat screens, compose from `templates/navigation/` —
 * see `templates/navigation/README.md`.
 */
export default function RootLayout() {
  const { theme } = useUniwind();

  if (isStorybookEnabled) {
    return <StorybookUIRoot />;
  }

  return (
    <GestureHandlerRootView className="flex-1">
      <AppApolloProvider>
        <IconFontLoader>
          <ThemeProvider value={theme === "dark" ? DarkTheme : DefaultTheme}>
            <SplashScreenController />
            <RootNavigator />
            <AppToast />
          </ThemeProvider>
        </IconFontLoader>
      </AppApolloProvider>
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
