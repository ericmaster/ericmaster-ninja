const siteUrl = "https://ericmaster.github.io";

// List of static pages
const staticPages = ["/", "/about", "/blog", "/resources", "/work"];

// Import all posts at build time using import.meta.glob
const postImports = import.meta.glob("./posts/*.md", { eager: true });

// Only include published posts in the sitemap
const postUrls = Object.entries(postImports)
  .filter(([_, mod]: any) => mod.frontmatter && mod.frontmatter.published === true)
  .map(([filePath, _]) => {
    const slug = filePath.match(/\.\/posts\/(.*)\.md$/)?.[1];
    return slug ? `/posts/${slug}` : null;
  })
  .filter(Boolean);

const allUrls = [...staticPages, ...postUrls];

const lastmod = new Date().toISOString().split("T")[0];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (url) =>
      `  <url>\n    <loc>${siteUrl}${url}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>`
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
