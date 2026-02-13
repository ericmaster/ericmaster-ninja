globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_Bd8-x6y9.mjs';

const html = () => "<h2 id=\"hey-there--im-eric-aguayo\">Hey there — I’m Eric Aguayo!</h2>\n<h3 id=\"welcome-to-my-corner-of-the-web\">Welcome to my corner of the web!</h3>\n<p>I’m a <strong>software developer</strong> by trade and an <strong>ultra trail runner</strong> at heart. Whether I’m coding up a new idea or climbing mountain trails, I’m all about pushing limits and exploring new frontiers.</p>\n<p>Right now, I’m working on two projects close to my heart: one to help more people dive into the world of ultra running, and another to make learning Math, Coding and ML more approachable and fun.</p>\n<p>This blog is where I share <strong>my journey</strong> — from tech experiments to trail adventures — and everything in between. If you’re into innovation, endurance, or just curious about blending code with the great outdoors, you’re in the right place.</p>";

				const frontmatter = {};
				const file = "/app/src/pages/content/pages/home-content.md";
				const url = "/content/pages/home-content";
				function rawContent() {
					return "## Hey there — I'm Eric Aguayo!\n\n### Welcome to my corner of the web!\n\nI'm a **software developer** by trade and an **ultra trail runner** at heart. Whether I’m coding up a new idea or climbing mountain trails, I’m all about pushing limits and exploring new frontiers.\n\nRight now, I’m working on two projects close to my heart: one to help more people dive into the world of ultra running, and another to make learning Math, Coding and ML more approachable and fun.\n\nThis blog is where I share **my journey** — from tech experiments to trail adventures — and everything in between. If you're into innovation, endurance, or just curious about blending code with the great outdoors, you're in the right place.\n";
				}
				async function compiledContent() {
					return await html();
				}
				function getHeadings() {
					return [{"depth":2,"slug":"hey-there--im-eric-aguayo","text":"Hey there — I’m Eric Aguayo!"},{"depth":3,"slug":"welcome-to-my-corner-of-the-web","text":"Welcome to my corner of the web!"}];
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
