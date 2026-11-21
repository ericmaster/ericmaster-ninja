import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (p) => readFileSync(new URL('../' + p, import.meta.url), 'utf8');

describe('tag compatibility, keyboard selector, and mobile resources nav', () => {
  it('encodes tag links with trailing slash in PostTeaser matching MarkdownPostLayout', () => {
    const teaser = read('src/components/PostTeaser.astro');
    assert.match(teaser, /getLocalePath\(lang,\s*`\/tags\/\$\{encodeURIComponent\(tag\)\}\/`\)/);
  });

  it('wires CSP-safe keyboard navigation and Escape handling on LanguageSwitcher', () => {
    const switcher = read('src/components/LanguageSwitcher.astro');
    const layout = read('src/layouts/BaseLayout.astro');
    assert.match(switcher, /@keydown="onKeydown"/);
    assert.match(switcher, /x-ref="trigger"/);
    assert.match(switcher, /x-ref="menu"/);
    assert.match(layout, /onKeydown\(event:\s*KeyboardEvent\)/);
    assert.match(layout, /event\.key === "Escape"/);
    assert.match(layout, /event\.key === "ArrowDown"/);
    assert.match(layout, /event\.key === "ArrowUp"/);
  });

  it('keeps ResourcesNav mobile-safe with 44px touch targets and wrapping', () => {
    const nav = read('src/components/ResourcesNav.astro');
    assert.match(nav, /w-full sm:w-fit/);
    assert.match(nav, /flex-wrap sm:flex-nowrap/);
    assert.match(nav, /min-h-\[44px\]/);
    assert.match(nav, /whitespace-nowrap/);
  });
});
