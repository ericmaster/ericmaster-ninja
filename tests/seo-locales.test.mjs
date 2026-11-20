import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import yaml from 'js-yaml';
const read = p => readFileSync(new URL('../' + p, import.meta.url), 'utf8');
const pairs = JSON.parse(read('src/i18n/routePairs.json'));
const source = read('src/i18n/routePairs.ts').replace('import pairs from "./routePairs.json";', 'const pairs = ' + JSON.stringify(pairs) + ';');
const { getTranslationPair, localeHome } = await import('data:text/javascript;base64,' + Buffer.from(stripTypeScriptTypes(source)).toString('base64'));
test('translation registry contains only unique existing source pages and published language-qualified articles', () => {
 const paths = new Set();
 for (const pair of pairs) {
  assert.deepEqual(Object.keys(pair).sort(), ['en','es']);
  for (const lang of ['en','es']) {
   const path = pair[lang]; assert.ok(path.startsWith('/') && path.endsWith('/')); assert.ok(!paths.has(path)); paths.add(path);
   if(path.startsWith('/posts/')) {
    const frontmatter = yaml.load(read('src/pages' + path.slice(0,-1) + '.md').split('---')[1]);
    assert.equal(frontmatter.lang, lang); assert.equal(frontmatter.published, true);
   } else {
    const file = path === '/' ? 'index' : path === '/es/' ? 'es/index' : path.slice(1,-1);
    assert.ok(existsSync(new URL('../src/pages/' + file + '.astro', import.meta.url)));
   }
   assert.deepEqual(getTranslationPair(path), pair); assert.deepEqual(getTranslationPair(path.slice(0,-1) || '/'), pair);
  }
 }
});
test('unknown and fallback-prefix routes never claim translations; language fallback is home', () => {
 for (const path of ['/tags/Cloudflare/','/es/tags/Cloudflare/','/posts/not-translated/','/es/posts/the-expensive-part-of-an-agent-is-attention/','/esoteric/']) assert.equal(getTranslationPair(path), undefined);
 assert.equal(localeHome('en'), '/'); assert.equal(localeHome('es'), '/es/');
 assert.match(read('src/components/LanguageSwitcher.astro'), /!pair && !isActive/);
 assert.match(read('src/components/LanguageSwitcher.astro'), /Seleccionar idioma/);
});
