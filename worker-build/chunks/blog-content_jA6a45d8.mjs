globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_Bd8-x6y9.mjs';

const html = () => "<p>This is where I share insights, ideas, and lessons I’ve picked up along the way. Whether it’s something I’ve learned through experience, research, or curiosity, I hope you’ll find value in what I post here.</p>";

				const frontmatter = {"title":"My Awesome Blog"};
				const file = "/app/src/pages/content/pages/blog-content.md";
				const url = "/content/pages/blog-content";
				function rawContent() {
					return "   \n                        \n   \n\nThis is where I share insights, ideas, and lessons I've picked up along the way. Whether it's something I've learned through experience, research, or curiosity, I hope you'll find value in what I post here.";
				}
				async function compiledContent() {
					return await html();
				}
				function getHeadings() {
					return [];
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

export { Content as C, _page as _ };
