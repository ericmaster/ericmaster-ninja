# Copilot Coding Instructions

This project uses Astro and tailwindcss. For all interactivity, use Alpine.js, which is loaded globally in the base layout. Do not use React, Vue, or Svelte for client-side interactivity. 

- All styling should use tailwindcss.
- All components should be added to the `src/components` directory and follow Astro component conventions.
- All pages should be added to the `src/pages` directory.
- All images should be added to the `src/assets` directory.
- All blog posts should be added to the `src/pages/posts` directory.
- For any UI interactivity (e.g., toggling menus, modals, etc.), use Alpine.js attributes and patterns.
- Do not include the Alpine.js CDN in individual components or pages; it is already loaded globally.
- Use `{...Astro.props}` to forward all attributes in components that need to receive dynamic attributes (e.g., for Alpine.js bindings).
