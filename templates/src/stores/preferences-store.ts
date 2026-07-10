import { Uniwind } from "uniwind";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import i18n, { type SupportedLanguage } from "@/i18n";
import { mmkvStorage } from "@/lib/mmkv";

export type ThemePreference = "system" | "light" | "dark";

type PreferencesState = {
  themePreference: ThemePreference;
  language: SupportedLanguage;
  hasCompletedOnboarding: boolean;
  _hasHydrated: boolean;
  setThemePreference: (preference: ThemePreference) => void;
  setLanguage: (language: SupportedLanguage) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  setHasHydrated: (value: boolean) => void;
};

function applyPreferences(themePreference: ThemePreference, language: SupportedLanguage) {
  Uniwind.setTheme(themePreference);
  void i18n.changeLanguage(language);
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      themePreference: "system",
      language: "en",
      hasCompletedOnboarding: false,
      _hasHydrated: false,
      setThemePreference: (preference) => {
        Uniwind.setTheme(preference);
        set({ themePreference: preference });
      },
      setLanguage: (language) => {
        void i18n.changeLanguage(language);
        set({ language });
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
        language: state.language,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyPreferences(state.themePreference, state.language);
        }
        // Defer so the store finishes rehydration before marking ready
        queueMicrotask(() => {
          usePreferencesStore.getState().setHasHydrated(true);
        });
      },
    },
  ),
);
