import { getCollection } from "astro:content";

// Utility to fetch and process latest blog posts for Astro

export interface BlogPostMeta {
  title: string;
  pubDate?: string;
  description?: string;
  url: string;
  image_url?: string;
}

/**
 * Fetch and process blog posts from the content collection.
 * @param limit Optional. If provided, limits the number of posts returned (sorted by date, newest first).
 * @returns Array of BlogPostMeta objects.
 */
export async function getPosts(limit: number = 10): Promise<BlogPostMeta[]> {
  const allPosts = await getCollection("blog");
  const posts = allPosts
    .filter((entry) => entry.data.published !== false)
    .map((entry) => {
      const fileName = entry.id.replace(/\.md$/, "");
      return {
        title: entry.data.title,
        pubDate: entry.data.pubDate ? String(entry.data.pubDate) : "",
        description: entry.data.description || "",
        url: `/posts/${fileName}`,
        image: entry.data.image,
      };
    })
    .sort((a, b) =>
      b.pubDate && a.pubDate ? b.pubDate.localeCompare(a.pubDate) : 0
    );
  return typeof limit === "number" ? posts.slice(0, limit) : posts;
}
