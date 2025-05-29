import { defineCollection, z } from "astro:content";
import { glob, file } from 'astro/loaders';

const blogCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/pages/posts" }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    description: z.string(),
    pubDate: z.date(),
    updatedDate: z.date().optional(),
    author: z.string().optional(),
    tags: z.array(z.string()).optional(),
    published: z.boolean(),
    image: z.object({
      url: z.string(),
      alt: z.string(),
    }).optional(),
  }),
});

export const collections = {
  blog: blogCollection,
};
