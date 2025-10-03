import { defineCollection, z } from 'astro:content';

import { glob } from 'astro/loaders';

const organizations = defineCollection({
    loader: glob({ pattern: "**/*.mdx", base: "./src/content/about/organizations" }),
    schema: z.object({
        title: z.string(),
    })
})

export const collections = { organizations };