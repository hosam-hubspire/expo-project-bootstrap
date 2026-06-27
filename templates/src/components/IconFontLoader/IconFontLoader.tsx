import { useFonts } from "expo-font";
import type { ReactNode } from "react";
import glyphMap from "@/assets/icons/nanoicons.glyphmap.json";
import nanoiconsFont from "@/assets/icons/nanoicons.ttf";

export function IconFontLoader({ children }: { children: ReactNode }) {
  const [loaded, error] = useFonts({
    [glyphMap.m.f]: nanoiconsFont,
  });

  if (!loaded && !error) {
    return null;
  }

  return children;
}
