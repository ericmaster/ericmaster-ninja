globalThis.process ??= {}; globalThis.process.env ??= {};
import { b as createAstro, c as createComponent, m as maybeRenderHead, s as spreadAttributes, r as renderTemplate, a as renderComponent, F as Fragment } from '../chunks/astro/server_Bd8-x6y9.mjs';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_CvyE62LY.mjs';
import { $ as $$PostTeaser } from '../chunks/_astro_content_C20JJMmr.mjs';
import { g as getPosts } from '../chunks/blogUtils_B26on0vV.mjs';
import { C as Content } from '../chunks/home-content_BhsfVoIr.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro("https://ericmaster.github.io");
const $$LatestPosts = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$LatestPosts;
  const latestPosts = await getPosts(5);
  return renderTemplate`${maybeRenderHead()}<section${spreadAttributes(Astro2.props)}> <h2 class="pl-6">Latest Posts</h2> <ul> ${latestPosts.length === 0 ? renderTemplate`<li>No posts yet.</li>` : latestPosts.map((post) => renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "PostTeaser", $$PostTeaser, { "post": post })} <hr> ` })}`)} </ul> </section>`;
}, "/app/src/components/LatestPosts.astro", void 0);

const $$Index = createComponent(($$result, $$props, $$slots) => {
  const pageTitle = "Eric's Digital Nook";
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "pageTitle": pageTitle }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="w-full mb-8"> <div class="w-full"> <img src="/assets/eric-anime-run.jpg" alt="Eric trail running anime image" class="max-w-xs w-full h-auto rounded-xl shadow-lg float-none sm:float-left mb-4 sm:mb-0 sm:mr-6"> <div> ${renderComponent($$result2, "Content", Content, {})} </div> </div> <div class="clear-both"></div> </section> ${renderComponent($$result2, "LatestPosts", $$LatestPosts, { "class": "w-full mt-8 max-w-3xl mx-auto" })} ` })}`;
}, "/app/src/pages/index.astro", void 0);

const $$file = "/app/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
