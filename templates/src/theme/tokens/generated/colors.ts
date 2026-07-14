/* AUTO-GENERATED — do not edit. Run: bun run tokens:sync */
/**
 * Stub semantic colors keyed by Uniwind *appearance* (light/dark) for the default scaffold.
 * After Phase B (TOKEN_SYNC.md), prefer scheme-keyed maps (`colorSchemes.default`, …) for
 * Figma modes such as Default / Rider Tools — do not treat those modes as appearance dark.
 */

export const colorTokens = {
  light: {
  'text-text-default': '#333333',
  'text-text-secondary': '#666666',
  'text-text-link': '#183563',
  'surface-default': '#ffffff',
  'surface-secondary': '#f8f3ed',
  'surface-tertiary': '#f0f2f5',
  'button-button-primary': '#183563',
  'stroke-default': '#6782ad',
} as const,
  dark: {
  'text-text-default': '#ffffff',
  'text-text-secondary': '#d9d9d9',
  'text-text-link': '#96dbf8',
  'surface-default': '#12284b',
  'surface-secondary': '#16305a',
  'surface-tertiary': '#2d4a73',
  'button-button-primary': '#96dbf8',
  'stroke-default': '#6782ad',
} as const,
} as const;

export type ColorTokenName = keyof typeof colorTokens.light;
