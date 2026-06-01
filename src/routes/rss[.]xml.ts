import { createFileRoute } from '@tanstack/react-router';
import { and, desc, isNotNull, lte } from 'drizzle-orm';
import { db } from '~/db';
import { post } from '~/db/schema';

function escape(s: string) {
	return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export const Route = createFileRoute('/rss.xml')({
	server: {
		handlers: {
			GET: async () => {
				const site = process.env.PUBLIC_SITE_URL ?? 'https://sam.land';
				const posts = await db
					.select({
						slug: post.slug,
						title: post.title,
						hook: post.hook,
						publishedAt: post.publishedAt,
					})
					.from(post)
					.where(and(isNotNull(post.publishedAt), lte(post.publishedAt, new Date())))
					.orderBy(desc(post.publishedAt))
					.limit(50);

				const items = posts
					.map(
						(p) => `<item>
  <title>${escape(p.title)}</title>
  <link>${site}/blog/${p.slug}</link>
  <guid>${site}/blog/${p.slug}</guid>
  <description>${escape(p.hook)}</description>
  <pubDate>${p.publishedAt ? new Date(p.publishedAt).toUTCString() : ''}</pubDate>
</item>`,
					)
					.join('\n');

				const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>Sam Apostel</title>
  <link>${site}</link>
  <description>Software, lifestyle and hardware.</description>
${items}
</channel>
</rss>`;

				return new Response(xml, {
					headers: { 'content-type': 'application/rss+xml; charset=utf-8' },
				});
			},
		},
	},
});
