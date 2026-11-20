import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const read = p => readFileSync(new URL('../'+p, import.meta.url), 'utf8');
describe('approved mobile homepage reconstruction', () => {
  for (const [locale, path] of [['en','src/pages/index.astro'], ['es','src/pages/es/index.astro']]) {
    it(`${locale} provides a single hero and two localized primary actions`, () => {
      const s=read(path), prefix=locale==='es'?'/es':'';
      assert.equal((s.match(/<h1\b/g)||[]).length,1);
      assert.match(s,/showPageTitle=\{false\}/);
      assert.match(s,/skipLinkTarget="home-main"/);
      assert.ok(s.includes(`href="${prefix}/work"`));
      assert.ok(s.includes(`href="${prefix}/blog"`));
      assert.doesNotMatch(s,/float-left|WorkTeaser/);
    });
  }
  it('places the keyboard skip link before the header', () => {
    const s=read('src/layouts/BaseLayout.astro');
    assert.ok(s.indexOf('{skipLinkTarget &&')<s.indexOf('<Header '));
  });
  it('keeps mobile controls at 44px and navigation breakpoint aligned', () => {
    assert.match(read('src/components/Hamburger.astro'), /h-\[44px\] w-\[44px\]/);
    assert.match(read('src/components/Hamburger.astro'), /lg:hidden/);
    assert.match(read('src/components/Navigation.astro'), /lg:block/);
    assert.match(read('src/styles/global.css'), /@media \(min-width: 1024px\)/);
    assert.doesNotMatch(read('src/styles/global.css'), /top-20 left-12/);
  });
  it('lets cards shrink within small screens', () => {
    const s=read('src/components/PostTeaser.astro');
    assert.match(s,/items-stretch/);
    assert.match(s,/min-w-0/);
    assert.doesNotMatch(s,/min-w-\[200px\]/);
  });
});
