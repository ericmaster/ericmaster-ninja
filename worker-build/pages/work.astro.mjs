globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, a as renderComponent, r as renderTemplate } from '../chunks/astro/server_Bd8-x6y9.mjs';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_CvyE62LY.mjs';
export { renderers } from '../renderers.mjs';

const $$Work = createComponent(async ($$result, $$props, $$slots) => {
  const work = await import('../chunks/work-content_B9CQCyUn.mjs').then(n => n._);
  const { Content, frontmatter } = work;
  const pageTitle = frontmatter.title;
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "pageTitle": pageTitle }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Content", Content, {})} ` })}`;
}, "/app/src/pages/work.astro", void 0);

const $$file = "/app/src/pages/work.astro";
const $$url = "/work";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Work,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
