globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_Bd8-x6y9.mjs';

const html = () => "";

				const frontmatter = {"title":"VS Code with Docker","published":false,"slug":"devops-with-gitlab","description":"TBA","pubDate":"2025-07-10T00:00:00.000Z"};
				const file = "/app/src/pages/posts/vscode-with-docker.md";
				const url = "/posts/vscode-with-docker";
				function rawContent() {
					return "   \n                            \n                \n                          \n                  \n                                 \n   ";
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

const __vite_glob_0_6 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
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

export { __vite_glob_0_6 as _ };
