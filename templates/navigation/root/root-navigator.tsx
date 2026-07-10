import { Stack } from "expo-router";

import { usePreferencesStore } from "@/stores/preferences-store";

/**
 * Default RootNavigator: intro + tabs (no auth, no drawer).
 * Compose additional Stack.Protected blocks from navigation/README.md when toggles change.
 *
 * Auth on — nest SessionProvider inside AppApolloProvider (when GraphQL on); add:
 *   <Stack.Protected guard={hasCompletedOnboarding && !session}><Stack.Screen name="sign-in" /></Stack.Protected>
 *   and tighten the (app) guard to `hasCompletedOnboarding && !!session`
 * Intro off — drop the onboarding Protected block; (app) guard becomes `true` (or `!!session` if auth).
 */
export function RootNavigator() {
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
