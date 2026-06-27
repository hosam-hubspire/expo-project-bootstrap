import "@/theme/global.css";
import "@/i18n";
import "@/stores/preferences-store";

import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useUniwind } from "uniwind";

import { IconFontLoader } from "@/components/IconFontLoader";
import { AppApolloProvider } from "@/providers/apollo-provider";
import StorybookUIRoot from "../../.rnstorybook";

const isStorybookEnabled = process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === "true";

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
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
            </Stack>
          </ThemeProvider>
        </IconFontLoader>
      </AppApolloProvider>
    </GestureHandlerRootView>
  );
}
