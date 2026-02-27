/**
 * Rehype plugin that rewrites `./filename` asset URLs in MDX body content
 * to their correct public paths under `/content/collection/slug/`.
 *
 * This means authors can write:
 *   ![My image](./photo.png)
 *   [Download](./report.pdf)
 *
 * instead of the full public path.
 */

function walk(node, fn) {
    fn(node);
    if (node.children) node.children.forEach(c => walk(c, fn));
}

export function rehypeRelativeAssets() {
    return (tree, vfile) => {
        const filePath = vfile.history?.[0];
        if (!filePath) return;

        // Match e.g. ".../src/content/news/my-article/index.mdx"
        // → capture "news/my-article"
        const match = filePath.match(/src\/content\/(.+)\/[^/]+\.mdx?$/);
        if (!match) return;

        const publicBase = `/content/${match[1]}/`;

        walk(tree, node => {
            if (node.type !== 'element') return;
            if (node.tagName === 'img' && node.properties?.src?.startsWith('./')) {
                node.properties.src = publicBase + node.properties.src.slice(2);
            }
            if (node.tagName === 'a' && node.properties?.href?.startsWith('./')) {
                node.properties.href = publicBase + node.properties.href.slice(2);
            }
        });
    };
}
