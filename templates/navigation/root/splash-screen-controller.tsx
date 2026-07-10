import { SplashScreen } from "expo-router";

import { usePreferencesStore } from "@/stores/preferences-store";

SplashScreen.preventAutoHideAsync();

type SplashScreenControllerProps = {
  /** When auth is enabled, pass `useSession().isLoading` so splash waits for session too. */
  authLoading?: boolean;
};

/**
 * Keep the native splash visible until persisted preferences (and optional auth) rehydrate.
 * Place inside providers in the root layout.
 */
export function SplashScreenController({ authLoading = false }: SplashScreenControllerProps) {
  const preferencesHydrated = usePreferencesStore((state) => state._hasHydrated);

  if (preferencesHydrated && !authLoading) {
    SplashScreen.hide();
  }

  return null;
}
