globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_Bd8-x6y9.mjs';

const html = () => "<h2 id=\"coming-soon\">Coming soon!</h2>";

				const frontmatter = {"title":"Work"};
				const file = "/app/src/pages/content/pages/work-content.md";
				const url = "/content/pages/work-content";
				function rawContent() {
					return "   \n             \n   \n## Coming soon!";
				}
				async function compiledContent() {
					return await html();
				}
				function getHeadings() {
					return [{"depth":2,"slug":"coming-soon","text":"Coming soon!"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`<meta charset="utf-8">${maybeRenderHead()}${unescapeHTML(html())}`;
				});

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	Content,
	compiledContent,
	default: Content,
	file,
	frontmatter,
	getHeadings,
	rawContent,
	url
}, Symbol.toStringTag, { value: 'Module' }));

export { _page as _ };
