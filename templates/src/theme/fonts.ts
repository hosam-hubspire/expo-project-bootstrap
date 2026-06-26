import { Platform } from "react-native";

/** Figma primitive family/family-sans */
export const SansFamily = "Helvetica Neue" as const;

const appFonts = {
  sans: SansFamily,
  mono: "IBMPlexMono-Regular",
  monoMedium: "IBMPlexMono-Medium",
  monoBold: "IBMPlexMono-Bold",
} as const;

export const Fonts = Platform.select({
  ios: appFonts,
  android: {
    sans: "sans-serif",
    mono: appFonts.mono,
    monoMedium: appFonts.monoMedium,
    monoBold: appFonts.monoBold,
  },
  default: appFonts,
});
