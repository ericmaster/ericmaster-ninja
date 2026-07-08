import { getCollection, type CollectionEntry } from "astro:content";

// Utility to fetch and process latest blog posts for Astro

/**
 * Fetch and process blog posts from the content collection.
 * @param limit Optional. If provided, limits the number of posts returned (sorted by date, newest first).
 * @param lang Optional. Locale string (e.g. 'en', 'es'). Defaults to returning 'en' if no matching posts are found.
 * @returns Array of CollectionEntry<"blog"> objects.
 */
export async function getPosts(
  limit?: number,
  lang?: string
): Promise<CollectionEntry<"blog">[]> {
  const allPosts = await getCollection("blog");
  let posts = allPosts.filter((post) => post.data.published !== false);

  if (lang) {
    const langPosts = posts.filter((post) => (post.data.lang || "en") === lang);
    if (langPosts.length > 0) {
      posts = langPosts;
    } else {
      posts = posts.filter((post) => (post.data.lang || "en") === "en");
    }
  } else {
    posts = posts.filter((post) => (post.data.lang || "en") === "en");
  }

  posts = posts
    .map((post) => {
      if (
        post.data.image &&
        typeof post.data.image.url === "string" &&
        !post.data.image.url.startsWith("/")
      ) {
        post.data.image.url = "/" + post.data.image.url;
      }
      return post;
    })
    .sort((a, b) =>
      b.data.pubDate && a.data.pubDate
        ? new Date(b.data.pubDate).getTime() -
          new Date(a.data.pubDate).getTime()
        : 0
    );
  return typeof limit === "number" ? posts.slice(0, limit) : posts;
}
