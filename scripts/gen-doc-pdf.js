#!/usr/bin/env node
// scripts/gen-doc-pdf.js
//
// Render a frontmatter+markdown document into the personal letterhead template
// (docgen/render.mjs) and produce a faithful branded PDF, entirely locally.
//
// Usage:
//   npm run doc:pdf -- docgen/samples/sample-nda.md
//   npm run doc:pdf -- <path-to.md> [out.pdf]
//
// Pipeline: render.mjs turns the markdown into self-contained letterhead HTML
// (inline CSS), then WeasyPrint rasterizes it to an A4 PDF. WeasyPrint is CPython +
// native Pango, so it runs in a small Docker container (docgen/weasyprint.Dockerfile)
// rather than on the host. No browser, no cloud, no secrets — only Docker is needed;
// the image is built on first run if missing. Output lands in the git-ignored
// docgen/out/ directory for hand-off.

import { execFileSync } from "node:child_process";
import { copyFileSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { renderDocument } from "../docgen/render.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");
const DOCGEN_DIR = join(REPO_ROOT, "docgen");
const OUT_DIR = join(DOCGEN_DIR, "out");
const IMAGE = "ericmaster-ninja-docgen-weasyprint";
const DOCKERFILE = join(DOCGEN_DIR, "weasyprint.Dockerfile");

function fail(msg, code = 1) {
  console.error(`gen-doc-pdf: ${msg}`);
  process.exit(code);
}

function haveDocker() {
  try {
    execFileSync("docker", ["version"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function ensureImage() {
  try {
    execFileSync("docker", ["image", "inspect", IMAGE], { stdio: "ignore" });
  } catch {
    console.error(`gen-doc-pdf: building ${IMAGE} (first run, ~1-2 min)…`);
    execFileSync("docker", ["build", "-q", "-t", IMAGE, "-f", DOCKERFILE, DOCGEN_DIR], {
      stdio: ["ignore", "inherit", "inherit"],
    });
  }
}

const input = process.argv[2];
if (!input) fail("usage: node scripts/gen-doc-pdf.js <input.md> [output.pdf]", 2);
if (!haveDocker()) fail("Docker is required to run WeasyPrint (see docgen/weasyprint.Dockerfile).");

// 1) Render to self-contained branded HTML (the template carries the A4 @page CSS).
const html = renderDocument(readFileSync(resolve(input), "utf8"));

mkdirSync(OUT_DIR, { recursive: true });
const stem = basename(resolve(input)).replace(/\.(md|markdown|mkd)$/i, "");
const htmlName = `.${stem}.render.html`;
const pdfName = `${stem}.pdf`;
const htmlPath = join(OUT_DIR, htmlName);
const stagedPdf = join(OUT_DIR, pdfName);
writeFileSync(htmlPath, html);

ensureImage();

// 2) WeasyPrint HTML -> PDF in the container. Run as the invoking user (no
//    root-owned artifacts); HOME=/tmp gives fontconfig a writable cache. Only
//    OUT_DIR is mounted, so both the staged HTML and the PDF live there.
try {
  execFileSync(
    "docker",
    [
      "run", "--rm",
      "--user", `${process.getuid()}:${process.getgid()}`,
      "-e", "HOME=/tmp",
      "-v", `${OUT_DIR}:/data`,
      IMAGE,
      `/data/${htmlName}`, `/data/${pdfName}`,
    ],
    { stdio: ["ignore", "inherit", "inherit"] },
  );
} finally {
  rmSync(htmlPath, { force: true });
}

// 3) Honor an explicit output path (may be outside OUT_DIR).
let finalPdf = stagedPdf;
const outArg = process.argv[3];
if (outArg) {
  finalPdf = resolve(outArg);
  if (finalPdf !== stagedPdf) {
    mkdirSync(dirname(finalPdf), { recursive: true });
    copyFileSync(stagedPdf, finalPdf);
    rmSync(stagedPdf, { force: true });
  }
}

console.log(`gen-doc-pdf: wrote ${finalPdf}`);
