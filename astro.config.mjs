// @ts-check
import { defineConfig } from "astro/config";
import Icons from "unplugin-icons/vite";
import tailwindcss from "@tailwindcss/vite";

import icon from "astro-icon";

import sitemap from "@astrojs/sitemap";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

/** Adds target="_blank" rel="noopener noreferrer" to external links at build time. */
function rehypeExternalLinks() {
  /** @param {import('hast').Node} node */
  function walk(node) {
    if (
      node.type === "element" &&
      /** @type {any} */ (node).tagName === "a"
    ) {
      const el = /** @type {import('hast').Element} */ (node);
      const href = String(el.properties?.href ?? "");
      if (/^https?:\/\//.test(href) && !href.includes("ericmaster.ninja")) {
        el.properties.target = "_blank";
        el.properties.rel = ["noopener", "noreferrer"];
      }
    }
    if (/** @type {any} */ (node).children) {
      /** @type {any} */ (node).children.forEach(walk);
    }
  }
  return (/** @type {import('hast').Root} */ tree) => walk(tree);
}

// https://astro.build/config
export default defineConfig({
  site: "https://ericmaster.ninja",
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    routing: { prefixDefaultLocale: false },
    fallback: { es: 'en' },
  },

  markdown: {
    syntaxHighlight: {
      type: 'shiki',
      excludeLangs: ['mermaid'],
    },
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex, rehypeExternalLinks],
  },

  vite: {
    plugins: [
      Icons({
        compiler: "astro",
        autoInstall: true,
      }),
      tailwindcss(),
    ],
  },

  integrations: [icon(), sitemap()],
});