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
    sourceCode: z.string().trim().url().refine(value => {
      try {
        const url = new URL(value);
        return url.protocol === 'https:' && url.hostname === 'github.com'
          && !url.username && !url.password && !url.port
          && /^\/[A-Za-z0-9-]+\/[A-Za-z0-9_.-]+(?:\/|$)/.test(url.pathname);
      } catch {
        return false;
      }
    },
      'Use an HTTPS github.com/owner/repository URL, optionally pointing to a folder or file.',
    ).optional(),
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
