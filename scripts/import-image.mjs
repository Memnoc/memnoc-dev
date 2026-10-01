import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import sharp from 'sharp';

const usage = 'Usage: pnpm image:add SOURCE --post learning-c --name cover [--json]';

async function main() {
  const { values, positionals } = parseArgs({
    options: {
      post: { type: 'string' },
      name: { type: 'string' },
      json: { type: 'boolean' },
      help: { type: 'boolean' },
    },
    allowPositionals: true,
  });
  if (values.help) return console.log(usage);
  if (positionals.length !== 1 || !values.post || !values.name) throw new Error(usage);
  for (const key of ['post', 'name']) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(values[key])) {
      throw new Error(`--${key} must use lowercase letters, numbers, and single hyphens.`);
    }
  }

  const source = resolve(positionals[0]);
  const metadata = await sharp(source).metadata();
  const extensions = { jpeg: 'jpg', png: 'png', webp: 'webp' };
  const extension = extensions[metadata.format];
  if (!extension || (metadata.pages ?? 1) > 1) {
    throw new Error('Use a static JPEG, PNG, or WebP image; animated images and SVGs are not imported.');
  }

  let image = sharp(source).rotate().resize({ width: 1600, withoutEnlargement: true });
  if (metadata.format === 'jpeg') image = image.jpeg({ quality: 85, mozjpeg: true });
  if (metadata.format === 'png') image = image.png({ compressionLevel: 9, adaptiveFiltering: true });
  if (metadata.format === 'webp') image = image.webp({ quality: 85 });
  // Sharp strips source metadata by default. Rotate before resizing so EXIF
  // orientation becomes actual pixels instead of being lost with the metadata.
  const { data, info } = await image.toBuffer({ resolveWithObject: true });
  const path = join('src', 'assets', 'blog', values.post, `${values.name}.${extension}`);
  await mkdir(dirname(path), { recursive: true });
  try {
    await writeFile(path, data, { flag: 'wx' });
  } catch (error) {
    if (error.code === 'EEXIST') throw new Error(`${path} already exists. Choose another --name; nothing was overwritten.`);
    throw error;
  }

  const reference = relative('src/content/blog', path).split('\\').join('/');
  const report = {
    path: path.split('\\').join('/'),
    width: info.width,
    height: info.height,
    bytes: info.size,
    markdown: `![Describe this image](${reference})`,
    frontmatter: `image: "${reference}"`,
  };
  if (values.json) console.log(JSON.stringify(report));
  else console.log(`Imported ${report.path} (${info.width} × ${info.height}, ${info.size.toLocaleString()} bytes)\nOriginal unchanged: ${source}\n\nMarkdown:\n${report.markdown}\n\nOptional Writing thumbnail:\n${report.frontmatter}`);
}

await main().catch(error => {
  console.error(`image:add: ${error.message}`);
  process.exitCode = 1;
});
