export const slugToTitleCase = (slug: string) => slug
    .toLowerCase()
    .split(/[-_.\s]/)
    .map((w) => `${w.charAt(0).toUpperCase()}${w.slice(1)}`)
    .join(' ');

export const sortStringsByLength = (strings: string[]): string[] => {
    return strings.sort((a, b) => a.length - b.length);
};

export const classNames = (...classes): string => {
    return classes.filter(Boolean).join(' ')
}

export const stringToKebabCase = (str: string) => {
    return str
        .toLowerCase() // convert to lowercase
        .replace(/[^a-z0-9\s]/g, '') // remove non-alphanumeric characters except spaces
        .trim() // remove leading/trailing spaces
        .replace(/\s+/g, '-'); // replace spaces with hyphens
};

export const truncateStringToLength = (string: string, length: number) => {
    return (string.length > length)
        ? `${string.substring(0, length).trim()}...`
        : string
};

/**
 * Converts Astro v5 content id to URL-safe slug.
 * entry.id is relative to the collection directory (no collection prefix).
 * Handles both flat files and slug/index.mdx folder structure.
 *
 * Examples (entry.id values):
 * - "article.mdx" → "article"
 * - "article/index.mdx" → "article"
 * - "galaxy.mdx" → "galaxy"
 * - "index.mdx" → "index"  (collection-level flat index stays as-is)
 */
export const idToSlug = (id: string): string => {
    const withoutExt = id.replace(/\.(mdx|md)$/, '');
    const parts = withoutExt.split('/');
    const last = parts.pop();
    // slug/index.mdx → use slug (the folder name), not "index"
    // parts.length > 0 means there's a parent folder name to use as slug
    if (last === 'index' && parts.length > 0) {
        return parts.pop() || last;
    }
    return last || id;
};

/**
 * Resolves a relative asset path (starting with './') from a content entry
 * to its public URL under /content/. Non-relative paths are returned unchanged.
 *
 * Pass `${entry.collection}/${entry.id}` as entryId so the collection name
 * is included in the resolved URL path.
 *
 * Examples:
 * - ("news/2025-05-26_ELITMa/index.mdx", "./cover.jpg") → "/content/news/2025-05-26_ELITMa/cover.jpg"
 * - ("services/galaxy/index.mdx", "/assets/logos/galaxy.png") → "/assets/logos/galaxy.png"
 */
export const resolveContentAsset = (entryId: string, assetPath: string): string => {
    if (!assetPath?.startsWith('./')) return assetPath;
    // "news/2025-05-26_ELITMa/index.mdx" → strip filename → "news/2025-05-26_ELITMa"
    const dir = entryId.replace(/\/[^/]+$/, '');
    return `/content/${dir}/${assetPath.slice(2)}`;
};
