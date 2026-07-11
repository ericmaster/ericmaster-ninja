// scripts/gen-doc-pdf.js
//
// Render a frontmatter+markdown document into the personal letterhead template
// (docgen/render.mjs) and produce a faithful branded PDF via Cloudflare Browser
// Rendering, written to the git-ignored docgen/out/ directory for hand-off.
//
// This is the Phase-3 companion to `npm run pdfs` (the public markdown-pdf path):
// it is for CONFIDENTIAL documents authored privately and delivered as a PDF, so
// nothing here touches the deployed site or worker/index.ts.
//
// Usage (secrets injected by the trusted runner — see below):
//   npm run doc:pdf -- docgen/samples/sample-nda.md
//   npm run doc:pdf -- <path-to.md> [out.pdf]
//
// SECRETS. This script never reads Infisical itself and never hardcodes a token.
// It expects CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID to be present in the
// environment, injected at run time by `scripts/trusted-run.sh` (which validates
// this file's SHA-256 against trusted-scripts.json and pulls the secrets via the
// first-party Infisical CLI). To run it by hand without the runner, inject them
// yourself, e.g. `infisical run --projectId <id> --env dev -- node scripts/gen-doc-pdf.js <file>`.
//
// PREREQUISITES. Cloudflare Browser Rendering requires a Workers Paid plan and an
// API token scoped for Browser Rendering. A 4xx from the endpoint below almost
// always means the plan or token scope is missing (see the error hint printed).

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { renderDocument } from "../docgen/render.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");
const DEFAULT_OUT_DIR = resolve(REPO_ROOT, "docgen/out");

const CF_API = "https://api.cloudflare.com/client/v4";

function fail(msg, code = 1) {
  console.error(`gen-doc-pdf: ${msg}`);
  process.exit(code);
}

async function main() {
  const input = process.argv[2];
  if (!input) {
    fail("usage: node scripts/gen-doc-pdf.js <input.md> [output.pdf]", 2);
  }

  const token = process.env.CLOUDFLARE_API_TOKEN;
  const account = process.env.CLOUDFLARE_ACCOUNT_ID;
  if (!token || !account) {
    // Never echo the values; only report which name is missing.
    const missing = [
      !token && "CLOUDFLARE_API_TOKEN",
      !account && "CLOUDFLARE_ACCOUNT_ID",
    ].filter(Boolean).join(", ");
    fail(
      `missing ${missing} in the environment. Run via the trusted runner ` +
        `(npm run doc:pdf -- <file>) so the secrets are injected from Infisical, ` +
        `or inject them yourself with \`infisical run\`.`,
      2,
    );
  }

  // 1) Render the document to branded HTML. The template carries the A4 @page
  //    geometry and print @media block, so the PDF layout is driven by that CSS
  //    (the simpler, faithful path — no per-request page-size fiddling needed).
  const html = renderDocument(readFileSync(resolve(input), "utf8"));

  // 2) Ask Cloudflare Browser Rendering to turn the HTML into a PDF. Background
  //    graphics (gradients) print because the template's print CSS opts in via
  //    `-webkit-print-color-adjust: exact` / `print-color-adjust: exact`.
  const res = await fetch(
    `${CF_API}/accounts/${account}/browser-rendering/pdf`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ html }),
    },
  );

  if (!res.ok) {
    let detail = "";
    try {
      detail = ` — ${await res.text()}`;
    } catch {
      /* ignore body read errors */
    }
    const hint =
      res.status === 403 || res.status === 401
        ? " (check the token is scoped for Browser Rendering and the account has a Workers Paid plan)"
        : "";
    fail(`Cloudflare Browser Rendering returned ${res.status}${hint}${detail}`);
  }

  // 3) Write the binary PDF to the git-ignored hand-off dir.
  const outArg = process.argv[3];
  const outPath = outArg
    ? resolve(outArg)
    : resolve(DEFAULT_OUT_DIR, basename(input).replace(/\.md$/i, ".pdf"));
  mkdirSync(dirname(outPath), { recursive: true });
  const pdf = Buffer.from(await res.arrayBuffer());
  writeFileSync(outPath, pdf);
  console.log(`gen-doc-pdf: wrote ${outPath} (${pdf.length} bytes)`);
}

main().catch((err) => fail(err?.stack || String(err)));
