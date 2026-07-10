import { Stack } from "expo-router";

/** Passthrough when Tabs are on and Drawer is off. Swap for drawer layouts from `navigation/drawer/`. */
export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
