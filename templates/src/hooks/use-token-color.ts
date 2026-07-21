import { useUniwind } from "uniwind";

import {
  type ColorSchemeName,
  type ColorTokenName,
  colorSchemes,
  colorTokens,
} from "@/theme/tokens/generated/colors";

/**
 * Maps the active Uniwind theme to a semantic color palette.
 *
 * - Product schemes (`default`, `rider-tools`, …) → `colorSchemes[theme]`
 * - Appearance (`light` / `dark`) → `colorTokens.light` / `.dark`
 *
 * Prefer this over dynamic `accent-*` classNames — Uniwind cannot detect
 * `` `accent-${token}` `` at build time.
 */
export function resolveColorTokens(theme: string) {
  if (theme in colorSchemes) {
    return colorSchemes[theme as ColorSchemeName];
  }
  return colorTokens[theme === "dark" ? "dark" : "light"];
}

export function useColorTokens() {
  const { theme } = useUniwind();
  return resolveColorTokens(theme);
}

export function useTokenColor(token: ColorTokenName): string {
  return useColorTokens()[token];
}
