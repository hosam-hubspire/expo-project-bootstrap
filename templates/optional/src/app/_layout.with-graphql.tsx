import "@/theme/global.css";
import "@/stores/preferences-store";

import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useUniwind } from "uniwind";

import { IconFontLoader } from "@/components/IconFontLoader";
import { AppApolloProvider } from "@/providers/apollo-provider";

export default function RootLayout() {
  const { theme } = useUniwind();

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
