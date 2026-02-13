globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, a as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_Bd8-x6y9.mjs';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_CvyE62LY.mjs';
import { $ as $$PostTeaser } from '../chunks/_astro_content_C20JJMmr.mjs';
import { g as getPosts } from '../chunks/blogUtils_B26on0vV.mjs';
import { C as Content } from '../chunks/blog-content_jA6a45d8.mjs';
export { renderers } from '../renderers.mjs';

const $$Blog = createComponent(async ($$result, $$props, $$slots) => {
  const pageTitle = "My Awesome Blog";
  const allPosts = await getPosts();
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "pageTitle": pageTitle }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Content", Content, {})} ${maybeRenderHead()}<ul> ${allPosts.map((post) => renderTemplate`${renderComponent($$result2, "PostTeaser", $$PostTeaser, { "post": post })}
        <hr>`)} </ul> ` })}`;
}, "/app/src/pages/blog.astro", void 0);

const $$file = "/app/src/pages/blog.astro";
const $$url = "/blog";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Blog,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
