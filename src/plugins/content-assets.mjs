import fs from 'fs';
import path from 'path';

function copyAll(root = '.') {
    const contentDir = path.join(root, 'src/content');
    const publicContentDir = path.join(root, 'public/content');

    // Copy assets from each collection's slug subfolders
    for (const collection of fs.readdirSync(contentDir)) {
        const collPath = path.join(contentDir, collection);
        if (!fs.statSync(collPath).isDirectory()) continue;
        for (const slug of fs.readdirSync(collPath)) {
            const slugPath = path.join(collPath, slug);
            if (!fs.statSync(slugPath).isDirectory()) continue;
            for (const file of fs.readdirSync(slugPath)) {
                if (/\.(mdx?|md)$/i.test(file)) continue;  // skip MDX
                const src = path.join(slugPath, file);
                const dest = path.join(publicContentDir, collection, slug, file);
                fs.mkdirSync(path.dirname(dest), { recursive: true });
                fs.copyFileSync(src, dest);
            }
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
