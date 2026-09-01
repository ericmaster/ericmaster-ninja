// Spec: docs/specs/resume-positioning.md
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const en = JSON.parse(readFileSync(join(root, "src/data/resume.json"), "utf8"));
const es = JSON.parse(readFileSync(join(root, "src/data/resume.es.json"), "utf8"));
const staticResume = readFileSync(join(root, "src/pages/content/resume.md"), "utf8");
const enRoute = readFileSync(join(root, "src/pages/resume.astro"), "utf8");
const esRoute = readFileSync(join(root, "src/pages/es/resume.astro"), "utf8");
const publicDir = join(root, "public");
const retiredPublicResume = join(publicDir, "Eric Aguayo Resume.pdf");
const generatedPublicResume = join(publicDir, "pdfs/resume.pdf");

const EN_HEADLINE = "Senior Solutions & Implementation Engineer";
const ES_HEADLINE = "Ingeniero Senior de Soluciones e Implementación";
const FORBIDDEN = [
  /transitioning to agentic ops/i,
  /en transici[oó]n a ingeniero de agentic ops/i,
  /en transici[oó]n hacia agentic ops/i,
];

const SKILL_ORDER_EN = [
  "Drupal / CMS",
  "PHP",
  "JavaScript / TypeScript",
  "DevOps & Infrastructure",
  "Cloudflare / Serverless",
  "Database & Caching",
  "Python",
  "MERN Stack",
  "Linux / Bash",
  "Version Control & Agile",
  "AI / Agentic Systems",
  "AI-Native Development",
  "AEO / GEO",
  "Flutter / Dart",
];

const SKILL_ORDER_ES = [
  "Drupal / CMS",
  "PHP",
  "JavaScript / TypeScript",
  "DevOps e Infraestructura",
  "Cloudflare / Serverless",
  "Bases de Datos y Caché",
  "Python",
  "Stack MERN",
  "Linux / Bash",
  "Control de Versiones y Ágil",
  "IA / Sistemas Agénticos",
  "Desarrollo Nativo con IA",
  "AEO / GEO",
  "Flutter / Dart",
];

function blob(data) {
  return JSON.stringify(data);
}

function assertNoForbidden(text, label) {
  for (const pattern of FORBIDDEN) {
    assert.equal(pattern.test(text), false, `${label} must not match ${pattern}`);
  }
}

function skillText(skills) {
  return skills
    .flatMap((s) => [s.name, ...(s.keywords ?? [])])
    .join("\n");
}

// Spec: docs/specs/resume-positioning.md via bilingual resume positioning contract
function publicPdfPaths() {
  return readdirSync(publicDir, { recursive: true })
    .filter((name) => String(name).toLowerCase().endsWith(".pdf"))
    .map((name) => join(publicDir, name))
    .sort();
}

// Spec: docs/specs/resume-positioning.md via bilingual resume positioning contract
function pdfText(file) {
  const result = spawnSync("pdftotext", ["-layout", file, "-"], { encoding: "utf8" });
  assert.equal(result.status, 0, `pdftotext must extract ${file}`);
  return result.stdout;
}

describe("bilingual resume positioning contract", () => {
  it("uses the v1 English and Spanish headlines", () => {
    assert.equal(en.basics.headline, EN_HEADLINE);
    assert.equal(es.basics.headline, ES_HEADLINE);
  });

  it("omits the Agentic Ops transition phrasing in both locales and the static source", () => {
    assertNoForbidden(blob(en), "resume.json");
    assertNoForbidden(blob(es), "resume.es.json");
    assertNoForbidden(staticResume, "resume.md");
  });

  it("summarizes 15+ years, delivery, integrations, discovery, leadership, outcomes, and AI as a differentiator", () => {
    assert.match(en.basics.summary, /15\+/);
    assert.match(en.basics.summary, /full-stack/i);
    assert.match(en.basics.summary, /platform/i);
    assert.match(en.basics.summary, /integrations/i);
    assert.match(en.basics.summary, /cloud/i);
    assert.match(en.basics.summary, /discover/i);
    assert.match(en.basics.summary, /cross-functional/i);
    assert.match(en.basics.summary, /business outcomes/i);
    assert.match(en.basics.summary, /differentiator/i);
    assert.match(en.basics.summary, /not a prerequisite/i);

    assert.match(es.basics.summary, /m[aá]s de 15/i);
    assert.match(es.basics.summary, /full-stack/i);
    assert.match(es.basics.summary, /plataforma/i);
    assert.match(es.basics.summary, /integraciones/i);
    assert.match(es.basics.summary, /nube/i);
    assert.match(es.basics.summary, /descubrimiento/i);
    assert.match(es.basics.summary, /interfuncional/i);
    assert.match(es.basics.summary, /resultados de negocio/i);
    assert.match(es.basics.summary, /diferenciador/i);
    assert.match(es.basics.summary, /no un requisito/i);
  });

  it("keeps aligned factual experience chronology", () => {
    assert.equal(en.experience.length, es.experience.length);
    const normalize = (date) =>
      date.replace("Presente", "Present").replace("Ene", "Jan");
    for (let i = 0; i < en.experience.length; i += 1) {
      assert.equal(en.experience[i].company, es.experience[i].company === "Desarrollador Independiente / Contratista"
        ? "Independent Developer / Contractor"
        : es.experience[i].company);
      assert.equal(normalize(en.experience[i].date), normalize(es.experience[i].date));
    }
  });

  it("gives each current-role narrative separate technical-depth and outcome language", () => {
    const designated = [
      { company: "Nimblersoft", date: /^Feb 2025/ },
      { company: "Independent Developer / Contractor", date: /^Feb 2025/ },
    ];
    const techEn = /pipeline|API|Cloudflare|AWS|RAG|Schema\.org|JSON-LD|SDK|Zero Trust/i;
    const techEs = /pipeline|API|Cloudflare|AWS|RAG|Schema\.org|JSON-LD|SDK|Zero Trust/i;
    const outcomeEn = /client|customer|business outcome|delivery-team|customer-facing/i;
    const outcomeEs = /cliente|negocio|entrega|resultados de cara al cliente/i;

    for (const target of designated) {
      const enRow = en.experience.find(
        (row) => row.company === target.company && target.date.test(row.date),
      );
      const esCompany =
        target.company === "Independent Developer / Contractor"
          ? "Desarrollador Independiente / Contratista"
          : target.company;
      const esRow = es.experience.find(
        (row) => row.company === esCompany && /Feb 2025/.test(row.date),
      );
      assert.ok(enRow, `missing English current role ${target.company}`);
      assert.ok(esRow, `missing Spanish current role ${esCompany}`);
      assert.match(enRow.summary, techEn, `${target.company} EN must include technical depth`);
      assert.match(enRow.summary, outcomeEn, `${target.company} EN must include customer/business outcomes`);
      assert.match(esRow.summary, techEs, `${esCompany} ES must include technical depth`);
      assert.match(esRow.summary, outcomeEs, `${esCompany} ES must include customer/business outcomes`);
    }
  });

  it("imports locale JSON in each route and has no literal headline or summary positioning", () => {
    assert.match(enRoute, /import resumeData from ["']\.\.\/data\/resume\.json["']/);
    assert.match(esRoute, /import resumeData from ["']\.\.\/\.\.\/data\/resume\.es\.json["']/);
    assert.doesNotMatch(enRoute, /Senior Solutions & Implementation Engineer/);
    assert.doesNotMatch(esRoute, /Ingeniero Senior de Soluciones e Implementación/);
    assert.doesNotMatch(enRoute, /15\+ years of full-stack/);
    assert.doesNotMatch(esRoute, /m[aá]s de 15 a[nñ]os de entrega/i);
    assert.doesNotMatch(enRoute, /AI is a differentiator/);
    assert.doesNotMatch(esRoute, /la IA es un diferenciador/i);
    assert.doesNotMatch(enRoute, /not a prerequisite/);
    assert.doesNotMatch(esRoute, /no un requisito/);
  });

  it("orders delivery skills before AI groups and keeps locale skill order synchronized", () => {
    assert.deepEqual(en.skills.map((s) => s.name), SKILL_ORDER_EN);
    assert.deepEqual(es.skills.map((s) => s.name), SKILL_ORDER_ES);
    const aiIndexEn = SKILL_ORDER_EN.indexOf("AI / Agentic Systems");
    const deliveryIndexEn = SKILL_ORDER_EN.indexOf("DevOps & Infrastructure");
    assert.ok(deliveryIndexEn < aiIndexEn);
  });

  it("includes synchronized role-family keywords", () => {
    const enText = skillText(en.skills);
    const esText = skillText(es.skills);
    assert.match(enText, /Implementation/);
    assert.match(enText, /Integrations/);
    assert.match(enText, /Solution Design/);
    assert.match(enText, /Platform Delivery/);
    assert.match(esText, /Implementaci[oó]n/);
    assert.match(esText, /Integraciones/);
    assert.match(esText, /Dise[nñ]o de Soluciones/);
    assert.match(esText, /Entrega de Plataforma/);
  });

  it("aligns the public static résumé source with the English v1 headline", () => {
    assert.match(staticResume, new RegExp(EN_HEADLINE));
    assert.doesNotMatch(staticResume, /Target Roles:.*AI Engineer/i);
  });

  it("keeps no public résumé PDF that can contradict v1 and validates bilingual PDFs", () => {
    assert.equal(
      existsSync(retiredPublicResume),
      false,
      "retired public/Eric Aguayo Resume.pdf must be absent",
    );
    const resumePdfs = publicPdfPaths().filter((file) => /resume/i.test(file));
    const generatedPublicResumeEs = join(publicDir, "pdfs/resume-es.pdf");
    assert.deepEqual(resumePdfs.sort(), [generatedPublicResumeEs, generatedPublicResume].sort());
    assert.equal(
      existsSync(generatedPublicResume),
      true,
      "kept generated public/pdfs/resume.pdf must remain",
    );
    assert.equal(
      existsSync(generatedPublicResumeEs),
      true,
      "kept generated public/pdfs/resume-es.pdf must remain",
    );

    const generatedTextEn = pdfText(generatedPublicResume);
    assert.equal(
      generatedTextEn.includes(EN_HEADLINE),
      true,
      "generated public/pdfs/resume.pdf must state the English v1 headline",
    );
    assertNoForbidden(generatedTextEn, "public/pdfs/resume.pdf");

    const generatedTextEs = pdfText(generatedPublicResumeEs);
    assert.equal(
      generatedTextEs.includes(ES_HEADLINE),
      true,
      "generated public/pdfs/resume-es.pdf must state the Spanish v1 headline",
    );
    assertNoForbidden(generatedTextEs, "public/pdfs/resume-es.pdf");
  });

  it("extracts experience in linear chronological order without multi-column corruption", () => {
    const text = pdfText(generatedPublicResume);
    const companies = [
      "Nimblersoft",
      "Independent Developer / Contractor",
      "REDSpace",
      "Taoti",
      "Nimblersoft",
    ];

    let lastIndex = -1;
    for (const company of companies) {
      const idx = text.indexOf(company, lastIndex + 1);
      assert.ok(idx > lastIndex, `Company ${company} must appear after previous entries in text stream`);
      lastIndex = idx;
    }
  });
});
