// Utility to fetch and process latest blog posts for Astro

export interface BlogPostMeta {
  title: string;
  pubDate: string;
  description: string;
  url: string;
  image_url: string;
}

/**
 * Fetch and process blog posts from the posts directory.
 * @param limit Optional. If provided, limits the number of posts returned (sorted by date, newest first).
 * @returns Array of BlogPostMeta objects.
 */
export async function getPosts(limit: number = 10): Promise<BlogPostMeta[]> {
  const allPosts = Object.entries(
    await import.meta.glob("../pages/posts/*.md", { eager: true })
  ).map(([filePath, post]) => {
    if (!post || typeof post !== "object" || !("frontmatter" in post))
      return null;
    const frontmatter =
      (post as { frontmatter?: Record<string, any> }).frontmatter || {};
    if ("published" in frontmatter && frontmatter.published === false)
      return null;
    const fileName = filePath.split("/").pop() || "";
    return {
      title: "title" in frontmatter ? frontmatter.title : fileName,
      pubDate:
        "pubDate" in frontmatter
          ? frontmatter.pubDate
          : "date" in frontmatter
            ? frontmatter.date
            : "",
      description: "description" in frontmatter ? frontmatter.description : "",
      url: `/posts/${fileName.replace(/\.md$/, "")}`,
      image_url:
        "image" in frontmatter
          ? frontmatter.image.url
          : `/images/posts/${fileName.replace(/\.md$/, "")}.jpg`,
    };
  });
  const posts = (allPosts as Array<BlogPostMeta | null>)
    .filter((p): p is BlogPostMeta => p !== null)
    .sort((a, b) =>
      b && a && b.pubDate && a.pubDate ? b.pubDate.localeCompare(a.pubDate) : 0
    );
  return typeof limit === "number" ? posts.slice(0, limit) : posts;
}
