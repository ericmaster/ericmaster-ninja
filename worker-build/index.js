globalThis.process ??= {}; globalThis.process.env ??= {};
import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_Cgw1N0jf.mjs';
import { manifest } from './manifest_BAwIQn3A.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/about.astro.mjs');
const _page2 = () => import('./pages/ai-cheatsheets.astro.mjs');
const _page3 = () => import('./pages/api/auth.astro.mjs');
const _page4 = () => import('./pages/blog.astro.mjs');
const _page5 = () => import('./pages/content/pages/about-content.astro.mjs');
const _page6 = () => import('./pages/content/pages/blog-content.astro.mjs');
const _page7 = () => import('./pages/content/pages/home-content.astro.mjs');
const _page8 = () => import('./pages/content/pages/resources-content.astro.mjs');
const _page9 = () => import('./pages/content/pages/work-content.astro.mjs');
const _page10 = () => import('./pages/content/resume.astro.mjs');
const _page11 = () => import('./pages/posts/delivering-what-matters-the-new-standard-for-ai-era-web-experiences.astro.mjs');
const _page12 = () => import('./pages/posts/deploy-your-statically-generated-site-to-a-cloudflare-worker.astro.mjs');
const _page13 = () => import('./pages/posts/devops-with-gitlab.astro.mjs');
const _page14 = () => import('./pages/posts/dont-learn-claude-code-learn-this-instead.astro.mjs');
const _page15 = () => import('./pages/posts/installing-self-managed-gitlab-instance-debian-12.astro.mjs');
const _page16 = () => import('./pages/posts/manage-your-flat-file-based-website-content-with-decap-cms-formerly-netlify-cms.astro.mjs');
const _page17 = () => import('./pages/posts/vscode-with-docker.astro.mjs');
const _page18 = () => import('./pages/resources.astro.mjs');
const _page19 = () => import('./pages/sitemap.xml.astro.mjs');
const _page20 = () => import('./pages/tags/_tag_.astro.mjs');
const _page21 = () => import('./pages/work.astro.mjs');
const _page22 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/about.astro", _page1],
    ["src/pages/ai-cheatsheets.ts", _page2],
    ["src/pages/api/auth.ts", _page3],
    ["src/pages/blog.astro", _page4],
    ["src/pages/content/pages/about-content.md", _page5],
    ["src/pages/content/pages/blog-content.md", _page6],
    ["src/pages/content/pages/home-content.md", _page7],
    ["src/pages/content/pages/resources-content.md", _page8],
    ["src/pages/content/pages/work-content.md", _page9],
    ["src/pages/content/resume.md", _page10],
    ["src/pages/posts/delivering-what-matters-the-new-standard-for-ai-era-web-experiences.md", _page11],
    ["src/pages/posts/deploy-your-statically-generated-site-to-a-cloudflare-worker.md", _page12],
    ["src/pages/posts/devops-with-gitlab.md", _page13],
    ["src/pages/posts/dont-learn-claude-code-learn-this-instead.md", _page14],
    ["src/pages/posts/installing-self-managed-gitlab-instance-debian-12.md", _page15],
    ["src/pages/posts/manage-your-flat-file-based-website-content-with-decap-cms-formerly-netlify-cms.md", _page16],
    ["src/pages/posts/vscode-with-docker.md", _page17],
    ["src/pages/resources.astro", _page18],
    ["src/pages/sitemap.xml.ts", _page19],
    ["src/pages/tags/[tag].astro", _page20],
    ["src/pages/work.astro", _page21],
    ["src/pages/index.astro", _page22]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./_noop-actions.mjs'),
    middleware: () => import('./_astro-internal_middleware.mjs')
});
const _args = undefined;
const _exports = createExports(_manifest);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (_start in serverEntrypointModule) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { __astrojsSsrVirtualEntry as default, pageMap };
