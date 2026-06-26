/* AUTO-GENERATED — do not edit. Run: npm run tokens:generate */
/** Design token metadata for Storybook */

export const colorTokenGroups = {
  "text": [
    {
      "figmaName": "text/text-default",
      "tokenName": "text-text-default",
      "cssVar": "--color-text-text-default",
      "className": "bg-text-text-default",
      "light": "#333333",
      "dark": "#ffffff"
    },
    {
      "figmaName": "text/text-secondary",
      "tokenName": "text-text-secondary",
      "cssVar": "--color-text-text-secondary",
      "className": "bg-text-text-secondary",
      "light": "#666666",
      "dark": "#d9d9d9"
    },
    {
      "figmaName": "text/text-link",
      "tokenName": "text-text-link",
      "cssVar": "--color-text-text-link",
      "className": "bg-text-text-link",
      "light": "#183563",
      "dark": "#96dbf8"
    }
  ],
  "surface": [
    {
      "figmaName": "surface/default",
      "tokenName": "surface-default",
      "cssVar": "--color-surface-default",
      "className": "bg-surface-default",
      "light": "#ffffff",
      "dark": "#12284b"
    },
    {
      "figmaName": "surface/secondary",
      "tokenName": "surface-secondary",
      "cssVar": "--color-surface-secondary",
      "className": "bg-surface-secondary",
      "light": "#f8f3ed",
      "dark": "#16305a"
    },
    {
      "figmaName": "surface/tertiary",
      "tokenName": "surface-tertiary",
      "cssVar": "--color-surface-tertiary",
      "className": "bg-surface-tertiary",
      "light": "#f0f2f5",
      "dark": "#2d4a73"
    }
  ],
  "button": [
    {
      "figmaName": "button/button-primary",
      "tokenName": "button-button-primary",
      "cssVar": "--color-button-button-primary",
      "className": "bg-button-button-primary",
      "light": "#183563",
      "dark": "#96dbf8"
    }
  ],
  "stroke": [
    {
      "figmaName": "stroke/default",
      "tokenName": "stroke-default",
      "cssVar": "--color-stroke-default",
      "className": "bg-stroke-default",
      "light": "#6782ad",
      "dark": "#6782ad"
    }
  ]
} as const;

export type ColorTokenGroup = keyof typeof colorTokenGroups;

export const colorPrimitiveGroups = {
  "neutrals": [
    {
      "figmaName": "neutrals/black-20",
      "tokenName": "neutrals-black-20",
      "cssVar": "--primitive-neutrals-black-20",
      "value": "#333333"
    },
    {
      "figmaName": "neutrals/white",
      "tokenName": "neutrals-white",
      "cssVar": "--primitive-neutrals-white",
      "value": "#ffffff"
    }
  ]
} as const;

export type ColorPrimitiveGroup = keyof typeof colorPrimitiveGroups;

export const semanticColors = {
  light: {
    'text-text-default': '#333333',
    'text-text-secondary': '#666666',
    'text-text-link': '#183563',
    'surface-default': '#ffffff',
    'surface-secondary': '#f8f3ed',
    'surface-tertiary': '#f0f2f5',
    'button-button-primary': '#183563',
    'stroke-default': '#6782ad',
  },
  dark: {
    'text-text-default': '#ffffff',
    'text-text-secondary': '#d9d9d9',
    'text-text-link': '#96dbf8',
    'surface-default': '#12284b',
    'surface-secondary': '#16305a',
    'surface-tertiary': '#2d4a73',
    'button-button-primary': '#96dbf8',
    'stroke-default': '#6782ad',
  },
} as const;

export type SemanticColorName = keyof typeof semanticColors.light;

export const semanticColorClasses: Record<SemanticColorName, string> = {
  'text-text-default': 'bg-text-text-default',
  'text-text-secondary': 'bg-text-text-secondary',
  'text-text-link': 'bg-text-text-link',
  'surface-default': 'bg-surface-default',
  'surface-secondary': 'bg-surface-secondary',
  'surface-tertiary': 'bg-surface-tertiary',
  'button-button-primary': 'bg-button-button-primary',
  'stroke-default': 'bg-stroke-default',
};

export const spacingTokens = {
  "space-spacing-base": 16,
  "space-spacing-lg": 24,
  "space-spacing-sm": 12,
  "space-spacing-xs": 8,
  "space-spacing-2xs": 4
} as const;

export const radiusTokens = {
  "radius-panel": 8,
  "radius-input": 4
} as const;

export const sizePrimitiveGroups = {
  "space": [
    {
      "figmaName": "space/16",
      "tokenName": "space-16",
      "cssVar": "--primitive-space-16",
      "value": 16,
      "unit": "px"
    }
  ]
} as const;

export type SizePrimitiveGroup = keyof typeof sizePrimitiveGroups;

export const typographyPrimitiveGroups = {
  "font-family": [
    {
      "figmaName": "font-family/sans",
      "tokenName": "font-family-sans",
      "cssVar": "--primitive-font-family-sans",
      "value": "Helvetica Neue",
      "cssValue": "Helvetica Neue"
    }
  ]
} as const;

export type TypographyPrimitiveGroup = keyof typeof typographyPrimitiveGroups;

export const typographyTokenEntries = [
  {
    "path": "heading/rider tools/section",
    "key": "heading-rider-tools-section",
    "family": "Helvetica Neue",
    "size": 24,
    "weight": "700",
    "sizeSmMd": 20,
    "weightSmMd": "700"
  },
  {
    "path": "global/body/small",
    "key": "global-body-small",
    "family": "Helvetica Neue",
    "size": 16,
    "weight": "400",
    "sizeSmMd": 14,
    "weightSmMd": "400"
  },
  {
    "path": "global/body/small bold",
    "key": "global-body-small-bold",
    "family": "Helvetica Neue",
    "size": 16,
    "weight": "500",
    "sizeSmMd": 14,
    "weightSmMd": "500"
  },
  {
    "path": "global/body/xxs",
    "key": "global-body-xxs",
    "family": "Helvetica Neue",
    "size": 12,
    "weight": "400",
    "sizeSmMd": 10,
    "weightSmMd": "400"
  },
  {
    "path": "global/body/xxs bold",
    "key": "global-body-xxs-bold",
    "family": "Helvetica Neue",
    "size": 12,
    "weight": "500",
    "sizeSmMd": 10,
    "weightSmMd": "500"
  },
  {
    "path": "global/body/base",
    "key": "global-body-base",
    "family": "Helvetica Neue",
    "size": 18,
    "weight": "400",
    "sizeSmMd": 16,
    "weightSmMd": "400"
  },
  {
    "path": "global/underlined links/base link",
    "key": "global-underlined-links-base-link",
    "family": "Helvetica Neue",
    "size": 18,
    "weight": "700",
    "sizeSmMd": 16,
    "weightSmMd": "700"
  }
] as const;

export const fontFamilies = {
  sans: 'Helvetica Neue, Helvetica, Arial, system-ui, sans-serif',
  mono: 'IBM Plex Mono, ui-monospace, monospace',
} as const;

export const typographyVariants = [
  { name: 'global-body-base', label: 'global body base', size: 18, sizeSmMd: 16, lineHeight: 25, lineHeightSmMd: 22, weight: '400', weightSmMd: '400' },
  { name: 'global-body-small', label: 'global body small', size: 16, sizeSmMd: 14, lineHeight: 21, lineHeightSmMd: 18, weight: '400', weightSmMd: '400' },
  { name: 'global-body-small-bold', label: 'global body small bold', size: 16, sizeSmMd: 14, lineHeight: 21, lineHeightSmMd: 18, weight: '500', weightSmMd: '500' },
  { name: 'global-body-xxs', label: 'global body xxs', size: 12, sizeSmMd: 10, lineHeight: 12, lineHeightSmMd: 10, weight: '400', weightSmMd: '400' },
  { name: 'global-body-xxs-bold', label: 'global body xxs bold', size: 12, sizeSmMd: 10, lineHeight: 12, lineHeightSmMd: 10, weight: '500', weightSmMd: '500' },
  { name: 'global-underlined-links-base-link', label: 'global underlined links base link', size: 18, sizeSmMd: 16, lineHeight: 25, lineHeightSmMd: 22, weight: '700', weightSmMd: '700' },
  { name: 'heading-rider-tools-section', label: 'heading rider tools section', size: 24, sizeSmMd: 20, lineHeight: 31, lineHeightSmMd: 26, weight: '700', weightSmMd: '700' },
] as const;

export const tokenCounts = {
  colorTokens: 8,
  colorPrimitives: 2,
  sizeTokens: 8,
  sizePrimitives: 1,
  typographyTokens: 21,
  typographyPrimitives: 1,
  figmaTotal: 41,
  figmaPhasesSkipped: 2,
} as const;
