/* AUTO-GENERATED — do not edit. Run: bun run tokens:sync */
/**
 * Stub: tokenized typography — text-size-* + leading-* + font-Regular|Medium|Bold.
 * Phase B replaces with Figma keys; never emit hardcoded text-[Npx] / font-normal.
 */

export const typographyClassNames = {
  "global-body-base": "text-size-400 leading-md font-Regular lg:text-size-450",
  "global-body-small": "text-size-350 leading-md font-Regular lg:text-size-400",
  "global-body-small-bold": "text-size-350 leading-md font-Medium lg:text-size-400",
  "global-body-xxs": "text-size-250 leading-md font-Regular lg:text-size-300",
  "global-body-xxs-bold": "text-size-250 leading-md font-Medium lg:text-size-300",
  "global-underlined-links-base-link":
    "text-size-400 leading-md font-Bold lg:text-size-450 underline",
  "heading-app-section": "text-size-500 leading-md font-Bold lg:text-size-600",
} as const;

export type TypographyTokenName = keyof typeof typographyClassNames;
