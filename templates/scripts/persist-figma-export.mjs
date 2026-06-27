#!/usr/bin/env node
/**
 * Persist Figma MCP export payloads to the project tree.
 *
 * Token export (object with collection, modes, variables):
 *   node scripts/persist-figma-export.mjs token color-tokens.json /path/to/export.json
 *
 * Text styles (array from getLocalTextStylesAsync):
 *   node scripts/persist-figma-export.mjs text-styles /path/to/styles.json
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const RAW_DIR = path.join(ROOT, "src/theme/tokens/raw");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  console.log(`  wrote ${path.relative(ROOT, filePath)}`);
}

function persistToken(outName, sourcePath) {
  const data = readJson(sourcePath);
  if (!data.collection || !Array.isArray(data.modes) || !Array.isArray(data.variables)) {
    throw new Error(
      `Invalid token export in ${sourcePath} — expected { collection, modes, variables }`,
    );
  }
  writeJson(path.join(RAW_DIR, outName), data);
  console.log(`  ${data.variables.length} variables · modes: [${data.modes.join(", ")}]`);
}

function persistTextStyles(sourcePath) {
  const data = readJson(sourcePath);
  if (!Array.isArray(data)) {
    throw new Error(`Invalid text styles export — expected an array`);
  }
  writeJson(path.join(RAW_DIR, "text-styles.json"), data);
  console.log(`  ${data.length} text styles`);
}

function usage() {
  console.error(`Usage:
  node scripts/persist-figma-export.mjs token <out-file.json> <source.json>
  node scripts/persist-figma-export.mjs text-styles <source.json>`);
  process.exit(1);
}

const [kind, arg1, arg2] = process.argv.slice(2);
if (!kind) usage();

try {
  if (kind === "token") {
    if (!arg1 || !arg2) usage();
    persistToken(arg1, arg2);
  } else if (kind === "text-styles") {
    if (!arg1) usage();
    persistTextStyles(arg1);
  } else {
    usage();
  }
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
