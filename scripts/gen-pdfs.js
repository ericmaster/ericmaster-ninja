import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execFileSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const outputDir = path.join(rootDir, 'public/pdfs');
fs.mkdirSync(outputDir, { recursive: true });

function findChrome() {
  const candidates = [
    'google-chrome',
    'chromium',
    'chromium-browser',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser'
  ];
  for (const bin of candidates) {
    try {
      execFileSync('which', [bin], { stdio: 'ignore' });
      return bin;
    } catch {
      // Continue searching
    }
  }
  return 'google-chrome';
}

const chromeBin = findChrome();

function renderAtsResumeHtml(data, lang = 'en') {
  const isEs = lang === 'es';
  const labels = {
    summary: isEs ? 'Resumen Profesional' : 'Professional Summary',
    experience: isEs ? 'Experiencia Laboral' : 'Work Experience',
    skills: isEs ? 'Habilidades Técnicas' : 'Technical Skills',
    education: isEs ? 'Educación' : 'Education',
    certifications: isEs ? 'Certificaciones' : 'Certifications',
    leadership: isEs ? 'Liderazgo y Comunidad' : 'Leadership & Community',
    projects: isEs ? 'Proyectos Seleccionados' : 'Selected Projects',
    languages: isEs ? 'Idiomas' : 'Languages'
  };

  const contactItems = [
    data.basics.location,
    data.basics.phone,
    `<a href="mailto:${data.basics.email}">${data.basics.email}</a>`,
    data.basics.website ? `<a href="${data.basics.website}">${data.basics.website.replace(/^https?:\/\//, '')}</a>` : null,
    ...(data.profiles || []).map(p => `<a href="${p.url}">${p.network}</a>`)
  ].filter(Boolean);

  const skillRows = (data.skills || []).map(s => {
    const kw = (s.keywords || []).join(', ');
    return `<div class="skill-row"><span class="skill-label">${s.name}:</span> <span class="skill-values">${kw ? kw : s.description}</span></div>`;
  }).join('\n');

  const expItems = (data.experience || []).map(job => {
    return `
    <div class="item">
      <div class="item-header">
        <div class="role-company">
          <span class="role-title">${job.position}</span>
          <span class="company-name"> · ${job.company}</span>
        </div>
        <div class="item-meta">${job.date}${job.location ? ` · ${job.location}` : ''}</div>
      </div>
      <div class="item-body">${job.summary || ''}</div>
    </div>`;
  }).join('\n');

  const eduItems = (data.education || []).map(edu => {
    return `
    <div class="compact-item">
      <div class="item-header">
        <span class="compact-title">${edu.studyType} in ${edu.area}</span>
        <span class="item-meta">${edu.date}${edu.score ? ` (${edu.score})` : ''}</span>
      </div>
      <div class="compact-subtitle">${edu.institution}</div>
    </div>`;
  }).join('\n');

  const certItems = (data.certifications || []).map(cert => {
    return `
    <div class="compact-item">
      <div class="item-header">
        <span class="compact-title">${cert.name}</span>
        <span class="item-meta">${cert.date}</span>
      </div>
      <div class="compact-subtitle">${cert.issuer}</div>
    </div>`;
  }).join('\n');

  const projectItems = (data.projects || []).map(proj => {
    const kw = (proj.keywords || []).join(', ');
    return `
    <div class="compact-item">
      <div class="item-header">
        <span class="compact-title">${proj.name}</span>
        <span class="item-meta">${proj.date || ''}</span>
      </div>
      <div class="compact-subtitle">${proj.description}${kw ? ` [<em>${kw}</em>]` : ''}</div>
    </div>`;
  }).join('\n');

  const langText = (data.languages || []).map(l => `<strong>${l.name}</strong> (${l.description})`).join(' · ');

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<title>${data.basics.name} – ${data.basics.headline}</title>
<style>
  @page {
    size: letter;
    margin: 0.38in 0.45in 0.38in 0.45in;
  }
  * { box-sizing: border-box; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: #1e293b;
    background: #fff;
    font-size: 8.5pt;
    line-height: 1.3;
    margin: 0;
    padding: 0;
  }
  a { color: #1e293b; text-decoration: none; }
  .header {
    text-align: center;
    border-bottom: 1.5px solid #2563eb;
    padding-bottom: 4pt;
    margin-bottom: 6pt;
  }
  .name {
    font-size: 17pt;
    font-weight: 800;
    color: #0f172a;
    margin: 0;
    line-height: 1.1;
  }
  .headline {
    font-size: 10pt;
    font-weight: 600;
    color: #1d4ed8;
    margin: 2pt 0 3pt 0;
  }
  .contact-bar {
    font-size: 7.8pt;
    color: #475569;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 2pt 8pt;
  }
  .section {
    margin-bottom: 6pt;
  }
  .section-title {
    font-size: 9.2pt;
    font-weight: 700;
    color: #1e40af;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: 1px solid #cbd5e1;
    padding-bottom: 1pt;
    margin: 0 0 3pt 0;
  }
  .summary-text {
    font-size: 8.3pt;
    color: #334155;
    line-height: 1.32;
    margin: 0;
  }
  .item {
    page-break-inside: avoid;
    break-inside: avoid;
    margin-bottom: 5pt;
  }
  .item-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 1pt;
  }
  .role-company {
    font-size: 8.9pt;
  }
  .role-title {
    font-weight: 700;
    color: #0f172a;
  }
  .company-name {
    font-weight: 600;
    color: #334155;
  }
  .item-meta {
    font-size: 8pt;
    font-weight: 600;
    color: #475569;
    white-space: nowrap;
  }
  .item-body {
    font-size: 8.2pt;
    color: #334155;
  }
  .item-body p { margin: 1pt 0; }
  .item-body ul { margin: 1pt 0 1pt 12pt; padding: 0; }
  .item-body li { margin-bottom: 1pt; line-height: 1.28; }
  .skill-row { font-size: 8pt; line-height: 1.25; margin-bottom: 1pt; }
  .skill-label { font-weight: 700; color: #0f172a; }
  .skill-values { color: #334155; }
  .compact-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3pt 12pt;
  }
  .compact-item { page-break-inside: avoid; break-inside: avoid; font-size: 8.1pt; margin-bottom: 2pt; }
  .compact-title { font-weight: 700; color: #0f172a; }
  .compact-subtitle { color: #475569; font-size: 7.8pt; }
  .languages-text { font-size: 8.1pt; color: #334155; margin: 0; }
</style>
</head>
<body>
  <div class="header">
    <h1 class="name">${data.basics.name}</h1>
    <div class="headline">${data.basics.headline}</div>
    <div class="contact-bar">${contactItems.join(' · ')}</div>
  </div>

  <div class="section">
    <div class="section-title">${labels.summary}</div>
    <p class="summary-text">${data.basics.summary}</p>
  </div>

  <div class="section">
    <div class="section-title">${labels.skills}</div>
    <div class="skills-container">${skillRows}</div>
  </div>

  <div class="section">
    <div class="section-title">${labels.experience}</div>
    ${expItems}
  </div>

  <div class="compact-grid">
    <div class="section">
      <div class="section-title">${labels.education}</div>
      ${eduItems}
    </div>
    <div class="section">
      <div class="section-title">${labels.certifications} & ${labels.languages}</div>
      ${certItems}
      <p class="languages-text" style="margin-top: 3pt;">${langText}</p>
    </div>
  </div>

  ${projectItems ? `
  <div class="section">
    <div class="section-title">${labels.projects}</div>
    <div class="compact-grid">${projectItems}</div>
  </div>` : ''}
</body>
</html>`;
}

function generatePdfFromHtml(htmlContent, outputPath) {
  const tempHtmlPath = path.join(outputDir, `__temp_${Date.now()}_${path.basename(outputPath)}.html`);
  fs.writeFileSync(tempHtmlPath, htmlContent, 'utf8');

  try {
    execFileSync(chromeBin, [
      '--headless=new',
      '--no-sandbox',
      '--disable-gpu',
      '--no-pdf-header-footer',
      `--print-to-pdf=${outputPath}`,
      tempHtmlPath
    ], { stdio: 'pipe' });
    console.log(`Generated ${outputPath}`);
  } finally {
    if (fs.existsSync(tempHtmlPath)) {
      fs.unlinkSync(tempHtmlPath);
    }
  }
}

// 1. Generate English Resume PDF
const enResumeData = JSON.parse(fs.readFileSync(path.join(rootDir, 'src/data/resume.json'), 'utf8'));
const enHtml = renderAtsResumeHtml(enResumeData, 'en');
generatePdfFromHtml(enHtml, path.join(outputDir, 'resume.pdf'));

// 2. Generate Spanish Resume PDF
const esResumeData = JSON.parse(fs.readFileSync(path.join(rootDir, 'src/data/resume.es.json'), 'utf8'));
const esHtml = renderAtsResumeHtml(esResumeData, 'es');
generatePdfFromHtml(esHtml, path.join(outputDir, 'resume-es.pdf'));