import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { renderDocument } from "./render.mjs";

const FULL_BASICS = {
  website: "https://ericmaster.ninja",
  email: "eric7master@gmail.com",
  phone: "+593983337611",
  location: "Quito, Pichincha - Ecuador",
};

function render(markdown, resumeBasics = FULL_BASICS) {
  return renderDocument(markdown, { resumeBasics });
}

describe("renderDocument — frontmatter parsing", () => {
  it("parses scalar tokens and injects them into the template", () => {
    const html = render("---\ntitle: Letter of Intent\nref: LOI-1\n---\nHello.");
    assert.match(html, /<h1 class="doc-title">Letter of Intent<\/h1>/);
    assert.match(html, /LOI-1/);
  });

  it("parses JSON flow arrays (parties/signatures) and renders each item", () => {
    const html = render(
      '---\ntitle: T\nparties: [{ "role": "Disclosing Party", "name": "Eric Aguayo" }]\nsignatures: [{ "name": "Eric Aguayo", "role": "Author" }]\n---\nBody.'
    );
    assert.match(html, /Disclosing Party/);
    assert.match(html, /class="name">Eric Aguayo</);
    assert.match(html, /class="sig-name">Eric Aguayo</);
  });

  it("strips surrounding quotes from scalar values", () => {
    const html = render('---\ntitle: "Quoted Title"\n---\nBody.');
    assert.match(html, /Quoted Title/);
  });

  it("treats content with no frontmatter block as pure body", () => {
    assert.throws(() => render("Just a plain markdown document, no frontmatter."), /title.*required/i);
  });

  it("ignores blank lines and comment lines inside frontmatter", () => {
    const html = render("---\ntitle: T\n\n# a comment\nref: R1\n---\nBody.");
    assert.match(html, /R1/);
  });
});

describe("renderDocument — required `title`", () => {
  it("throws when title is missing entirely", () => {
    assert.throws(() => render("---\ntype: Letter\n---\nBody."), /title.*required/i);
  });

  it("throws when title is present but blank", () => {
    assert.throws(() => render("---\ntitle: \n---\nBody."), /title.*required/i);
  });

  it("throws when title is only whitespace", () => {
    assert.throws(() => render('---\ntitle: "   "\n---\nBody.'), /title.*required/i);
  });

  it("renders normally when title is a non-empty string", () => {
    const html = render("---\ntitle: A Real Title\n---\nBody.");
    assert.match(html, /A Real Title/);
  });
});

describe("renderDocument — tagline default vs explicit blank", () => {
  it("falls back to the default tagline when omitted from frontmatter", () => {
    const html = render("---\ntitle: T\n---\nBody.");
    assert.match(html, /brand-tagline">Senior DataOps, MLOps &amp; LLMOps Engineer</);
  });

  it("honors an explicitly blank tagline instead of falling back to the default", () => {
    const html = render("---\ntitle: T\ntagline: \n---\nBody.");
    assert.match(html, /brand-tagline"><\/p>/);
  });

  it("honors a custom, non-empty tagline", () => {
    const html = render("---\ntitle: T\ntagline: Custom Tagline\n---\nBody.");
    assert.match(html, /brand-tagline">Custom Tagline</);
  });
});

describe("renderDocument — brand-info rows are conditional on resume.json data", () => {
  it("renders all four rows when every basics field is present", () => {
    const html = render("---\ntitle: T\n---\nBody.");
    for (const label of ["Web", "Email", "Phone", "Location"]) {
      assert.match(html, new RegExp(`class="label">${label}<`));
    }
  });

  it("omits a row whose underlying resume.json value is blank/missing", () => {
    const html = render("---\ntitle: T\n---\nBody.", {
      website: "https://ericmaster.ninja",
      email: "eric7master@gmail.com",
      phone: "",
      location: undefined,
    });
    assert.match(html, /class="label">Web</);
    assert.match(html, /class="label">Email</);
    assert.doesNotMatch(html, /class="label">Phone</);
    assert.doesNotMatch(html, /class="label">Location</);
  });

  it("renders no brand-info rows at all when every basics field is blank", () => {
    const html = render("---\ntitle: T\n---\nBody.", {});
    assert.doesNotMatch(html, /class="label">/);
  });
});

describe("renderDocument — footer segments are conditional, no dangling separators", () => {
  it("joins website and email with a middle dot when both are present", () => {
    const html = render("---\ntitle: T\n---\nBody.");
    assert.match(html, /footer-brand">Eric Aguayo<\/span> · ericmaster\.ninja · eric7master@gmail\.com/);
  });

  it("omits the separator entirely when website is blank", () => {
    const html = render("---\ntitle: T\n---\nBody.", { email: "eric7master@gmail.com" });
    const footerLine = html.match(/footer-brand">Eric Aguayo<\/span>([^<]*)/)[1];
    assert.equal(footerLine.trim(), "· eric7master@gmail.com");
  });

  it("renders just the brand name with no trailing separator when both are blank", () => {
    const html = render("---\ntitle: T\n---\nBody.", {});
    const footerLine = html.match(/footer-brand">Eric Aguayo<\/span>([^<]*)/)[1];
    assert.equal(footerLine.trim(), "");
  });
});

describe("renderDocument — markdown body rendering", () => {
  it("renders markdown to HTML and injects it raw (unescaped) into the body slot", () => {
    const html = render("---\ntitle: T\n---\n## Heading\n\n**bold** text.");
    assert.match(html, /<article class="doc-body">\s*<h2>Heading<\/h2>/);
    assert.match(html, /<strong>bold<\/strong>/);
  });

  it("preserves the opt-in clauses class on an ol passed through as raw HTML", () => {
    const html = render(
      '---\ntitle: T\n---\n<ol class="clauses">\n<li>One.</li>\n</ol>'
    );
    assert.match(html, /<ol class="clauses">/);
  });

  it("does not corrupt body text containing literal double-curly-brace tokens", () => {
    const html = render("---\ntitle: T\n---\nExample syntax: `{{foo}}` should survive verbatim.");
    assert.match(html, /\{\{foo\}\}/);
  });
});

describe("renderDocument — optional sections omitted when absent", () => {
  it("omits the parties section when no parties are given", () => {
    const html = render("---\ntitle: T\n---\nBody.");
    assert.doesNotMatch(html, /<section class="doc-parties">/);
  });

  it("omits the signatures section when no signatures are given", () => {
    const html = render("---\ntitle: T\n---\nBody.");
    assert.doesNotMatch(html, /<section class="doc-signatures">/);
  });

  it("omits the disclaimer paragraph when no disclaimer is given", () => {
    const html = render("---\ntitle: T\n---\nBody.");
    assert.doesNotMatch(html, /class="disclaimer"/);
  });
});
