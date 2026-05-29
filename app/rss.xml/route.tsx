import { getRssXml } from './rssHelper';
import { desc, lt } from 'drizzle-orm';
import { db, Blogpost } from '~/globals/db';
import { blogpost } from '~/globals/schema';

export const dynamic = 'force-dynamic';

export async function GET() {
	const articles = await db
		.select()
		.from(blogpost)
		.where(lt(blogpost.published, new Date()))
		.orderBy(desc(blogpost.published));

	return new Response(getRssXml(articles as unknown as Array<Blogpost & { published: Date }>), {
		headers: new Headers({
			'Content-Type': 'application/rss+xml;charset=UTF-8',
		}),
	});
}
