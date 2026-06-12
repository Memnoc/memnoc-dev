# matteostara.com

Portfolio site. Astro 6 static site with React islands.

## Stack

- [Astro 6](https://astro.build) — static site generator
- React 19 — interactive islands (`client:only`)
- Rosé Pine color scheme (Moon / Dawn)
- Markdown content layer for writing

## Dev

```sh
pnpm dev      # localhost:4321
pnpm build    # static output → dist/
pnpm preview  # preview build locally
```

Requires Node ≥ 22.12.

## Structure

```
src/
  components/   # React islands (AstViewer)
  content/blog/ # Markdown posts
  layouts/      # Base layout
  pages/        # Routes
  styles/       # global.css
public/         # Static assets
```

## Writing

Blog posts live in `src/content/blog/` as `.md` files. Frontmatter:

```yaml
---
title: Post title
date: 2026-06-10
description: One-line description.
draft: false
tags: [compilers, c_language]
---
```

## License

MIT
