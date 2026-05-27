#!/usr/bin/env node
/**
 * Post-build CSP hash guard.
 *
 * Scans every HTML file in ./dist for inline <script> blocks (those without a
 * src attribute). For each one it computes the sha256 hash and checks that the
 * hash appears somewhere in public/_headers. Exits non-zero and prints the
 * missing hashes so they can be pasted straight into _headers.
 */

import { readFileSync, readdirSync, statSync } from "fs";
import { createHash } from "crypto";
import { join, resolve } from "path";
import { fileURLToPath } from "url";

const ROOT = resolve(fileURLToPath(import.meta.url), "../../");
const DIST = join(ROOT, "dist");
const HEADERS = join(ROOT, "public/_headers");

// ── helpers ──────────────────────────────────────────────────────────────────

function sha256b64(text) {
  return createHash("sha256").update(text).digest("base64");
}

/** Recursively collect all .html paths under dir */
function htmlFiles(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      results.push(...htmlFiles(full));
    } else if (entry.endsWith(".html")) {
      results.push(full);
    }
  }
  return results;
}

/** Return content of every inline <script> block (no src attr) in html.
 *  NOTE: CSP hashes the EXACT bytes between the tags — do NOT trim. The raw
 *  content is returned verbatim; we only skip blocks that are whitespace-only. */
function inlineScripts(html) {
  const re = /<script(?![^>]*\bsrc\b)[^>]*>([\s\S]*?)<\/script>/g;
  const found = [];
  let m;
  while ((m = re.exec(html)) !== null) {
    const content = m[1]; // verbatim — this is what the browser hashes
    if (content.trim()) found.push(content);
  }
  return found;
}

// ── main ─────────────────────────────────────────────────────────────────────

const headersText = readFileSync(HEADERS, "utf8");
const files = htmlFiles(DIST);

// Paths with their own permissive CSP block (e.g. 'unsafe-inline') — skip them.
// These are covered by a dedicated block in _headers, not the catch-all /* block.
const PERMISSIVE_PREFIXES = [join(DIST, "admin")];

// Collect unique inline-script hashes across the whole dist tree
const missing = new Map(); // hash → first file path where seen

for (const file of files) {
  if (PERMISSIVE_PREFIXES.some((p) => file.startsWith(p))) continue;
  const html = readFileSync(file, "utf8");
  for (const content of inlineScripts(html)) {
    const hash = `'sha256-${sha256b64(content)}'`;
    if (!headersText.includes(hash) && !missing.has(hash)) {
      missing.set(hash, file.replace(DIST, "./dist"));
    }
  }
}

if (missing.size === 0) {
  console.log("✅  CSP hash check passed — all inline scripts are covered.");
  process.exit(0);
}

console.error(
  `\n❌  CSP hash check FAILED — ${missing.size} inline script(s) not in public/_headers:\n`
);
for (const [hash, file] of missing) {
  console.error(`  ${hash}`);
  console.error(`    first seen: ${file}\n`);
}
console.error(
  "Add the hashes above to the script-src in public/_headers, then rebuild.\n"
);
process.exit(1);
