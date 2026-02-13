globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_Bd8-x6y9.mjs';

const html = () => "<p>My name is Eric Aguayo, and I’m a passionate software developer, technical architect, and ultra trail runner based in Quito, Ecuador. With over 15 years of experience in software development, I specialize in building robust, scalable web applications—particularly using Drupal, PHP, Python, and JavaScript—and deploying them across modern cloud platforms like AWS, Acquia, and Platform.sh.</p>\n<p>I’ve led and contributed to high-impact projects for organizations across the Americas, including media platforms (Bleacher Report, NY Post), educational institutions (USFQ, Blackboard), and public sector clients (Pega, INEE). I have deep expertise in content management systems (Drupal/WordPress), custom integrations, DevOps, container orchestration with Docker/Kubernetes, and CI/CD pipelines. My work often blends architecture, implementation, and performance optimization across full-stack environments, and I’m proud to be an Acquia Certified Drupal Developer.</p>\n<p>Outside of tech, I’m deeply passionate about the outdoors and spend much of my time in the mountains as an ultra marathon trail runner. This lifestyle of endurance and exploration shapes how I approach challenges—both physical and technical—with patience, grit, and curiosity.</p>\n<p>Currently, I’m building a platform to help others discover and train for ultra running while also working on a technical education initiative aimed at helping beginners learn how to code. I’m constantly exploring new technologies and approaches, and I thrive on continuous improvement—whether it’s refining software systems or personal performance.</p>\n<p>I value community, open source collaboration, and lifelong learning, and I’m always looking for meaningful ways to bridge technology and human impact.</p>";

				const frontmatter = {"title":"About Me"};
				const file = "/app/src/pages/content/pages/about-content.md";
				const url = "/content/pages/about-content";
				function rawContent() {
					return "   \n                 \n   \n\nMy name is Eric Aguayo, and I’m a passionate software developer, technical architect, and ultra trail runner based in Quito, Ecuador. With over 15 years of experience in software development, I specialize in building robust, scalable web applications—particularly using Drupal, PHP, Python, and JavaScript—and deploying them across modern cloud platforms like AWS, Acquia, and Platform.sh.\n\nI’ve led and contributed to high-impact projects for organizations across the Americas, including media platforms (Bleacher Report, NY Post), educational institutions (USFQ, Blackboard), and public sector clients (Pega, INEE). I have deep expertise in content management systems (Drupal/WordPress), custom integrations, DevOps, container orchestration with Docker/Kubernetes, and CI/CD pipelines. My work often blends architecture, implementation, and performance optimization across full-stack environments, and I'm proud to be an Acquia Certified Drupal Developer.\n\nOutside of tech, I’m deeply passionate about the outdoors and spend much of my time in the mountains as an ultra marathon trail runner. This lifestyle of endurance and exploration shapes how I approach challenges—both physical and technical—with patience, grit, and curiosity.\n\nCurrently, I'm building a platform to help others discover and train for ultra running while also working on a technical education initiative aimed at helping beginners learn how to code. I’m constantly exploring new technologies and approaches, and I thrive on continuous improvement—whether it’s refining software systems or personal performance.\n\nI value community, open source collaboration, and lifelong learning, and I’m always looking for meaningful ways to bridge technology and human impact.";
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

export { _page as _ };
