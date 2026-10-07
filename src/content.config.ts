import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/blog' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    date: z.date(),
    description: z.string(),
    tldr: z.string().trim().optional(),
    disclaimer: z.string().trim().optional(),
    course: z.object({
      name: z.string().trim().min(1),
      lesson: z.number().int().nonnegative(),
    }).optional(),
    draft: z.boolean().optional().default(false),
    tags: z.array(z.string()).optional().default([]),
    image: image().optional(),
  }),
});

export const collections = { blog };
