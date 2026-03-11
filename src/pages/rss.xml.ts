import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { idToSlug } from '../lib/utils';

export async function GET(context: any) {
    const news = await getCollection('news');
    const events = await getCollection('events');

    const newsItems = news.map(entry => ({
        title: entry.data.title,
        description: entry.data.summary,
        pubDate: new Date(entry.data.date),
        link: `/news/${idToSlug(entry.id)}/`,
        categories: entry.data.tags ?? [],
    }));

    const eventItems = events.map(entry => ({
        title: entry.data.title,
        description: entry.data.summary,
        pubDate: new Date(entry.data.date),
        link: `/events/${idToSlug(entry.id)}/`,
        categories: ['event'],
    }));

    const items = [...newsItems, ...eventItems]
        .sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

    return rss({
        title: 'ELIXIR Norway',
        description: 'News and events from ELIXIR Norway — the Norwegian node of the European infrastructure for life science data.',
        site: context.site,
        items,
        customData: '<language>en</language>',
    });
}
