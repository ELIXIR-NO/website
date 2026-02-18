import {defineConfig} from 'astro/config';
import {rehypeHeadingIds} from '@astrojs/markdown-remark';
import react from '@astrojs/react';
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import cloudflare from '@astrojs/cloudflare';
import { copyContentAssets } from './src/plugins/content-assets.mjs';

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
                rehypeHeadingIds
            ]
        }),
        react(),
        tailwind()
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