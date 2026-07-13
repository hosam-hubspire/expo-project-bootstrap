#!/usr/bin/env node
/**
 * Sync design tokens from a GitHub repo of Figma plugin exports → Uniwind generated files.
 *
 * Intake pins TOKENS_GITHUB_URL (or set the env var). Phase B: implement `transformAndWrite`
 * for this repo’s export layout. Users re-run anytime:
 *
 *   bun run tokens:sync
 *
 * Output contract: templates/TOKEN_SYNC.md and stubs under src/theme/tokens/generated/
 */

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "src/theme/tokens/generated");
const CACHE_DIR = path.join(ROOT, ".tokens-cache");

/** Set at bootstrap Phase B from intake (override with env). */
const TOKENS_GITHUB_URL =
  process.env.TOKENS_GITHUB_URL?.trim() || "https://github.com/ORG/design-tokens";

const GENERATED_BANNER = "/* AUTO-GENERATED — do not edit. Run: bun run tokens:sync */";

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeGenerated(fileName, body) {
  const withBanner = body.startsWith("/* AUTO-GENERATED")
    ? body
    : `${GENERATED_BANNER}\n${body}`;
  const filePath = path.join(OUT_DIR, fileName);
  fs.writeFileSync(filePath, withBanner.endsWith("\n") ? withBanner : `${withBanner}\n`);
  console.log(`  wrote ${path.relative(ROOT, filePath)}`);
}

/**
 * Shallow-clone or fetch the tokens repo into .tokens-cache/repo.
 * @returns {string} absolute path to the checkout
 */
function fetchTokensRepo() {
  if (!TOKENS_GITHUB_URL || TOKENS_GITHUB_URL.includes("ORG/design-tokens")) {
    throw new Error(
      "Set TOKENS_GITHUB_URL (env or constant in scripts/sync-design-tokens.mjs) to the tokens GitHub repo.",
    );
  }

  ensureDir(CACHE_DIR);
  const repoDir = path.join(CACHE_DIR, "repo");

  if (fs.existsSync(path.join(repoDir, ".git"))) {
    console.log(`Fetching latest in ${path.relative(ROOT, repoDir)}…`);
    execFileSync("git", ["-C", repoDir, "fetch", "--depth", "1", "origin"], {
      stdio: "inherit",
    });
    execFileSync("git", ["-C", repoDir, "reset", "--hard", "origin/HEAD"], {
      stdio: "inherit",
    });
  } else {
    if (fs.existsSync(repoDir)) {
      fs.rmSync(repoDir, { recursive: true, force: true });
    }
    console.log(`Cloning ${TOKENS_GITHUB_URL}…`);
    execFileSync("git", ["clone", "--depth", "1", TOKENS_GITHUB_URL, repoDir], {
      stdio: "inherit",
    });
  }

  return repoDir;
}

/**
 * AGENT (Phase B): parse plugin exports under `sourceDir` and write Uniwind files to OUT_DIR.
 *
 * Must produce the same file set / shapes as template stubs in src/theme/tokens/generated/
 * (theme.css, colors.ts, spacing.css, font-families.css, typography-classes.ts, …).
 * See templates/TOKEN_SYNC.md.
 *
 * @param {string} sourceDir
 */
function transformAndWrite(sourceDir) {
  void sourceDir;
  void writeGenerated;
  void OUT_DIR;
  void os;

  throw new Error(
    "Phase B incomplete: implement transformAndWrite() in scripts/sync-design-tokens.mjs for this tokens repo’s export format.",
  );
}

function main() {
  console.log("Syncing design tokens → Uniwind generated/\n");
  console.log(`  source: ${TOKENS_GITHUB_URL}`);

  const sourceDir = fetchTokensRepo();
  ensureDir(OUT_DIR);
  transformAndWrite(sourceDir);

  console.log("\nDone. Re-run anytime: bun run tokens:sync");
}

main();
