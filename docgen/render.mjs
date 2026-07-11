// docgen/render.mjs
//
// Renders a frontmatter-driven markdown document into the Eric Aguayo personal
// letterhead template (docgen/templates/letterhead.html).
//
// Usage:
//   node docgen/render.mjs <input.md> [output.html]
//   node docgen/render.mjs docgen/samples/sample-nda.md docgen/dist/sample-nda.html
//
// The markdown body is rendered with `marked` and injected into the template's
// body slot. Brand-info (website/email/phone/location) is pulled from
// src/data/resume.json `basics` so the identity stays in one source of truth.
// Frontmatter tokens (type/lang/title/subtitle/ref/date/parties[]/signatures[]/
// disclaimer/tagline) drive the header, doc-meta, signatures and footer chrome.
//
// See docgen/README.md for the full frontmatter schema.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { marked } from "marked";
import yaml from "js-yaml";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");
const TEMPLATE_PATH = resolve(__dirname, "templates/letterhead.html");
const RESUME_PATH = resolve(REPO_ROOT, "src/data/resume.json");

// --- Frontmatter parsing --------------------------------------------------
// The frontmatter block is standard YAML, parsed with js-yaml. This covers both
// single-line JSON-flow arrays (e.g. `parties: [{ "role": "..." }]`, which is
// valid YAML) AND the block-style lists/maps that Decap CMS emits when authoring
// through the /docs-admin surface — so a doc written either way renders the same.
function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) {
    return { data: {}, body: raw };
  }
  const [, fm, body] = match;
  let data;
  try {
    data = yaml.load(fm);
  } catch (err) {
    throw new Error(`docgen: invalid YAML frontmatter — ${err.message}`);
  }
  // An empty or scalar frontmatter block yields null/non-object; normalize to {}.
  if (data == null || typeof data !== "object" || Array.isArray(data)) {
    data = {};
  }
  return { data, body };
}

// --- Minimal, safe template engine ---------------------------------------
// Supports: {{key}} (HTML-escaped), {{{key}}} (raw), {{#if key}}...{{/if}},
// {{#each key}}...{{/each}} with {{this.field}} inside the loop.
function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function lookup(ctx, path) {
  return path
    .split(".")
    .reduce((acc, part) => (acc == null ? undefined : acc[part]), ctx);
}

function renderTemplate(tpl, ctx) {
  // {{#each key}} ... {{/each}}
  tpl = tpl.replace(
    /\{\{#each (\w+)\}\}([\s\S]*?)\{\{\/each\}\}/g,
    (_, key, inner) => {
      const arr = ctx[key];
      if (!Array.isArray(arr)) return "";
      return arr
        .map((item) => renderTemplate(inner, { ...ctx, this: item }))
        .join("");
    }
  );

  // {{#if key}} ... {{/if}}
  tpl = tpl.replace(
    /\{\{#if ([\w.]+)\}\}([\s\S]*?)\{\{\/if\}\}/g,
    (_, key, inner) => {
      const val = lookup(ctx, key);
      const truthy = Array.isArray(val) ? val.length > 0 : Boolean(val);
      return truthy ? renderTemplate(inner, ctx) : "";
    }
  );

  // {{escaped}} — must run before {{{raw}}} so that raw-injected content
  // (e.g. the rendered markdown body) is never rescanned by this pass; a
  // body containing literal "{{...}}" text (code samples, etc.) would
  // otherwise get silently stripped. The lookbehind/lookahead keep this
  // regex from matching the inner {{key}} of a not-yet-processed
  // {{{raw}}} token.
  tpl = tpl.replace(/(?<!\{)\{\{([\w.]+)\}\}(?!\})/g, (_, key) => {
    const val = lookup(ctx, key);
    return val == null ? "" : escapeHtml(val);
  });

  // {{{raw}}}
  tpl = tpl.replace(/\{\{\{([\w.]+)\}\}\}/g, (_, key) => {
    const val = lookup(ctx, key);
    return val == null ? "" : String(val);
  });

  return tpl;
}

// --- Public render entry point -------------------------------------------
export function renderDocument(markdownSource, { resumeBasics } = {}) {
  const { data, body } = parseFrontmatter(markdownSource);
  const basics =
    resumeBasics ?? JSON.parse(readFileSync(RESUME_PATH, "utf8")).basics;
  const template = readFileSync(TEMPLATE_PATH, "utf8");

  const websiteLabel = String(basics.website || "").replace(
    /^https?:\/\//,
    ""
  );

  if (!data.title || !String(data.title).trim()) {
    throw new Error(
      "docgen: frontmatter `title` is required (see docgen/README.md schema) but was missing or empty"
    );
  }

  const ctx = {
    // Brand-info — sourced from resume.json basics (single source of truth).
    website: basics.website || "",
    websiteLabel,
    email: basics.email || "",
    phone: basics.phone || "",
    location: basics.location || "",
    // Frontmatter-driven tokens with sensible defaults. `tagline` uses an
    // explicit has-own check (not `||`) so `tagline: ""` in frontmatter can
    // deliberately blank the wordmark instead of always falling back.
    lang: data.lang || "en",
    tagline: Object.hasOwn(data, "tagline")
      ? data.tagline
      : "Senior DataOps, MLOps & LLMOps Engineer",
    type: data.type || "",
    title: data.title,
    subtitle: data.subtitle || "",
    ref: data.ref || "",
    date: data.date || "",
    parties: Array.isArray(data.parties) ? data.parties : [],
    signatures: Array.isArray(data.signatures) ? data.signatures : [],
    disclaimer: data.disclaimer || "",
    // Rendered markdown body (raw HTML injected into the body slot).
    body: marked.parse(body),
  };

  return renderTemplate(template, ctx);
}

// --- CLI ------------------------------------------------------------------
const isMain =
  process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  const input = process.argv[2];
  if (!input) {
    console.error(
      "Usage: node docgen/render.mjs <input.md> [output.html]"
    );
    process.exit(1);
  }
  const output = process.argv[3];
  const html = renderDocument(readFileSync(resolve(input), "utf8"));
  if (output) {
    const outputPath = resolve(output);
    mkdirSync(dirname(outputPath), { recursive: true });
    writeFileSync(outputPath, html);
    console.log(`Rendered ${input} -> ${output}`);
  } else {
    process.stdout.write(html);
  }
}
