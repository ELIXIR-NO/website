import {defineConfig} from 'astro/config';
import {rehypeHeadingIds} from '@astrojs/markdown-remark';
import react from '@astrojs/react';
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import cloudflare from '@astrojs/cloudflare';
import { copyContentAssets } from './src/plugins/content-assets.mjs';
import { rehypeRelativeAssets } from './src/plugins/rehype-relative-assets.mjs';
import fs from 'fs';

/**
 * Astro integration that post-processes _routes.json after build.
 *
 * Cloudflare limits _routes.json to 100 rules. With hundreds of prerendered
 * pages the adapter would silently truncate the list, causing many pages to
 * be served via the Worker instead of directly as static files.
 *
 * This replaces per-page entries with per-section wildcards (safe because
 * every page in these sections is prerendered) and collapses all pagefind
 * files into a single wildcard, keeping the total rule count low regardless
 * of how many articles are added in the future.
 */
function consolidateRoutes() {
    // Sections where every page is prerendered — safe to wildcard.
    const staticSections = [
        '/news',
        '/events',
        '/services',
        '/about',
        '/funding-and-projects',
    ];

    return {
        name: 'consolidate-cloudflare-routes',
        hooks: {
            'astro:build:done': ({ dir }) => {
                const routesPath = new URL('_routes.json', dir);
                if (!fs.existsSync(routesPath)) return;
                const routes = JSON.parse(fs.readFileSync(routesPath, 'utf8'));

                // Remove all per-page entries for fully-static sections
                // and the individual pagefind file entries.
                routes.exclude = routes.exclude.filter(r =>
                    !staticSections.some(s => r === s || r.startsWith(s + '/')) &&
                    !r.startsWith('/pagefind/')
                );

                // Add one wildcard per section (covers index + all sub-pages)
                // and a single pagefind wildcard.
                routes.exclude.unshift(
                    '/pagefind/*',
                    ...staticSections.flatMap(s => [s, s + '/*']),
                );

                fs.writeFileSync(routesPath, JSON.stringify(routes, null, 2));
            },
        },
    };
}

// https://astro.build/config
export default defineConfig({
    redirects: {
        // Events — slug normalisation (underscore/uppercase → kebab-case)
        '/events/2025-06-10_arendalsuka':                            { destination: '/events/2025-06-10-arendalsuka',                            status: 301 },
        '/events/2025-10-20_ELIXIR-Industry-engagement-day':         { destination: '/events/2025-10-20-elixir-industry-engagement-day',         status: 301 },

        // News — slug normalisation
        '/news/20250210-call_for_services':                           { destination: '/news/2025-02-10-call-for-services',                        status: 301 },
        '/news/2025-05-26_ELITMa':                                    { destination: '/news/2025-05-26-elitma',                                   status: 301 },
        '/news/2025-06-02_AHM-Europe':                                { destination: '/news/2025-06-02-ahm-europe',                               status: 301 },
        '/news/2025_09_17_EOSC_ENTRUST_Workshop':                     { destination: '/news/2025-09-17-eosc-entrust-workshop',                    status: 301 },
        '/news/2025-10-06_CHARM-EU_Open_Science_Recognition_Award':   { destination: '/news/2025-10-06-charm-eu-open-science-recognition-award',  status: 301 },
        '/news/2025-10-20_ELIXIR_Industry_Engagement_Day':            { destination: '/news/2025-10-20-elixir-industry-engagement-day',           status: 301 },
        '/news/2025-10-27_NeLS_scheduled_maintenance_November':       { destination: '/news/2025-10-27-nels-scheduled-maintenance-november',      status: 301 },
        '/news/2026-01-12_Jaspar_CDR':                                { destination: '/news/2026-01-12-jaspar-cdr',                               status: 301 },
    },
    // Enable React to support React JSX components.
    integrations: [
        mdx({
            rehypePlugins: [
                rehypeHeadingIds,
                rehypeRelativeAssets,
            ]
        }),
        react(),
        tailwind(),
        consolidateRoutes(),
    ],
    vite: {
        css: {
            transformer: "sass"
        },
        plugins: [copyContentAssets()],
    },
    output: "server",
    adapter: cloudflare(),
});