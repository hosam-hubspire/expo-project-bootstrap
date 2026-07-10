import { Stack } from "expo-router";

import { useSession } from "@/providers/session-provider";
import { usePreferencesStore } from "@/stores/preferences-store";

/**
 * Reference RootNavigator when **auth + intro** are both on (tabs/drawer live under `(app)`).
 * Copy into `src/app/_layout.tsx` (or keep as a sibling component) when Protected routes are enabled.
 */
export function RootNavigatorWithAuth() {
  const { session } = useSession();
  const hasCompletedOnboarding = usePreferencesStore((state) => state.hasCompletedOnboarding);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!hasCompletedOnboarding}>
        <Stack.Screen name="(onboarding)" />
      </Stack.Protected>

      <Stack.Protected guard={hasCompletedOnboarding && !session}>
        <Stack.Screen name="sign-in" />
      </Stack.Protected>

      <Stack.Protected guard={hasCompletedOnboarding && !!session}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>
    </Stack>
  );
}
