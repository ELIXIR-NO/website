import fs from 'fs';
import path from 'path';

function copyAll(root = '.') {
    const contentDir = path.join(root, 'src/content');
    const publicContentDir = path.join(root, 'public/content');

    // Recursively scan for entry folders (those containing index.mdx).
    // Handles arbitrary depth: collection/slug/ or collection/year/slug/.
    function processDir(dir, relPath) {
        const entries = fs.readdirSync(dir);
        if (entries.some(f => /^index\.mdx?$/i.test(f))) {
            // Entry folder — copy every non-MDX file to public/content/
            for (const file of entries) {
                if (/\.(mdx?|md)$/i.test(file)) continue;
                const src = path.join(dir, file);
                if (fs.statSync(src).isDirectory()) continue;
                const dest = path.join(publicContentDir, relPath, file);
                fs.mkdirSync(path.dirname(dest), { recursive: true });
                fs.copyFileSync(src, dest);
            }
        } else {
            for (const entry of entries) {
                const full = path.join(dir, entry);
                if (fs.statSync(full).isDirectory())
                    processDir(full, path.join(relPath, entry));
            }
        }
    }

    for (const collection of fs.readdirSync(contentDir)) {
        const collPath = path.join(contentDir, collection);
        if (!fs.statSync(collPath).isDirectory()) continue;
        // Iterate direct children of the collection dir rather than treating
        // the collection root as an entry (it may contain a flat index.mdx).
        for (const entry of fs.readdirSync(collPath)) {
            const entryPath = path.join(collPath, entry);
            if (fs.statSync(entryPath).isDirectory())
                processDir(entryPath, path.join(collection, entry));
        }
    }

    // Copy media subdirs from src/data/ (people, slides, etc.)
    const dataDir = path.join(root, 'src/data');
    for (const subdir of fs.readdirSync(dataDir)) {
        const srcDir = path.join(dataDir, subdir);
        if (!fs.statSync(srcDir).isDirectory()) continue;
        const destDir = path.join(root, 'public/data', subdir);
        fs.mkdirSync(destDir, { recursive: true });
        for (const file of fs.readdirSync(srcDir)) {
            if (/\.(png|jpg|jpeg|webp|svg)$/i.test(file)) {
                fs.copyFileSync(path.join(srcDir, file), path.join(destDir, file));
            }
        }
    }
}

export function copyContentAssets() {
    return {
        name: 'copy-content-assets',
        buildStart() { copyAll(); },
        configureServer(server) {
            copyAll();
            server.watcher.on('add', (f) => {
                if (f.includes('/src/content/') || f.includes('/src/data/'))
                    copyAll();
            });
        },
    };
}
