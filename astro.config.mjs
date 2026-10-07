// @ts-check
import { defineConfig } from 'astro/config';
import { execSync } from 'child_process';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import { unified } from '@astrojs/markdown-remark';
import articleImages from './src/lib/rehype-article-images.mjs';
import articleBanners from './src/lib/rehype-article-banners.mjs';

let gitHash = 'unknown';
try {
  gitHash = execSync('git rev-parse --short HEAD').toString().trim();
} catch {}

export default defineConfig({
  integrations: [react(), mdx()],
  image: {
    layout: 'constrained',
    breakpoints: [400, 800, 1200, 1600],
    responsiveStyles: true,
  },
  markdown: { processor: unified({ rehypePlugins: [articleBanners, articleImages] }) },
  vite: {
    define: {
      __GIT_HASH__: JSON.stringify(gitHash),
    },
  },
});
