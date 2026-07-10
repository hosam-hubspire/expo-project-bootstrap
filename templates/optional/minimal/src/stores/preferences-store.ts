import { Uniwind } from "uniwind";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { mmkvStorage } from "@/lib/mmkv";

export type ThemePreference = "system" | "light" | "dark";

type PreferencesState = {
  themePreference: ThemePreference;
  hasCompletedOnboarding: boolean;
  _hasHydrated: boolean;
  setThemePreference: (preference: ThemePreference) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  setHasHydrated: (value: boolean) => void;
};

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      themePreference: "system",
      hasCompletedOnboarding: false,
      _hasHydrated: false,
      setThemePreference: (preference) => {
        Uniwind.setTheme(preference);
        set({ themePreference: preference });
      },
      completeOnboarding: () => {
        set({ hasCompletedOnboarding: true });
      },
      resetOnboarding: () => {
        set({ hasCompletedOnboarding: false });
      },
      setHasHydrated: (value) => {
        set({ _hasHydrated: value });
      },
    }),
    {
      name: "preferences",
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state) => ({
        themePreference: state.themePreference,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          Uniwind.setTheme(state.themePreference);
        }
        queueMicrotask(() => {
          usePreferencesStore.getState().setHasHydrated(true);
        });
      },
    },
  ),
);
