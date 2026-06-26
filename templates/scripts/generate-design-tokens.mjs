#!/usr/bin/env node
/**
 * Generate design tokens from Figma raw JSON exports and wire them to Uniwind.
 *
 * Configure the paths, mode names, and raw filenames below for your Figma file.
 * Run: bun run tokens:generate
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const RAW_DIR = path.join(ROOT, "src/theme/tokens/raw");
const OUT_DIR = path.join(ROOT, "src/theme/tokens/generated");
/** Storybook metadata — written only when a design-tokens story dir exists. */
function resolveStoryDefsPath() {
  const candidates = [
    path.join(ROOT, "src/stories/design-tokens/token-definitions.ts"),
    path.join(ROOT, "optional/src/stories/design-tokens/token-definitions.ts"),
  ];
  return candidates.find((candidate) => fs.existsSync(path.dirname(candidate))) ?? candidates[0];
}

/** Figma mode names — preferred labels; generator falls back when a mode is missing. Set to null to skip. */
const LIGHT_MODE = "Default";
const DARK_MODE = "Dark";
const SIZE_MODE_LG = "lg+";
const SIZE_MODE_MD = "md";
const SIZE_MODE_SM = "sm";
const TYPO_MODE_SM = "sm";
const TYPO_MODE_MD = "md";
const TYPO_MODE_SM_MD = "sm/md";
const TYPO_MODE_LG = "lg+";

/** Raw JSON filenames in src/theme/tokens/raw/ — rename to match your Figma exports. */
const RAW_FILES = {
  colorTokens: "color-tokens.json",
  colorPrimitives: "color-primitives.json",
  sizeTokens: "size-tokens.json",
  sizePrimitives: "size-primitives.json",
  typographyTokens: "typography-tokens.json",
  typographyPrimitives: "typography-primitives.json",
  textStyles: "text-styles.json",
};
/** Align with Uniwind default breakpoints (mobile-first). */
const BREAKPOINT_MD = 768;
const BREAKPOINT_LG = 1024;

/** Figma path → CSS-safe token segment: text/text-default → text-text-default */
function figmaToTokenName(figmaName) {
  return figmaName
    .toLowerCase()
    .replace(/\//g, "-")
    .replace(/\s+/g, "-")
    .replace(/\+/g, "plus")
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function figmaToCssVar(figmaName, prefix = "color") {
  return `--${prefix}-${figmaToTokenName(figmaName)}`;
}

function readJson(filename) {
  const filePath = path.join(RAW_DIR, filename);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing required raw token file: ${filePath}`);
  }
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function readOptionalJson(filename) {
  const filePath = path.join(RAW_DIR, filename);
  if (!fs.existsSync(filePath)) {
    console.log(`  skip missing optional raw file: ${path.relative(ROOT, filePath)}`);
    return { variables: [], modes: ["default"] };
  }
  return readJson(filename);
}

/** Pick a Figma mode when present; log and return null when the preferred name is absent. */
function pickMode(collection, preferred, label) {
  const resolved = pickModeSilent(collection, preferred);
  if (resolved == null && preferred != null && (collection.modes ?? []).length > 0) {
    console.log(
      `  note: ${label} mode "${preferred}" not in [${collection.modes.join(", ")}] — will fall back`,
    );
  }
  return resolved;
}

function pickModeSilent(collection, preferred) {
  if (preferred == null) return null;
  return (collection.modes ?? []).includes(preferred) ? preferred : null;
}

function resolveColorModes(colorTokens) {
  const modes = colorTokens.modes ?? [];
  const light = pickMode(colorTokens, LIGHT_MODE, "light") ?? modes[0] ?? null;
  let dark = DARK_MODE === null ? null : pickMode(colorTokens, DARK_MODE, "dark");

  if (dark == null && modes.length === 2 && light) {
    dark = modes.find((mode) => mode !== light) ?? null;
  }

  const hasDark = dark != null && dark !== light;
  if (!hasDark && DARK_MODE !== null) {
    console.log("  note: no separate dark color mode — emitting light values only");
  }

  return { light, dark: hasDark ? dark : null, hasDark };
}

/** Resolve sm/md/lg (or equivalent) dimension modes; single-mode collections skip breakpoints. */
function resolveDimensionModes(collection, preferred, label) {
  const modes = collection.modes ?? [];
  if (modes.length === 0) {
    return { base: null, md: null, lg: null };
  }
  if (modes.length === 1) {
    console.log(`  note: ${label} has one mode ("${modes[0]}") — no responsive overrides`);
    return { base: modes[0], md: null, lg: null };
  }

  const base =
    pickMode(collection, preferred.sm, `${label} base`) ??
    pickMode(collection, preferred.md, `${label} base`) ??
    modes[0];
  const md = pickMode(collection, preferred.md, `${label} md`);
  const lg = pickMode(collection, preferred.lg, `${label} lg`);

  if (md == null && lg == null) {
    console.log(`  note: ${label} has no md/lg modes — using "${base}" for all breakpoints`);
  }

  return { base, md, lg };
}

/**
 * Typography modes vary by project: separate sm/md/lg, combined sm/md + lg (this repo), or single mode.
 * Preferred mode names are tried first; combined sm/md fills in when sm or md is absent.
 */
function resolveTypographyModes(collection) {
  const modes = collection.modes ?? [];
  if (modes.length === 0) {
    return { sm: null, md: null, lg: null };
  }
  if (modes.length === 1) {
    console.log(`  note: typography has one mode ("${modes[0]}") — no responsive overrides`);
    return { sm: modes[0], md: null, lg: null };
  }

  let sm = pickModeSilent(collection, TYPO_MODE_SM);
  let md = pickModeSilent(collection, TYPO_MODE_MD);
  const lg = pickModeSilent(collection, TYPO_MODE_LG);
  const smMd = pickModeSilent(collection, TYPO_MODE_SM_MD);

  if (sm == null && smMd != null) sm = smMd;
  if (md == null && smMd != null) md = smMd;

  sm = sm ?? modes[0];

  if (md == null && lg == null) {
    console.log(`  note: typography has no md/lg modes — using "${sm}" for all breakpoints`);
  }

  return { sm, md, lg };
}

function appendTypographyDiff(parts, baseline, target, prefix) {
  if (target.fontSize !== baseline.fontSize) {
    parts.push(`${prefix}:text-[${target.fontSize}px]`);
  }
  if (target.lineHeight !== baseline.lineHeight) {
    parts.push(`${prefix}:leading-[${target.lineHeight}px]`);
  }
  if (target.fontWeight !== baseline.fontWeight) {
    parts.push(`${prefix}:${fontWeightToTailwind(target.fontWeight)}`);
  }
  if (target.fontFamily !== baseline.fontFamily) {
    parts.push(`${prefix}:${target.fontFamily === "mono" ? "font-mono" : "font-sans"}`);
  }
}

function modeValue(values, mode) {
  if (mode == null || values == null) return null;
  return values[mode] ?? null;
}

function getCategory(figmaName) {
  const top = figmaName.split("/")[0].toLowerCase();
  if (top === "special vehicles") return "special-vehicles";
  return top.replace(/\s+/g, "-");
}

function fontWeightToCss(weight) {
  const map = {
    Thin: "100",
    UltraLight: "200",
    Light: "300",
    Regular: "400",
    Medium: "500",
    Bold: "700",
    "Semi Bold": "600",
  };
  return map[weight] ?? "400";
}

function lineHeightFromStyle(style, fontSize) {
  if (!style?.lineHeight) return Math.round(fontSize * 1.3);
  const lh = style.lineHeight;
  if (lh.unit === "AUTO") return Math.round(fontSize * 1.3);
  if (lh.unit === "PERCENT") return Math.round((fontSize * lh.value) / 100);
  if (lh.unit === "PIXELS") return Math.round(lh.value);
  return Math.round(fontSize * 1.3);
}

function groupTypographyTokens(variables, mode) {
  const groups = {};
  for (const v of variables) {
    const match = v.name.match(/^(.+)\/(font-family|font-size|font-weight)$/);
    if (!match) continue;
    const [, groupPath, prop] = match;
    if (!groups[groupPath]) groups[groupPath] = {};
    groups[groupPath][prop.replace("font-", "")] = v.values[mode];
  }
  return groups;
}

function sizeToCssVarName(figmaName) {
  if (figmaName.startsWith("space/spacing-")) {
    return `spacing-${figmaName.replace("space/spacing-", "")}`;
  }
  if (figmaName.startsWith("radius/")) {
    return `radius-${figmaName.replace("radius/", "")}`;
  }
  return figmaToTokenName(figmaName);
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeFile(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, "utf8");
  console.log(`  wrote ${path.relative(ROOT, filePath)}`);
}

// ─── Generators ─────────────────────────────────────────────────────────────

function generateThemeCss(colorTokens, colorModes) {
  const lines = [
    "/* AUTO-GENERATED — do not edit. Run: npm run tokens:generate */",
    "/* Design tokens → Uniwind @variant light / dark */",
    "",
    "@layer theme {",
    "  :root {",
    "    @variant light {",
  ];

  for (const v of colorTokens.variables) {
    const cssVar = figmaToCssVar(v.name);
    const value = modeValue(v.values, colorModes.light);
    if (value != null) lines.push(`      ${cssVar}: ${value};`);
  }

  lines.push("    }");

  if (colorModes.hasDark) {
    lines.push("", "    @variant dark {");
    for (const v of colorTokens.variables) {
      const cssVar = figmaToCssVar(v.name);
      const value = modeValue(v.values, colorModes.dark);
      if (value != null) lines.push(`      ${cssVar}: ${value};`);
    }
    lines.push("    }");
  }

  lines.push("  }", "}", "");
  return lines.join("\n");
}

function primitiveCssValue(v, value) {
  if (value == null) return null;
  if (v.type === "FLOAT") return `${value}px`;
  return value;
}

function generatePrimitivesCss(colorPrimitives, sizePrimitives) {
  const lines = [
    "/* AUTO-GENERATED — do not edit. Run: npm run tokens:generate */",
    "/* Color + size primitives (static) */",
    "",
    ":root {",
  ];

  const colorMode = colorPrimitives.modes[0];
  for (const v of colorPrimitives.variables) {
    const cssVar = figmaToCssVar(v.name, "primitive");
    const value = v.values[colorMode];
    if (value != null) lines.push(`  ${cssVar}: ${value};`);
  }

  const sizeMode = sizePrimitives.modes[0];
  for (const v of sizePrimitives.variables) {
    const cssVar = figmaToCssVar(v.name, "primitive");
    const cssValue = primitiveCssValue(v, v.values[sizeMode]);
    if (cssValue != null) lines.push(`  ${cssVar}: ${cssValue};`);
  }

  lines.push("}", "");
  return lines.join("\n");
}

function generateTypographyPrimitivesCss(typographyPrimitives) {
  const lines = [
    "/* AUTO-GENERATED — do not edit. Run: npm run tokens:generate */",
    "/* Typography primitives (static) */",
    "",
    ":root {",
  ];

  const mode = typographyPrimitives.modes[0];
  for (const v of typographyPrimitives.variables) {
    const cssVar = figmaToCssVar(v.name, "primitive");
    const value = v.values[mode];
    if (value == null) continue;
    if (v.type === "FLOAT" && v.name.startsWith("size/")) {
      lines.push(`  ${cssVar}: ${value}px;`);
    } else if (v.type === "FLOAT" && v.name.startsWith("leading/")) {
      lines.push(`  ${cssVar}: ${value};`);
    } else if (v.type === "STRING" && v.name.startsWith("weight/")) {
      lines.push(`  ${cssVar}: ${fontWeightToCss(value)};`);
    } else if (v.type === "STRING" && v.name.startsWith("family/")) {
      lines.push(`  ${cssVar}: "${value}";`);
    } else {
      lines.push(`  ${cssVar}: ${value};`);
    }
  }

  lines.push("}", "");
  return lines.join("\n");
}

function generateTypographyPrimitivesTs(typographyPrimitives) {
  const mode = typographyPrimitives.modes[0];
  const families = {};
  const sizes = {};
  const leadings = {};
  const weights = {};

  for (const v of typographyPrimitives.variables) {
    const key = v.name.split("/").slice(1).join("-");
    const value = v.values[mode];
    if (value == null) continue;
    if (v.name.startsWith("family/")) families[key] = value;
    else if (v.name.startsWith("size/")) sizes[key] = value;
    else if (v.name.startsWith("leading/")) leadings[key] = value;
    else if (v.name.startsWith("weight/")) weights[key] = fontWeightToCss(value);
  }

  return `/* AUTO-GENERATED — do not edit. Run: npm run tokens:generate */
/** Typography primitives resolved from Figma exports */

export const typographyPrimitiveFamilies = ${JSON.stringify(families, null, 2)} as const;

export const typographyPrimitiveSizes = ${JSON.stringify(sizes, null, 2)} as const;

export const typographyPrimitiveLeadings = ${JSON.stringify(leadings, null, 2)} as const;

export const typographyPrimitiveWeights = ${JSON.stringify(weights, null, 2)} as const;
`;
}

function collectSizeTokenValues(sizeTokens, sizeModes) {
  const sm = {};
  const mdOverrides = {};
  const lgOverrides = {};

  for (const v of sizeTokens.variables) {
    const baseName = sizeToCssVarName(v.name);
    const smValue = modeValue(v.values, sizeModes.base);
    const mdValue = sizeModes.md ? modeValue(v.values, sizeModes.md) : null;
    const lgValue = sizeModes.lg ? modeValue(v.values, sizeModes.lg) : null;
    if (smValue == null) continue;

    sm[baseName] = smValue;
    if (mdValue != null && mdValue !== smValue) {
      mdOverrides[baseName] = mdValue;
    }
    const mdBaseline = mdValue ?? smValue;
    if (lgValue != null && lgValue !== mdBaseline) {
      lgOverrides[baseName] = lgValue;
    }
  }

  return { sm, mdOverrides, lgOverrides };
}

function generateSpacingCss(sizeTokens, sizeModes) {
  const { sm, mdOverrides, lgOverrides } = collectSizeTokenValues(sizeTokens, sizeModes);
  const hasBreakpoints = sizeModes.md != null || sizeModes.lg != null;
  const lines = [
    "/* AUTO-GENERATED — do not edit. Run: npm run tokens:generate */",
    hasBreakpoints
      ? `/* Size/spacing tokens — mobile-first (base default, md ≥${BREAKPOINT_MD}px, lg ≥${BREAKPOINT_LG}px) */`
      : "/* Size/spacing tokens — single Figma mode (no breakpoint overrides) */",
    "",
    ":root {",
  ];

  for (const [baseName, value] of Object.entries(sm).sort(([a], [b]) => a.localeCompare(b))) {
    lines.push(`  --${baseName}: ${value}px;`);
  }

  lines.push("}", "");

  if (Object.keys(mdOverrides).length > 0) {
    lines.push(`@media (min-width: ${BREAKPOINT_MD}px) {`, "  :root {");
    for (const [baseName, value] of Object.entries(mdOverrides).sort(([a], [b]) =>
      a.localeCompare(b),
    )) {
      lines.push(`    --${baseName}: ${value}px;`);
    }
    lines.push("  }", "}", "");
  }

  if (Object.keys(lgOverrides).length > 0) {
    lines.push(`@media (min-width: ${BREAKPOINT_LG}px) {`, "  :root {");
    for (const [baseName, value] of Object.entries(lgOverrides).sort(([a], [b]) =>
      a.localeCompare(b),
    )) {
      lines.push(`    --${baseName}: ${value}px;`);
    }
    lines.push("  }", "}", "");
  }

  return lines.join("\n");
}

function toTsObject(obj, indent = 2) {
  const pad = " ".repeat(indent);
  const lines = Object.entries(obj).map(([k, v]) => `${pad}'${k}': '${v}',`);
  return `{\n${lines.join("\n")}\n${" ".repeat(indent - 2)}}`;
}

function generateColorsTs(colorTokens, colorModes) {
  const light = {};
  const dark = {};

  for (const v of colorTokens.variables) {
    const key = figmaToTokenName(v.name);
    const lightValue = modeValue(v.values, colorModes.light);
    light[key] = lightValue;
    dark[key] = colorModes.hasDark ? modeValue(v.values, colorModes.dark) : lightValue;
  }

  return (
    `/* AUTO-GENERATED — do not edit. Run: npm run tokens:generate */` +
    `
/** Semantic color tokens resolved from Figma color collections */

export const colorTokens = {
  light: ${toTsObject(light)} as const,
  dark: ${toTsObject(dark)} as const,
} as const;

export type ColorTokenName = keyof typeof colorTokens.light;
`
  );
}

function groupPathToTextStyleName(groupPath) {
  const overrides = {
    "global/body/xs": "Global/Body/XS",
    "global/body/xs bold": "Global/Body/XS Bold",
    "global/body/xxs": "Global/Body/XXS",
    "global/body/xxs bold": "Global/Body/XXS Bold",
    "heading/app/page title": "App/Heading/Page title",
    "heading/app/section": "App/Heading/Section",
  };
  if (overrides[groupPath]) return overrides[groupPath];

  if (groupPath.startsWith("heading/app/")) {
    const rest = groupPath.replace("heading/app/", "");
    const titleCase = rest.replace(/\b\w/g, (c) => c.toUpperCase());
    return `App/Heading/${titleCase}`;
  }
  if (groupPath.startsWith("heading/web/")) {
    const rest = groupPath.replace("heading/web/", "");
    if (rest.startsWith("tile/")) {
      const tile = rest.replace("tile/", "");
      return `Web/Heading/Tiles/${tile.charAt(0).toUpperCase() + tile.slice(1)}`;
    }
    const titleCase = rest.replace(/\b\w/g, (c) => c.toUpperCase());
    return `Web/Heading/${titleCase}`;
  }
  if (groupPath.startsWith("global/body/")) {
    const rest = groupPath.replace("global/body/", "");
    const titleCase = rest.replace(/\b\w/g, (c) => c.toUpperCase());
    return `Global/Body/${titleCase}`;
  }
  if (groupPath.startsWith("global/underlined links/")) {
    const rest = groupPath.replace("global/underlined links/", "");
    const titleCase = rest.replace(/\b\w/g, (c) => c.toUpperCase());
    return `Global/Underlined Links/${titleCase}`;
  }
  return null;
}

function buildTypographyTokens(typographyTokens, textStyles, mode) {
  const groups = groupTypographyTokens(typographyTokens.variables, mode);

  const styleMap = {};
  for (const s of textStyles) {
    styleMap[s.name] = s;
  }

  const entries = [];

  for (const [groupPath, g] of Object.entries(groups).sort(([a], [b]) => a.localeCompare(b))) {
    const exportKey = figmaToTokenName(groupPath);
    const fontSize = g.size ?? 16;
    const styleName = groupPathToTextStyleName(groupPath);
    const textStyle = styleName ? styleMap[styleName] : undefined;
    const lineHeight = textStyle
      ? lineHeightFromStyle(textStyle, fontSize)
      : Math.round(fontSize * 1.3);
    entries.push([
      exportKey,
      {
        fontSize,
        lineHeight,
        fontWeight: fontWeightToCss(g.weight ?? "Regular"),
        fontFamily: g.family === "IBM Plex Mono" ? "mono" : "sans",
      },
    ]);
  }

  return Object.fromEntries(entries);
}

function fontWeightToTailwind(weight) {
  const map = {
    100: "font-thin",
    200: "font-extralight",
    300: "font-light",
    400: "font-normal",
    500: "font-medium",
    600: "font-semibold",
    700: "font-bold",
  };
  return map[weight] ?? "font-normal";
}

function generateTypographyClassNames(typographySm, typographyMd, typographyLg, typoModes) {
  const classNames = {};
  const hasMd = typoModes.md != null && typoModes.md !== typoModes.sm;
  const lgBaselineKey = hasMd ? typoModes.md : typoModes.sm;
  const hasLg = typoModes.lg != null && typoModes.lg !== lgBaselineKey;

  const breakpointNotes = [];
  if (hasMd) breakpointNotes.push(`md: at ${BREAKPOINT_MD}px`);
  if (hasLg) breakpointNotes.push(`lg: at ${BREAKPOINT_LG}px`);
  const breakpointComment =
    breakpointNotes.length > 0
      ? ` — mobile-first ${breakpointNotes.join(", ")} (Uniwind)`
      : " (single Figma mode)";

  for (const [name, sm] of Object.entries(typographySm)) {
    const md = typographyMd[name] ?? sm;
    const lg = typographyLg[name] ?? md;
    const parts = [
      `text-[${sm.fontSize}px]`,
      `leading-[${sm.lineHeight}px]`,
      fontWeightToTailwind(sm.fontWeight),
      sm.fontFamily === "mono" ? "font-mono" : "font-sans",
    ];

    if (name.includes("underlined-links")) {
      parts.push("underline");
    }

    if (hasMd) {
      appendTypographyDiff(parts, sm, md, "md");
    }
    if (hasLg) {
      appendTypographyDiff(parts, hasMd ? md : sm, lg, "lg");
    }

    classNames[name] = parts.join(" ");
  }

  return (
    `/* AUTO-GENERATED — do not edit. Run: npm run tokens:generate */` +
    `
/** Responsive typography classNames — mobile-first${breakpointComment} */

export const typographyClassNames = ${JSON.stringify(classNames, null, 2)} as const;

export type TypographyTokenName = keyof typeof typographyClassNames;
`
  );
}

function generateTokenDefinitionsClean(
  colorTokens,
  colorPrimitives,
  sizeTokens,
  typographyTokens,
  sizePrimitives,
  typographyPrimitives,
  typographySm,
  typographyMd,
  typographyLg,
  colorModes,
  sizeModes,
  typoModes,
) {
  const colorGroups = {};
  for (const v of colorTokens.variables) {
    const cat = getCategory(v.name);
    if (!colorGroups[cat]) colorGroups[cat] = [];
    colorGroups[cat].push({
      figmaName: v.name,
      tokenName: figmaToTokenName(v.name),
      cssVar: figmaToCssVar(v.name),
      className: `bg-${figmaToTokenName(v.name)}`,
      light: modeValue(v.values, colorModes.light),
      dark: colorModes.hasDark
        ? modeValue(v.values, colorModes.dark)
        : modeValue(v.values, colorModes.light),
    });
  }

  const primitiveGroups = {};
  for (const v of colorPrimitives.variables) {
    const cat = getCategory(v.name);
    if (!primitiveGroups[cat]) primitiveGroups[cat] = [];
    const mode = colorPrimitives.modes[0];
    primitiveGroups[cat].push({
      figmaName: v.name,
      tokenName: figmaToTokenName(v.name),
      cssVar: figmaToCssVar(v.name, "primitive"),
      value: v.values[mode],
    });
  }

  const spacingMode = sizeModes.lg ?? sizeModes.md ?? sizeModes.base;
  const spacingEntries = {};
  const radiusEntries = {};
  for (const v of sizeTokens.variables) {
    const resolved = modeValue(v.values, spacingMode);
    if (v.name.startsWith("space/spacing-")) {
      spacingEntries[figmaToTokenName(v.name)] = resolved;
    } else if (v.name.startsWith("radius/")) {
      radiusEntries[figmaToTokenName(v.name)] = resolved;
    }
  }

  const sizePrimitiveGroups = {};
  const sizeMode = sizePrimitives.modes[0];
  for (const v of sizePrimitives.variables) {
    const cat = getCategory(v.name);
    if (!sizePrimitiveGroups[cat]) sizePrimitiveGroups[cat] = [];
    sizePrimitiveGroups[cat].push({
      figmaName: v.name,
      tokenName: figmaToTokenName(v.name),
      cssVar: figmaToCssVar(v.name, "primitive"),
      value: v.values[sizeMode],
      unit: v.type === "FLOAT" ? "px" : undefined,
    });
  }

  const typographyPrimitiveGroups = {};
  const typoPrimitiveMode = typographyPrimitives.modes[0];
  for (const v of typographyPrimitives.variables) {
    const cat = getCategory(v.name);
    if (!typographyPrimitiveGroups[cat]) typographyPrimitiveGroups[cat] = [];
    const rawValue = v.values[typoPrimitiveMode];
    const value = rawValue;
    let cssValue = rawValue;
    if (v.type === "FLOAT" && v.name.startsWith("size/")) {
      cssValue = `${rawValue}px`;
    } else if (v.type === "STRING" && v.name.startsWith("weight/")) {
      cssValue = fontWeightToCss(rawValue);
    }
    typographyPrimitiveGroups[cat].push({
      figmaName: v.name,
      tokenName: figmaToTokenName(v.name),
      cssVar: figmaToCssVar(v.name, "primitive"),
      value,
      cssValue,
    });
  }

  const typoGroupsSm = groupTypographyTokens(typographyTokens.variables, typoModes.sm);
  const typoGroupsMd = typoModes.md
    ? groupTypographyTokens(typographyTokens.variables, typoModes.md)
    : typoGroupsSm;
  const typoGroupsLg = typoModes.lg
    ? groupTypographyTokens(typographyTokens.variables, typoModes.lg)
    : typoGroupsMd;
  const typographyEntries = Object.entries(typoGroupsLg).map(([p, props]) => ({
    path: p,
    key: figmaToTokenName(p),
    family: props.family,
    size: props.size,
    weight: fontWeightToCss(props.weight ?? "Regular"),
    sizeSmMd: typoGroupsSm[p]?.size ?? typoGroupsMd[p]?.size,
    weightSmMd: fontWeightToCss(typoGroupsSm[p]?.weight ?? typoGroupsMd[p]?.weight ?? "Regular"),
  }));

  const lightLines = colorTokens.variables
    .map((v) => `    '${figmaToTokenName(v.name)}': '${modeValue(v.values, colorModes.light)}',`)
    .join("\n");
  const darkLines = colorTokens.variables
    .map((v) => {
      const value = colorModes.hasDark
        ? modeValue(v.values, colorModes.dark)
        : modeValue(v.values, colorModes.light);
      return `    '${figmaToTokenName(v.name)}': '${value}',`;
    })
    .join("\n");
  const classLines = colorTokens.variables
    .map((v) => `  '${figmaToTokenName(v.name)}': 'bg-${figmaToTokenName(v.name)}',`)
    .join("\n");

  return `/* AUTO-GENERATED — do not edit. Run: npm run tokens:generate */
/** Design token metadata for Storybook */

export const colorTokenGroups = ${JSON.stringify(colorGroups, null, 2)} as const;

export type ColorTokenGroup = keyof typeof colorTokenGroups;

export const colorPrimitiveGroups = ${JSON.stringify(primitiveGroups, null, 2)} as const;

export type ColorPrimitiveGroup = keyof typeof colorPrimitiveGroups;

export const semanticColors = {
  light: {
${lightLines}
  },
  dark: {
${darkLines}
  },
} as const;

export type SemanticColorName = keyof typeof semanticColors.light;

export const semanticColorClasses: Record<SemanticColorName, string> = {
${classLines}
};

export const spacingTokens = ${JSON.stringify(spacingEntries, null, 2)} as const;

export const radiusTokens = ${JSON.stringify(radiusEntries, null, 2)} as const;

export const sizePrimitiveGroups = ${JSON.stringify(sizePrimitiveGroups, null, 2)} as const;

export type SizePrimitiveGroup = keyof typeof sizePrimitiveGroups;

export const typographyPrimitiveGroups = ${JSON.stringify(typographyPrimitiveGroups, null, 2)} as const;

export type TypographyPrimitiveGroup = keyof typeof typographyPrimitiveGroups;

export const typographyTokenEntries = ${JSON.stringify(typographyEntries, null, 2)} as const;

export const fontFamilies = {
  sans: 'Helvetica Neue, Helvetica, Arial, system-ui, sans-serif',
  mono: 'IBM Plex Mono, ui-monospace, monospace',
} as const;

export const typographyVariants = [
${Object.entries(typographyLg)
  .map(([name, token]) => {
    const sm = typographySm[name];
    const md = typographyMd[name] ?? sm;
    return `  { name: '${name}', label: '${name.replace(/-/g, " ")}', size: ${token.fontSize}, sizeSmMd: ${md.fontSize}, lineHeight: ${token.lineHeight}, lineHeightSmMd: ${md.lineHeight}, weight: '${token.fontWeight}', weightSmMd: '${md.fontWeight}' },`;
  })
  .join("\n")}
] as const;

export const tokenCounts = {
  colorTokens: ${colorTokens.variables.length},
  colorPrimitives: ${colorPrimitives.variables.length},
  sizeTokens: ${sizeTokens.variables.length},
  sizePrimitives: ${sizePrimitives.variables.length},
  typographyTokens: ${typographyTokens.variables.length},
  typographyPrimitives: ${typographyPrimitives.variables.length},
  figmaTotal: ${
    colorTokens.variables.length +
    colorPrimitives.variables.length +
    sizeTokens.variables.length +
    sizePrimitives.variables.length +
    typographyTokens.variables.length +
    typographyPrimitives.variables.length
  },
  figmaPhasesSkipped: 2,
} as const;
`;
}

// ─── Main ───────────────────────────────────────────────────────────────────

function main() {
  console.log("Generating design tokens from Figma raw exports...\n");

  const colorTokens = readJson(RAW_FILES.colorTokens);
  const colorPrimitives = readOptionalJson(RAW_FILES.colorPrimitives);
  const sizeTokens = readJson(RAW_FILES.sizeTokens);
  const sizePrimitives = readOptionalJson(RAW_FILES.sizePrimitives);
  const typographyTokens = readJson(RAW_FILES.typographyTokens);
  const typographyPrimitives = readOptionalJson(RAW_FILES.typographyPrimitives);
  const textStylesPath = path.join(RAW_DIR, RAW_FILES.textStyles);
  const textStyles = fs.existsSync(textStylesPath) ? readJson(RAW_FILES.textStyles) : [];

  const colorModes = resolveColorModes(colorTokens);
  const sizeModes = resolveDimensionModes(
    sizeTokens,
    { sm: SIZE_MODE_SM, md: SIZE_MODE_MD, lg: SIZE_MODE_LG },
    "size",
  );
  const typoModes = resolveTypographyModes(typographyTokens);

  console.log("\nResolved Figma modes:");
  console.log(
    `  colors: light="${colorModes.light}"${colorModes.hasDark ? `, dark="${colorModes.dark}"` : " (light only)"}`,
  );
  console.log(
    `  size: base="${sizeModes.base}"${sizeModes.md ? `, md="${sizeModes.md}"` : ""}${sizeModes.lg ? `, lg="${sizeModes.lg}"` : ""}`,
  );
  console.log(
    `  typography: sm="${typoModes.sm}"${typoModes.md && typoModes.md !== typoModes.sm ? `, md="${typoModes.md}"` : ""}${typoModes.lg ? `, lg="${typoModes.lg}"` : ""}`,
  );

  ensureDir(OUT_DIR);

  writeFile(path.join(OUT_DIR, "theme.css"), generateThemeCss(colorTokens, colorModes));
  writeFile(
    path.join(OUT_DIR, "primitives.css"),
    generatePrimitivesCss(colorPrimitives, sizePrimitives),
  );
  writeFile(
    path.join(OUT_DIR, "typography-primitives.css"),
    generateTypographyPrimitivesCss(typographyPrimitives),
  );
  writeFile(path.join(OUT_DIR, "spacing.css"), generateSpacingCss(sizeTokens, sizeModes));
  writeFile(path.join(OUT_DIR, "colors.ts"), generateColorsTs(colorTokens, colorModes));
  const typographySm = buildTypographyTokens(typographyTokens, textStyles, typoModes.sm);
  const typographyMd = typoModes.md
    ? buildTypographyTokens(typographyTokens, textStyles, typoModes.md)
    : typographySm;
  const typographyLg = typoModes.lg
    ? buildTypographyTokens(typographyTokens, textStyles, typoModes.lg)
    : typographyMd;
  writeFile(
    path.join(OUT_DIR, "typography-classes.ts"),
    generateTypographyClassNames(typographySm, typographyMd, typographyLg, typoModes),
  );
  writeFile(
    path.join(OUT_DIR, "typography-primitives.ts"),
    generateTypographyPrimitivesTs(typographyPrimitives),
  );
  const storyDefsPath = resolveStoryDefsPath();
  if (fs.existsSync(path.dirname(storyDefsPath))) {
    writeFile(
      storyDefsPath,
      generateTokenDefinitionsClean(
        colorTokens,
        colorPrimitives,
        sizeTokens,
        typographyTokens,
        sizePrimitives,
        typographyPrimitives,
        typographySm,
        typographyMd,
        typographyLg,
        colorModes,
        sizeModes,
        typoModes,
      ),
    );
  } else {
    console.log(`  skip Storybook metadata: no design-tokens story dir`);
  }

  const totalTokens =
    colorTokens.variables.length +
    colorPrimitives.variables.length +
    sizeTokens.variables.length +
    sizePrimitives.variables.length +
    typographyTokens.variables.length +
    typographyPrimitives.variables.length;

  console.log("\nToken counts:");
  console.log(`  Color Tokens:           ${colorTokens.variables.length}`);
  console.log(`  Color Primitives:       ${colorPrimitives.variables.length}`);
  console.log(`  Size Tokens:            ${sizeTokens.variables.length}`);
  console.log(`  Size Primitives:        ${sizePrimitives.variables.length}`);
  console.log(`  Typography Tokens:      ${typographyTokens.variables.length}`);
  console.log(`  Typography Primitives:  ${typographyPrimitives.variables.length}`);
  console.log(`  Total in code:          ${totalTokens}`);
  console.log("\nDone.");
}

main();
