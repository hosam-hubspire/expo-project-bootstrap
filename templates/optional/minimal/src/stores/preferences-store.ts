import { Uniwind } from "uniwind";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { mmkvStorage } from "@/lib/mmkv";

export type ThemePreference = "system" | "light" | "dark";

type PreferencesState = {
  themePreference: ThemePreference;
  setThemePreference: (preference: ThemePreference) => void;
};

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      themePreference: "system",
      setThemePreference: (preference) => {
        Uniwind.setTheme(preference);
        set({ themePreference: preference });
      },
    }),
    {
      name: "preferences",
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state) => ({
        themePreference: state.themePreference,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          Uniwind.setTheme(state.themePreference);
        }
      },
    },
  ),
);
