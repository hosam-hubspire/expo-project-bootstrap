import { useUniwind } from "uniwind";

import {
  type ColorTokenName,
  colorTokens,
} from "@/theme/tokens/generated/colors";

/**
 * Resolves a semantic color token to a hex string for native color props
 * (`color`, `tintColor`, etc.). Prefer this over dynamic `accent-*` classNames —
 * Uniwind cannot detect `` `accent-${token}` `` at build time.
 */
export function useTokenColor(token: ColorTokenName): string {
  const { theme } = useUniwind();
  const colors = colorTokens[theme === "dark" ? "dark" : "light"];
  return colors[token];
}
