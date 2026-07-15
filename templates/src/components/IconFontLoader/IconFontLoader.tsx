import { useFonts } from "expo-font";
import type { ReactNode } from "react";
import glyphMap from "@/assets/icons/nanoicons.glyphmap.json";
import nanoiconsFont from "@/assets/icons/nanoicons.ttf";
import { expoFontSourceMap } from "@/theme/fonts";

export function IconFontLoader({ children }: { children: ReactNode }) {
  const [loaded, error] = useFonts({
    [glyphMap.m.f]: nanoiconsFont,
    ...expoFontSourceMap,
  });

  if (!loaded && !error) {
    return null;
  }

  return children;
}
