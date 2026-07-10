/**
 * Design system — tokens and typography utilities.
 * CSS entry: src/global.css (must live under src/ — not theme/ — so Uniwind scans all classNames)
 * Regenerate tokens: bun run tokens:generate
 */

export { Fonts } from "@/theme/fonts";
export type { ColorTokenName } from "@/theme/tokens/generated/colors";
export type { TypographyTokenName } from "@/theme/tokens/generated/typography-classes";
export {
  accentColorClassName,
  bgClassName,
  colorClassName,
  isLinkVariant,
  typographyClassName,
} from "@/theme/typography";
