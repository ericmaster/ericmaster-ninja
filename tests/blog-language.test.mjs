import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';

// Exercise the actual utility with a controlled Astro content collection.
const source = stripTypeScriptTypes(readFileSync(new URL('../src/lib/blogUtils.ts', import.meta.url), 'utf8'))
  .replace(/^import .* from "astro:content";\s*/m, '');
const factory = await import(`data:text/javascript,${encodeURIComponent(
  'export function create(getCollection) {\n' + source.replace('export async function', 'async function') + '\nreturn getPosts; }'
)}`);
const fixtures = [
  { id: 'en', data: { lang: 'en', published: true, pubDate: new Date('2026-02-01') } },
  { id: 'es', data: { lang: 'es', published: true, pubDate: new Date('2026-03-01') } },
  { id: 'legacy', data: { published: true, pubDate: new Date('2026-01-01') } },
  { id: 'draft', data: { lang: 'es', published: false, pubDate: new Date('2026-04-01') } },
];
const getPosts = factory.create(async () => structuredClone(fixtures));
const ids = (posts) => posts.map(p => p.id);
describe('selected-language post listings', () => {
  it('defaults to English including legacy posts, never Spanish', async () => {
    assert.deepEqual(ids(await getPosts()), ['en', 'legacy']);
  });
  it('selects Spanish and excludes unpublished posts', async () => {
    assert.deepEqual(ids(await getPosts(undefined, 'es')), ['es']);
  });
  it('applies the limit after selecting the language', async () => {
    assert.deepEqual(ids(await getPosts(1, 'en')), ['en']);
  });
  it('does not substitute English when the selected language is empty', async () => {
    const emptySpanish = factory.create(async () => fixtures.filter(p => p.data.lang !== 'es'));
    assert.deepEqual(await emptySpanish(undefined, 'es'), []);
  });
  it('English listing declares its locale explicitly', () => {
    assert.match(readFileSync(new URL('../src/pages/blog.astro', import.meta.url), 'utf8'), /getPosts\(undefined, "en"\)/);
  });
});
