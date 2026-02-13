globalThis.process ??= {}; globalThis.process.env ??= {};
import { _ as __vite_glob_0_0 } from '../chunks/delivering-what-matters-the-new-standard-for-ai-era-web-experiences_NiRQh1c6.mjs';
import { _ as __vite_glob_0_1 } from '../chunks/deploy-your-statically-generated-site-to-a-cloudflare-worker_C7p0vUmZ.mjs';
import { _ as __vite_glob_0_2 } from '../chunks/devops-with-gitlab_CA6xnR8c.mjs';
import { _ as __vite_glob_0_3 } from '../chunks/dont-learn-claude-code-learn-this-instead_DxXrnuSc.mjs';
import { _ as __vite_glob_0_4 } from '../chunks/installing-self-managed-gitlab-instance-debian-12_BojZd9Sk.mjs';
import { _ as __vite_glob_0_5 } from '../chunks/manage-your-flat-file-based-website-content-with-decap-cms-formerly-netlify-cms_BTPD8KBk.mjs';
import { _ as __vite_glob_0_6 } from '../chunks/vscode-with-docker_C6ZTH76B.mjs';
export { renderers } from '../renderers.mjs';

const siteUrl = "https://ericmaster.github.io";
const staticPages = [
  { url: "/", changefreq: "weekly", priority: "1.0" },
  { url: "/about", changefreq: "weekly", priority: "0.5" },
  { url: "/blog", changefreq: "weekly", priority: "1.0" },
  { url: "/resources", changefreq: "weekly", priority: "0.7" },
  { url: "/work", changefreq: "weekly", priority: "0.6" }
];
const postImports = /* #__PURE__ */ Object.assign({"./posts/delivering-what-matters-the-new-standard-for-ai-era-web-experiences.md": __vite_glob_0_0,"./posts/deploy-your-statically-generated-site-to-a-cloudflare-worker.md": __vite_glob_0_1,"./posts/devops-with-gitlab.md": __vite_glob_0_2,"./posts/dont-learn-claude-code-learn-this-instead.md": __vite_glob_0_3,"./posts/installing-self-managed-gitlab-instance-debian-12.md": __vite_glob_0_4,"./posts/manage-your-flat-file-based-website-content-with-decap-cms-formerly-netlify-cms.md": __vite_glob_0_5,"./posts/vscode-with-docker.md": __vite_glob_0_6});
const postUrls = Object.entries(postImports).filter(
  ([_, mod]) => mod.frontmatter && mod.frontmatter.published === true
).map(([filePath, _]) => {
  const slug = filePath.match(/\.\/posts\/(.*)\.md$/)?.[1];
  return {
    url: slug ? `/posts/${slug}` : null,
    changefreq: "weekly",
    priority: "0.8"
  };
}).filter(Boolean);
const allUrls = [...staticPages, ...postUrls];
const lastmod = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(
  ({ url, changefreq, priority }) => `  <url>
    <loc>${siteUrl}${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
).join("\n")}
</urlset>`;
async function GET() {
  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml"
    }
  });
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
