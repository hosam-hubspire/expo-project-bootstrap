import { Uniwind } from "uniwind";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import i18n, { type SupportedLanguage } from "@/i18n";
import { mmkvStorage } from "@/lib/mmkv";

export type ThemePreference = "system" | "light" | "dark";

type PreferencesState = {
  themePreference: ThemePreference;
  language: SupportedLanguage;
  setThemePreference: (preference: ThemePreference) => void;
  setLanguage: (language: SupportedLanguage) => void;
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
      setThemePreference: (preference) => {
        Uniwind.setTheme(preference);
        set({ themePreference: preference });
      },
      setLanguage: (language) => {
        void i18n.changeLanguage(language);
        set({ language });
      },
    }),
    {
      name: "preferences",
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state) => ({
        themePreference: state.themePreference,
        language: state.language,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyPreferences(state.themePreference, state.language);
        }
      },
    },
  ),
);
