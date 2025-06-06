const siteUrl = "https://ericmaster.github.io";

// List of static pages with their properties
const staticPages = [
  { url: "/", changefreq: "weekly", priority: "1.0" },
  { url: "/about", changefreq: "weekly", priority: "0.5" },
  { url: "/blog", changefreq: "weekly", priority: "1.0" },
  { url: "/resources", changefreq: "weekly", priority: "0.7" },
  { url: "/work", changefreq: "weekly", priority: "0.6" },
];

// Import all posts at build time using import.meta.glob
const postImports = import.meta.glob("./posts/*.md", { eager: true });

// Only include published posts in the sitemap
const postUrls = Object.entries(postImports)
  .filter(
    ([_, mod]: any) => mod.frontmatter && mod.frontmatter.published === true
  )
  .map(([filePath, _]) => {
    const slug = filePath.match(/\.\/posts\/(.*)\.md$/)?.[1];
    return {
      url: slug ? `/posts/${slug}` : null,
      changefreq: "weekly",
      priority: "0.8",
    };
  })
  .filter(Boolean);

// Build allUrls as an array of objects with url, changefreq, and priority
const allUrls = [...staticPages, ...postUrls];

const lastmod = new Date().toISOString().split("T")[0];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    ({ url, changefreq, priority }) =>
      `  <url>\n    <loc>${siteUrl}${url}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`
  )
  .join("\n")}
</urlset>`;

export async function GET() {
  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
