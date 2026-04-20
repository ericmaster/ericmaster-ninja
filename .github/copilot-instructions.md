# Copilot Coding Instructions

This project uses Astro and tailwindcss. For all interactivity, use Alpine.js, which is loaded globally in the base layout. Do not use React, Vue, or Svelte for client-side interactivity. 

The website is fully responsive, mobile first and works on all devices, including desktops, tablets, and smartphones.

The website is also optimized for search engines, with clean URLs and fast loading times.

## Coding Guidelines

- Follow the Astro 5.x version best practices and only apply patterns verified in the official Astro documentation.
- All styling should use tailwindcss.
- All components should be added to the `src/components` directory and follow Astro component conventions. See: https://docs.astro.build/en/basics/astro-components/
- All pages should be added to the `src/pages` directory.
- All images should be added to the `public/assets/images` directory.
- All blog posts should be added to the `src/pages/posts` directory.
- For any UI interactivity (e.g., toggling menus, modals, etc.), use Alpine.js attributes and patterns.
- Do not include the Alpine.js CDN in individual components or pages; it is already loaded globally.
- Use `{...Astro.props}` to forward all attributes in components that need to receive dynamic attributes (e.g., for Alpine.js bindings).
- All complex and reusable logic should be placed in a util function under the `src/lib` directory, and not directly within components. Components should import and use these utility functions.
- Avoid repeating code. If two or more functions share similar logic, consolidate them into a single reusable function with parameters.
- The blog post collection schema must only include fields that exist in the published markdown files. Do not add fields like `cover` or `draft` unless they are present in the actual content.- **AI Context**: Use the **Astro Docs MCP server** (`https://mcp.docs.astro.build/mcp`) for up-to-date documentation on Astro 5.x.
