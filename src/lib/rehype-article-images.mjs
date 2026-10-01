// Match Base's 680px outer column, including its desktop/mobile padding.
const sizes = '(min-width: 680px) 632px, (max-width: 480px) calc(100vw - 32px), calc(100vw - 48px)';

export default function articleImages() {
  return (tree, file) => {
    const localImages = new Set(file.data.astro?.localImagePaths ?? []);
    let first = true;
    function visit(node) {
      if (node.type === 'element' && node.tagName === 'img' && localImages.has(node.properties.src)) {
        node.properties.sizes = sizes;
        node.properties.loading = first ? 'eager' : 'lazy';
        // Text and line art benefit from a little more encoding quality.
        if (/\.png$/i.test(node.properties.src)) node.properties.quality = 90;
        first = false;
      }
      for (const child of node.children ?? []) visit(child);
    }
    visit(tree);
  };
}
