import { defineCollection, z } from 'astro:content';

const news = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.string(),
    summary: z.string(),
    cover: z.object({
      source: z.string(),
    }).optional(),
    layout: z.string().optional(),
    variant: z.string().optional(),
  }),
});

const services = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    logo: z.string().optional(),
    tags: z.array(z.string()).optional(),
    layout: z.string().optional(),
    variant: z.string().optional(),
  }),
});

const events = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.string(),
    summary: z.string(),
    cover: z.object({
      source: z.string(),
    }).optional(),
    layout: z.string().optional(),
    variant: z.string().optional(),
  }),
});

const about = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().optional(),
    summary: z.string().optional(),
    logo: z.string().optional(),
    layout: z.string().optional(),
    variant: z.string().optional(),
  }),
});

const fundingAndProjects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    summary: z.string().optional(),
    date: z.string().optional(),
    cover: z.object({
      source: z.string(),
    }).optional(),
    layout: z.string().optional(),
    variant: z.string().optional(),
  }),
});

const accessibility = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().optional(),
    layout: z.string().optional(),
    variant: z.string().optional(),
  }),
});

const banner = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().optional(),
    layout: z.string().optional(),
    variant: z.string().optional(),
  }),
});

const landing = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().optional(),
    layout: z.string().optional(),
    variant: z.string().optional(),
  }),
});

const researchSupport = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().optional(),
    summary: z.string().optional(),
    layout: z.string().optional(),
    variant: z.string().optional(),
  }),
});

const training = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().optional(),
    summary: z.string().optional(),
    date: z.string().optional(),
    layout: z.string().optional(),
    variant: z.string().optional(),
  }),
});

export const collections = {
  news,
  services,
  events,
  about,
  'funding-and-projects': fundingAndProjects,
  accessibility,
  banner,
  landing,
  'research-support': researchSupport,
  training,
};
