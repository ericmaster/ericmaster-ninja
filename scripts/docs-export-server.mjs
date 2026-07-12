#!/usr/bin/env node
// scripts/docs-export-server.mjs
//
// Tiny HTTP server that renders a branded-docs document to a branded PDF on
// demand, so you can export from the Decap admin (or a phone browser) without
// SSHing to run the CLI. Started alongside astro + the Decap proxy by
// `npm run docs:cms`; bound to 0.0.0.0 so it's reachable over the LAN/mesh.
//
// Routes:
//   GET /                      -> a minimal list of docs with Export links
//   GET /export?doc=<slug>     -> renders branded-docs/docs/<slug>.md to PDF
//                                 (reusing scripts/gen-doc-pdf.js / WeasyPrint)
//                                 and streams it back as an attachment.
//
// It runs the SAVED file on disk, so publish in Decap first, then export.

import { execFileSync } from "node:child_process";
import { createServer } from "node:http";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");
const DOCS_DIR = join(REPO_ROOT, "branded-docs", "docs");
const OUT_DIR = join(REPO_ROOT, "docgen", "out");
const GEN = join(REPO_ROOT, "scripts", "gen-doc-pdf.js");
const PORT = Number(process.env.EXPORT_PORT || 8084);
const HOST = process.env.BIND_HOST || "0.0.0.0";

// Slug must be a bare filename stem — no path separators, no traversal.
const SAFE_SLUG = /^[A-Za-z0-9._-]+$/;

function listDocs() {
  if (!existsSync(DOCS_DIR)) return [];
  return readdirSync(DOCS_DIR)
    .filter((f) => /\.(md|markdown|mkd)$/i.test(f))
    .map((f) => f.replace(/\.(md|markdown|mkd)$/i, ""))
    .sort();
}

function titleOf(slug) {
  try {
    const m = readFileSync(join(DOCS_DIR, slug + ".md"), "utf8").match(
      /^---[\s\S]*?\btitle:\s*(.+?)\s*$/m
    );
    return m ? m[1].replace(/^["']|["']$/g, "") : slug;
  } catch {
    return slug;
  }
}

function html(res, status, body) {
  res.writeHead(status, {
    "Content-Type": "text/html; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
  });
  res.end(body);
}

function indexPage() {
  const rows = listDocs()
    .map(
      (s) =>
        `<li><a href="/export?doc=${encodeURIComponent(s)}">⬇ ${titleOf(
          s
        )}</a> <code>${s}.md</code></li>`
    )
    .join("\n");
  return `<!doctype html><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1">
<title>branded-docs · export</title>
<style>body{font:16px/1.5 system-ui,sans-serif;max-width:40rem;margin:2rem auto;padding:0 1rem;color:#1f2733}
h1{color:#405282}a{color:#405282;font-weight:600;text-decoration:none}li{margin:.5rem 0}code{color:#8a94a6;font-size:.85em}</style>
<h1>Export branded PDF</h1>
<p>Tap a document to render and download its PDF. Publish edits in the CMS first.</p>
<ul>${rows || "<li><em>No documents yet.</em></li>"}</ul>`;
}

const server = createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  if (url.pathname === "/" || url.pathname === "") {
    return html(res, 200, indexPage());
  }
  if (url.pathname !== "/export") {
    return html(res, 404, "<h1>404</h1>");
  }

  const slug = url.searchParams.get("doc") || "";
  if (!SAFE_SLUG.test(slug)) {
    return html(res, 400, "<h1>400 — bad doc slug</h1>");
  }
  const input = join(DOCS_DIR, slug + ".md");
  if (!existsSync(input)) {
    return html(res, 404, `<h1>404 — no such doc: ${slug}</h1>`);
  }

  // Reuse the exact CLI pipeline (render.mjs -> WeasyPrint container). The first
  // export may take ~1-2 min if the WeasyPrint image needs building.
  try {
    execFileSync("node", [GEN, input], { cwd: REPO_ROOT, stdio: "inherit" });
  } catch (err) {
    return html(res, 500, `<h1>500 — render failed</h1><pre>${err.message}</pre>`);
  }

  const pdf = join(OUT_DIR, slug + ".pdf");
  if (!existsSync(pdf)) {
    return html(res, 500, "<h1>500 — PDF not produced</h1>");
  }
  const bytes = readFileSync(pdf);
  res.writeHead(200, {
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename="${basename(pdf)}"`,
    "Content-Length": bytes.length,
    "Access-Control-Allow-Origin": "*",
  });
  res.end(bytes);
});

server.listen(PORT, HOST, () => {
  console.log(`docs-export: listening on http://${HOST}:${PORT} (docs in ${DOCS_DIR})`);
});
