import { readFile, readdir, stat } from 'node:fs/promises';
import { dirname, extname, join, relative, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { load } from 'js-yaml';
import { parse, parseFragment } from 'parse5';
import remarkParse from 'remark-parse';
import sharp from 'sharp';
import { unified } from 'unified';

const raster = /\.(?:jpe?g|png|webp|avif|gif)$/i;
const root = process.cwd();
const report = { errors: [], warnings: [], sources: [], outputs: [] };
const metadata = new Map();
const outputUses = new Map();

function walk(node, visit) {
  visit(node);
  for (const child of node.children ?? node.childNodes ?? []) walk(child, visit);
}

function srcsetUrls(value = '') {
  const urls = [];
  let rest = value;
  while (rest) {
    rest = rest.replace(/^[\s,]+/, '');
    const token = rest.match(/^\S+/)?.[0];
    if (!token) break;
    urls.push(token.replace(/,+$/, ''));
    rest = rest.slice(token.length);
    // Commas inside URLs (notably data URIs) are valid. Only a trailing
    // comma or the comma after width/density descriptors ends a candidate.
    if (!token.endsWith(',')) {
      const end = rest.indexOf(',');
      rest = end === -1 ? '' : rest.slice(end + 1);
    }
  }
  return urls;
}

function htmlImageReferences(tree) {
  const references = [];
  walk(tree, node => {
    if (node.tagName !== 'img' && node.tagName !== 'source') return;
    const attrs = Object.fromEntries(node.attrs.map(({ name, value }) => [name, value]));
    const use = attrs.class?.split(/\s+/).includes('post-thumb') ? 'thumbnail' : 'article';
    if (node.tagName === 'img') references.push([attrs.src, use]);
    for (const url of srcsetUrls(attrs.srcset)) references.push([url, use]);
  });
  return references;
}

async function files(path) {
  try {
    const entries = await readdir(path, { withFileTypes: true });
    const nested = await Promise.all(entries.map(entry => entry.isDirectory()
      ? files(join(path, entry.name)) : [join(path, entry.name)]));
    return nested.flat().sort();
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
}

async function measure(path) {
  if (!metadata.has(path)) {
    metadata.set(path, Promise.all([stat(path), sharp(path).metadata()]).then(([file, image]) => ({
      path: relative(root, path).split('\\').join('/'),
      bytes: file.size, width: image.width, height: image.height,
    })));
  }
  return metadata.get(path);
}

async function reference(url, owner, base, use) {
  if (typeof url !== 'string' || !url) return;
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(url)) {
    if (!url.startsWith('data:')) report.warnings.push(`${relative(root, owner)}: external image not audited: ${url}`);
    return;
  }
  try {
    const clean = decodeURIComponent(url.split(/[?#]/)[0]);
    const path = clean.startsWith('/') ? resolve(base, `.${clean}`) : resolve(dirname(owner), clean);
    const relativePath = relative(root, path);
    if (relativePath.startsWith('..')) throw new Error('reference is outside the project');
    const file = await stat(path);
    if (!file.isFile()) throw new Error('reference is not a file');
    if (!use && path.startsWith(resolve('public') + '/')) {
      report.warnings.push(`${relative(root, owner)}: ${url} bypasses image optimization (public/).`);
    }
    if (use && raster.test(path)) {
      const uses = outputUses.get(path) ?? new Set();
      uses.add(use);
      outputUses.set(path, uses);
    }
  } catch (error) {
    report.errors.push(`${relative(root, owner)}: ${url}: ${error.code === 'ENOENT' ? 'missing local image' : error.message}`);
  }
}

async function checkSource(file) {
  let body = await readFile(file, 'utf8');
  const frontmatter = body.match(/^---\r?\n([\s\S]*?)\r?\n(?:---|\.\.\.)(?:\r?\n|$)/);
  if (frontmatter) {
    try {
      const data = load(frontmatter[1]);
      await reference(data?.image, file, resolve('public'));
    } catch (error) {
      report.errors.push(`${relative(root, file)}: invalid frontmatter: ${error.message}`);
    }
    body = body.slice(frontmatter[0].length);
  }
  const tree = unified().use(remarkParse).parse(body);
  const definitions = new Map();
  walk(tree, node => { if (node.type === 'definition') definitions.set(node.identifier, node.url); });
  const refs = [];
  walk(tree, node => {
    if (node.type === 'image') refs.push(node.url);
    if (node.type === 'imageReference') refs.push(definitions.get(node.identifier));
    if (node.type === 'html') {
      refs.push(...htmlImageReferences(parseFragment(node.value)).map(([url]) => url));
    }
  });
  for (const url of refs) await reference(url, file, resolve('public'));
}

async function checkOutput(file) {
  const references = htmlImageReferences(parse(await readFile(file, 'utf8')));
  for (const [url, use] of references) await reference(url, file, resolve('dist'), use);
}

async function main() {
  const { values } = parseArgs({ options: {
    json: { type: 'boolean' },
    'source-only': { type: 'boolean' },
    built: { type: 'boolean' },
  } });
  if (values.built && values['source-only']) throw new Error('Choose --built or --source-only, not both.');
  for (const file of await files(resolve('src/content/blog'))) {
    if (extname(file) === '.md') await checkSource(file);
  }
  for (const folder of ['src/assets/blog', 'public/blog']) {
    for (const path of await files(resolve(folder))) {
      if (!raster.test(path)) continue;
      try {
        const image = await measure(path);
        report.sources.push(image);
        if (image.bytes > 500_000 || image.width > 1600) {
          report.warnings.push(`${image.path}: oversized source (${image.bytes} bytes, ${image.width}px wide). Import with pnpm image:add.`);
        }
        if (folder === 'public/blog') report.warnings.push(`${image.path}: public/ asset is copied without optimization.`);
      } catch (error) { report.errors.push(`${relative(root, path)}: ${error.message}`); }
    }
  }
  if (!values['source-only']) {
    const output = await files(resolve('dist'));
    if (!output.length) {
      (values.built ? report.errors : report.warnings).push('No build output. Run pnpm build before auditing generated images.');
    }
    for (const file of output) if (extname(file) === '.html') await checkOutput(file);
    for (const [path, uses] of outputUses) {
      try {
        const image = { ...await measure(path), uses: [...uses].sort() };
        report.outputs.push(image);
        const budget = uses.has('thumbnail') ? 30_000 : 300_000;
        if (image.bytes > budget) report.warnings.push(`${image.path}: large ${image.uses.join('/')} output (${image.bytes} bytes; advisory budget ${budget}).`);
      } catch (error) { report.errors.push(`${relative(root, path)}: ${error.message}`); }
    }
  }
  report.errors = [...new Set(report.errors)];
  report.warnings = [...new Set(report.warnings)];
  if (values.json) console.log(JSON.stringify(report, null, 2));
  else {
    for (const [label, images] of [['Sources', report.sources], ['Last build: referenced images', report.outputs]]) {
      console.log(`${label}: ${images.length} files, ${images.reduce((sum, image) => sum + image.bytes, 0).toLocaleString()} bytes`);
      for (const image of images) console.log(`  ${image.bytes.toLocaleString()} B | ${image.width}×${image.height} | ${image.path}${image.uses ? ` [${image.uses.join(', ')}]` : ''}`);
    }
    for (const warning of report.warnings) console.log(`WARN: ${warning}`);
    for (const error of report.errors) console.error(`ERROR: ${error}`);
    console.log(`${report.errors.length} errors; ${report.warnings.length} warnings (size budgets are advisory).`);
  }
  process.exitCode = report.errors.length ? 1 : 0;
}

await main().catch(error => {
  console.error(`check:images: ${error.message}`);
  process.exitCode = 1;
});
