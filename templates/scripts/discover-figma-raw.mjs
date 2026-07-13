#!/usr/bin/env node
/**
 * Discover Figma variable/text-style exports under src/theme/tokens/raw/.
 * Filenames and folder names are hints only — classification uses JSON shape + content.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROLES = [
  "colorTokens",
  "colorPrimitives",
  "sizeTokens",
  "sizePrimitives",
  "typographyTokens",
  "typographyPrimitives",
  "textStyles",
];

const REQUIRED_ROLES = ["colorTokens", "sizeTokens", "typographyTokens"];

/** @typedef {{ relative: string, absolute: string, data: unknown, kind: 'collection' | 'textStyles' | 'unknown' }} RawEntry */

export function walkRawJsonFiles(rawDir) {
  if (!fs.existsSync(rawDir)) return [];

  /** @type {RawEntry[]} */
  const entries = [];

  function walk(dir) {
    for (const dirent of fs.readdirSync(dir, { withFileTypes: true })) {
      if (dirent.name.startsWith(".")) continue;
      if (dirent.name === "README.md") continue;
      const absolute = path.join(dir, dirent.name);
      if (dirent.isDirectory()) {
        walk(absolute);
        continue;
      }
      if (!dirent.name.endsWith(".json")) continue;
      const relative = path.relative(rawDir, absolute);
      let data;
      try {
        data = JSON.parse(fs.readFileSync(absolute, "utf8"));
      } catch {
        console.log(`  skip invalid JSON: ${relative}`);
        continue;
      }
      entries.push({ relative, absolute, data, kind: detectKind(data) });
    }
  }

  walk(rawDir);
  return entries;
}

function detectKind(data) {
  if (Array.isArray(data) && data.length > 0 && typeof data[0]?.fontFamily === "string") {
    return "textStyles";
  }
  if (data && Array.isArray(data.variables) && Array.isArray(data.modes)) {
    return "collection";
  }
  return "unknown";
}

function hintText(collectionName, relativePath) {
  return `${collectionName ?? ""} ${relativePath}`.toLowerCase().replace(/[_-]+/g, " ");
}

function variableTypes(variables) {
  return new Set((variables ?? []).map((v) => v.type).filter(Boolean));
}

function nameSample(variables) {
  return (variables ?? [])
    .slice(0, 8)
    .map((v) => v.name ?? "")
    .join(" ")
    .toLowerCase();
}

/** @returns {number} */
function scoreRole(role, entry) {
  if (entry.kind === "textStyles") return role === "textStyles" ? 100 : -100;

  if (entry.kind !== "collection") return -100;

  const { data, relative } = entry;
  const hint = hintText(data.collection, relative);
  const types = variableTypes(data.variables);
  const modes = data.modes ?? [];
  const names = nameSample(data.variables);
  let score = 0;

  const isPrimitive = /\bprimitive/.test(hint);
  const isToken = /\btoken/.test(hint) || /\bsemantic/.test(hint);

  if (role === "textStyles") return -100;

  if (types.has("COLOR")) {
    if (role === "colorPrimitives") score += isPrimitive ? 30 : 5;
    if (role === "colorTokens") score += isToken ? 30 : 10;
    if (role === "colorTokens" && modes.length >= 2) score += 15;
    if (role === "colorPrimitives" && modes.length <= 1) score += 10;
    if (role.startsWith("size") || role.startsWith("typography")) score -= 40;
    return score;
  }

  if (types.has("FLOAT") && !types.has("STRING")) {
    const sizey = /space|radius|padding|stroke|size|dimension/.test(`${hint} ${names}`);
    if (role === "sizePrimitives") score += isPrimitive ? 30 : 8;
    if (role === "sizeTokens") score += isToken ? 30 : sizey ? 20 : 8;
    if (role === "sizeTokens" && modes.length >= 2) score += 12;
    if (role === "sizePrimitives" && modes.length <= 1) score += 8;
    if (!role.startsWith("size")) score -= 40;
    return score;
  }

  if (
    types.has("STRING") ||
    /font|typography|leading|weight|family|body|heading|link/.test(names)
  ) {
    if (role === "typographyPrimitives")
      score += isPrimitive ? 30 : /family|leading|weight|size\//.test(names) ? 25 : 8;
    if (role === "typographyTokens")
      score += isToken ? 30 : /body|heading|link|global/.test(names) ? 25 : 10;
    if (role === "typographyTokens" && modes.length >= 2) score += 12;
    if (!role.startsWith("typography")) score -= 40;
    return score;
  }

  return -100;
}

/** @param {RawEntry[]} entries @param {Record<string, string | null | undefined>} overrides */
export function discoverRawExports(rawDir, overrides = {}) {
  const entries = walkRawJsonFiles(rawDir);
  /** @type {Record<string, string | null>} */
  const paths = {};
  /** @type {Record<string, RawEntry | null>} */
  const matched = {};
  const used = new Set();

  for (const role of ROLES) {
    paths[role] = null;
    matched[role] = null;
  }

  for (const role of ROLES) {
    const override = overrides[role];
    if (override) {
      const absolute = path.join(rawDir, override);
      if (!fs.existsSync(absolute)) {
        throw new Error(`RAW override missing for ${role}: ${override}`);
      }
      paths[role] = override;
      matched[role] = entries.find((e) => e.relative === override) ?? {
        relative: override,
        absolute,
        data: JSON.parse(fs.readFileSync(absolute, "utf8")),
        kind: detectKind(JSON.parse(fs.readFileSync(absolute, "utf8"))),
      };
      used.add(override);
    }
  }

  const assignOrder = [
    ...REQUIRED_ROLES,
    ...ROLES.filter((r) => !REQUIRED_ROLES.includes(r) && !overrides[r]),
  ];

  for (const role of assignOrder) {
    if (paths[role]) continue;

    let best = null;
    let bestScore = -Infinity;
    for (const entry of entries) {
      if (used.has(entry.relative)) continue;
      const score = scoreRole(role, entry);
      if (score > bestScore) {
        bestScore = score;
        best = entry;
      }
    }

    if (best && bestScore > 0) {
      paths[role] = best.relative;
      matched[role] = best;
      used.add(best.relative);
    }
  }

  return { paths, matched, entries };
}

export function suggestModeConstants(matched) {
  const color = matched.colorTokens?.data;
  const size = matched.sizeTokens?.data;
  const typo = matched.typographyTokens?.data;

  const suggestions = {};

  if (color?.modes?.length) {
    const modes = color.modes;
    const lightPref = ["Default", "Light", "Mode 1"];
    const darkPref = ["Dark", "Rider Tools", "Dark Mode"];
    suggestions.LIGHT_MODE = modes.find((m) => lightPref.includes(m)) ?? modes[0] ?? "Default";
    suggestions.DARK_MODE =
      modes.find((m) => darkPref.includes(m) && m !== suggestions.LIGHT_MODE) ??
      (modes.length === 2 ? modes.find((m) => m !== suggestions.LIGHT_MODE) : null) ??
      "Dark";
  }

  if (size?.modes?.length) {
    const modes = size.modes;
    suggestions.SIZE_MODE_SM = modes.find((m) => /^sm$/i.test(m) || m === "sm") ?? modes[0];
    suggestions.SIZE_MODE_MD = modes.find((m) => /^md$/i.test(m)) ?? modes[1] ?? null;
    suggestions.SIZE_MODE_LG =
      modes.find((m) => /lg\+?/i.test(m)) ?? modes[modes.length - 1] ?? null;
  }

  if (typo?.modes?.length) {
    const modes = typo.modes;
    suggestions.TYPO_MODE_SM = modes.find((m) => m === "sm") ?? modes[0];
    suggestions.TYPO_MODE_MD = modes.find((m) => m === "md") ?? null;
    suggestions.TYPO_MODE_SM_MD = modes.find((m) => /sm\s*\/\s*md|sm\/md/i.test(m)) ?? null;
    suggestions.TYPO_MODE_LG =
      modes.find((m) => /lg\+?/i.test(m)) ?? modes[modes.length - 1] ?? null;
  }

  return suggestions;
}

export function printDiscoveryReport(rawDir, discovery) {
  console.log(`Scanning ${path.relative(process.cwd(), rawDir) || "raw"}/ …\n`);

  if (discovery.entries.length === 0) {
    console.log("  No JSON exports found.");
    return;
  }

  console.log("Files found:");
  for (const entry of discovery.entries) {
    const collection = entry.kind === "collection" ? entry.data.collection : null;
    const count =
      entry.kind === "collection"
        ? entry.data.variables?.length
        : entry.kind === "textStyles"
          ? entry.data.length
          : "?";
    console.log(
      `  ${entry.relative} — ${entry.kind}${collection ? ` (${collection})` : ""} · ${count} items`,
    );
  }

  console.log("\nRole mapping:");
  for (const role of ROLES) {
    const rel = discovery.paths[role];
    const req = REQUIRED_ROLES.includes(role) ? "required" : "optional";
    console.log(`  ${role}: ${rel ?? "(not found)"} [${req}]`);
  }

  const missing = REQUIRED_ROLES.filter((r) => !discovery.paths[r]);
  if (missing.length) {
    console.log(`\nMissing required roles: ${missing.join(", ")}`);
    console.log("Pin paths in generate-design-tokens.mjs RAW_FILES or add exports to raw/.");
  }

  const suggestions = suggestModeConstants(discovery.matched);
  if (Object.keys(suggestions).length) {
    console.log("\nSuggested mode constants for generate-design-tokens.mjs:");
    for (const [key, value] of Object.entries(suggestions)) {
      console.log(`  ${key} = ${value === null ? "null" : `"${value}"`}`);
    }
  }

  const assigned = new Set(Object.values(discovery.paths).filter(Boolean));
  const orphans = discovery.entries.filter((e) => !assigned.has(e.relative));
  if (orphans.length) {
    console.log("\nUnassigned JSON (ignored unless pinned in RAW_FILES):");
    for (const entry of orphans) {
      console.log(`  ${entry.relative}`);
    }
  }
}

function main() {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const rawDir = path.resolve(__dirname, "../src/theme/tokens/raw");
  const discovery = discoverRawExports(rawDir, {});
  printDiscoveryReport(rawDir, discovery);
  if (REQUIRED_ROLES.some((r) => !discovery.paths[r])) process.exit(1);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
