// RSS feed — /rss.xml จากคอลเลกชัน blog
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { SITE } from '@/consts';

export async function GET(context: APIContext) {
  const posts = (await getCollection('blog')).filter((p) => !p.data.draft);

  return rss({
    title: SITE.name,
    description: SITE.description,
    // context.site มาจาก `site` ใน astro.config
    site: context.site ?? SITE.title,
    items: posts
      .sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf())
      .map((post) => ({
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.publishedAt,
        link: `/blog/${post.id}/`,
      })),
    customData: `<language>${SITE.lang}</language>`,
  });
}
