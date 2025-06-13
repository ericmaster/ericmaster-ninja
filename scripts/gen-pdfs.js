import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import markdownpdf from 'markdown-pdf';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputDir = './src/pages/content';
const outputDir = './public/pdfs';
const cssPath = path.join(__dirname, 'pdf-style.css');

fs.mkdirSync(outputDir, { recursive: true });

const files = fs.readdirSync(inputDir).filter(file => file.endsWith('.md'));

files.forEach(file => {
  const inputPath = path.join(inputDir, file);
  const outputPath = path.join(outputDir, file.replace('.md', '.pdf'));
  console.log(`Generating PDF for ${inputPath}...`);

  // Read and clean markdown content (remove frontmatter)
  let content = fs.readFileSync(inputPath, 'utf-8');
  if (content.startsWith('---')) {
    const end = content.indexOf('---', 3);
    if (end !== -1) {
      content = content.slice(end + 3).trimStart();
    }
  }

  // Write cleaned content to a temp file
  const tempPath = path.join(outputDir, `__temp__${file}`);
  fs.writeFileSync(tempPath, content);

  markdownpdf({ cssPath }).from(tempPath).to(outputPath, () => {
    fs.unlinkSync(tempPath); // Remove temp file
    console.log(`Generated ${outputPath}`);
  });
});