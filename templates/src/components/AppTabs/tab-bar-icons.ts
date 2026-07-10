import createIconSet from "@expo/vector-icons/createIconSet";

import glyphMap from "@/assets/icons/nanoicons.glyphmap.json";

type NanoGlyphEntry = [number, [number, string][]];

function codepoint(name: keyof typeof glyphMap.i): number {
  const entry = glyphMap.i[name] as NanoGlyphEntry;
  return entry[1][0][0];
}

/**
 * Icon-font family for NativeTabs (rasterized via VectorIcon).
 * Glyphs come from the same SVGs in `assets/icons/` as the in-app `Icon` set.
 */
export const TabBarIcon = createIconSet(
  {
    home: codepoint("home"),
    settings: codepoint("settings"),
  },
  glyphMap.m.f,
);

export type TabBarIconName = "home" | "settings";
