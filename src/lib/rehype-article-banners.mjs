function element(tagName, properties, children) {
  return { type: 'element', tagName, properties, children };
}

const labels = { exercise: 'Exercise', solution: 'Solution', sources: 'Sources' };

// Markdown blockquotes keep code, links, lists, and images in the normal pipeline.
export default function articleBanners() {
  return (tree) => {
    function visit(node) {
      for (const child of node.children ?? []) visit(child);
      if (node.type !== 'element' || node.tagName !== 'blockquote') return;

      const first = node.children.find(child => child.type === 'element');
      if (first?.tagName !== 'p' || first.children.length !== 1) return;
      const marker = first.children[0];
      if (marker.type !== 'text') return;
      // The marker and optional plain-text title occupy their own paragraph.
      const match = /^\[!(EXERCISE|SOLUTION|SOURCES)\](?:[ \t]+([^\n]+))?[ \t]*$/.exec(marker.value);
      if (!match) return;

      const kind = match[1].toLowerCase();
      const label = labels[kind];
      const title = match[2]?.trim();
      const name = title ? `${label}: ${title}` : label;
      const body = node.children.filter(child => child !== first);
      node.tagName = kind === 'solution' ? 'details' : 'section';
      node.properties = {
        className: ['article-banner', `article-${kind}`],
        ...(kind !== 'solution' ? { ariaLabel: name } : {}),
      };
      node.children = [
        element(kind === 'solution' ? 'summary' : 'p', { className: ['article-banner-label'] }, [
          { type: 'text', value: name },
        ]),
        element('div', { className: ['article-banner-body'] }, body),
      ];
    }
    visit(tree);
  };
}
