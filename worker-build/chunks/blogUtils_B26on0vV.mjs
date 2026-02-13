globalThis.process ??= {}; globalThis.process.env ??= {};
import { g as getCollection } from './_astro_content_C20JJMmr.mjs';

async function getPosts(limit = 10) {
  const allPosts = await getCollection("blog");
  const posts = allPosts.filter((post) => post.data.published !== false).map((post) => {
    if (post.data.image && typeof post.data.image.url === "string" && !post.data.image.url.startsWith("/")) {
      post.data.image.url = "/" + post.data.image.url;
    }
    return post;
  }).sort(
    (a, b) => b.data.pubDate && a.data.pubDate ? new Date(b.data.pubDate).getTime() - new Date(a.data.pubDate).getTime() : 0
  );
  return typeof limit === "number" ? posts.slice(0, limit) : posts;
}

export { getPosts as g };
