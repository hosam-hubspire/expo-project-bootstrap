import {
  IBMPlexMono_400Regular,
  IBMPlexMono_500Medium,
  IBMPlexMono_700Bold,
} from "@expo-google-fonts/ibm-plex-mono";
import { useFonts } from "expo-font";
import type { ReactNode } from "react";
import glyphMap from "@/assets/icons/app-icons/app-icons.glyphmap.json";
import appIconsFont from "@/assets/icons/app-icons/app-icons.ttf";

export function IconFontLoader({ children }: { children: ReactNode }) {
  const [loaded, error] = useFonts({
    [glyphMap.m.f]: appIconsFont,
    "IBMPlexMono-Regular": IBMPlexMono_400Regular,
    "IBMPlexMono-Medium": IBMPlexMono_500Medium,
    "IBMPlexMono-Bold": IBMPlexMono_700Bold,
  });

  if (!loaded && !error) {
    return null;
  }

  return children;
}
