import { getRssXml } from './rssHelper';
import { Blogpost, getXataClient } from '~/globals/db';

const xata = getXataClient();

export async function GET() {
	const articles = await xata.db.blogpost
		.filter({ published: { $lt: new Date() } })
		.sort('published', 'desc')
		.getAll();

	return new Response(getRssXml(articles as unknown as Array<Blogpost & { published: Date }>), {
		headers: new Headers({
			'Content-Type': 'application/rss+xml;charset=UTF-8',
		}),
	});
}
