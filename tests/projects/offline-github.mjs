import { appendFileSync } from 'node:fs';

// Controlled external responses for both the independent audit and Astro build.
globalThis.fetch = async (url) => {
  appendFileSync(process.env.PROJECT_REQUEST_LOG, `${url}\n`);
  if (url === 'https://github.com/Memnoc/CodeAtlas') {
    return Response.json({ defaultBranch: 'main', currentOid: 'a'.repeat(40), isFork: false });
  }
  if (String(url).startsWith('https://raw.githubusercontent.com/Memnoc/CodeAtlas/')) {
    return new Response('fixture source');
  }
  if (String(url).includes('/actions/workflows/')) {
    return new Response('<p>CI failed</p>');
  }
  throw new Error('External metadata unavailable in offline build fixture');
};
