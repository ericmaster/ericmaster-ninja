globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, a as renderComponent, r as renderTemplate, m as maybeRenderHead, d as addAttribute } from '../chunks/astro/server_Bd8-x6y9.mjs';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_CvyE62LY.mjs';
export { renderers } from '../renderers.mjs';

const $$Resources = createComponent(async ($$result, $$props, $$slots) => {
  const resources = await import('../chunks/resources-content_BzSNX-z2.mjs').then(n => n._);
  const { Content, frontmatter } = resources;
  const pageTitle = frontmatter.title;
  const res = await fetch("https://api.github.com/users/ericmaster/repos");
  const repos = await res.json();
  const cheatsheetRepos = Array.isArray(repos) ? repos.filter((repo) => repo.topics && repo.topics.includes("cheatsheets")) : [];
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "pageTitle": pageTitle }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Content", Content, {})} ${maybeRenderHead()}<section class="px-4 py-8"> <h2>Cheatsheets</h2> <ul> ${cheatsheetRepos.map((repo) => renderTemplate`<li> <a${addAttribute(`https://ericmaster.github.io/${repo.name}/`, "href")} target="_blank" rel="noopener noreferrer"> ${repo.description} </a> </li>`)} </ul> </section> ` })}`;
}, "/app/src/pages/resources.astro", void 0);

const $$file = "/app/src/pages/resources.astro";
const $$url = "/resources";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Resources,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
