globalThis.process ??= {}; globalThis.process.env ??= {};
import { b as createAstro, c as createComponent, a as renderComponent, r as renderTemplate, m as maybeRenderHead, d as addAttribute, e as renderSlot, f as renderScript } from './astro/server_Bd8-x6y9.mjs';
import { $ as $$BaseLayout } from './BaseLayout_CvyE62LY.mjs';
import { f as formatLocalizedDate } from './dateUtils_DIkPrBH0.mjs';

const $$Astro = createAstro("https://ericmaster.github.io");
const $$MarkdownPostLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$MarkdownPostLayout;
  const { frontmatter } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "pageTitle": frontmatter.title }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<p class="text-right">${formatLocalizedDate(frontmatter.pubDate)}</p> <p><em>${frontmatter.description}</em></p> <div class="w-full aspect-[16/9] mb-4"> <img${addAttribute(frontmatter.image.url.startsWith("/") ? frontmatter.image.url : `/${frontmatter.image.url}`, "src")}${addAttribute(frontmatter.image.alt, "alt")} class="w-full h-full object-cover object-top rounded" loading="lazy"> </div> <div class="tags"> ${frontmatter.tags.map((tag) => renderTemplate`<p class="tag"> <a${addAttribute(`/tags/${tag}`, "href")}>${tag}</a> </p>`)} </div> ${renderSlot($$result2, $$slots["default"])} ${renderScript($$result2, "/app/src/layouts/MarkdownPostLayout.astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "/app/src/layouts/MarkdownPostLayout.astro", void 0);

export { $$MarkdownPostLayout as $ };
