import { Stack } from "expo-router";

/** `(app)/_layout` when Tabs are on and Drawer is off (default shell nesting). */
export default function AppStackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
