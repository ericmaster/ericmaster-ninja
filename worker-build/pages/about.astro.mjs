globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, a as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_Bd8-x6y9.mjs';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_CvyE62LY.mjs';
export { renderers } from '../renderers.mjs';

const $$About = createComponent(async ($$result, $$props, $$slots) => {
  const about = await import('../chunks/about-content_DYhkQSkE.mjs').then(n => n._);
  const { Content, frontmatter } = about;
  const pageTitle = frontmatter.title;
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "pageTitle": pageTitle }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="flex flex-col sm:block items-start"> <img src="/assets/images/about.jpg" alt="Eric Aguayo" class="max-w-xs w-full h-auto rounded-xl shadow-lg float-none sm:float-left mb-4 sm:mb-0 sm:mr-6"> <div class="flex-1"> ${renderComponent($$result2, "Content", Content, {})} </div> </div> ` })}`;
}, "/app/src/pages/about.astro", void 0);

const $$file = "/app/src/pages/about.astro";
const $$url = "/about";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$About,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
