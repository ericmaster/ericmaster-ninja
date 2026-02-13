globalThis.process ??= {}; globalThis.process.env ??= {};
import { b as createAstro, c as createComponent, a as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_Bd8-x6y9.mjs';
import { g as getCollection, $ as $$PostTeaser } from '../../chunks/_astro_content_C20JJMmr.mjs';
import { $ as $$BaseLayout } from '../../chunks/BaseLayout_CvyE62LY.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro("https://ericmaster.github.io");
async function getStaticPaths() {
  const posts = await getCollection("blog");
  const tagSet = /* @__PURE__ */ new Set();
  for (const post of posts) {
    if (post.data.tags) {
      post.data.tags.forEach((tag) => tagSet.add(tag));
    }
  }
  return Array.from(tagSet).map((tag) => ({
    params: { tag }
  }));
}
const $$tag = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$tag;
  const { tag } = Astro2.params;
  const allPosts = await getCollection("blog");
  const filteredPosts = allPosts.filter(
    (post) => post.data.tags?.includes(tag)
  );
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "pageTitle": `Posts tagged with ${tag}` }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<ul> ${filteredPosts.map((post) => renderTemplate`<li>${renderComponent($$result2, "PostTeaser", $$PostTeaser, { "post": post })}</li>`)} </ul> ` })}`;
}, "/app/src/pages/tags/[tag].astro", void 0);

const $$file = "/app/src/pages/tags/[tag].astro";
const $$url = "/tags/[tag]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$tag,
  file: $$file,
  getStaticPaths,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
