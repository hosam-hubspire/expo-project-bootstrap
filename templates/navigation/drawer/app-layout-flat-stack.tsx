import { Stack } from "expo-router";

/** `(app)/_layout` when both Tabs and Drawer are off — flat stack of screens. */
export default function AppFlatStackLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen name="settings" options={{ title: "Settings" }} />
    </Stack>
  );
}
