import { Blogpost } from '~/globals/db';

export const getRssXml = (posts: Array<Blogpost & { published: Date }>) => {
	const title = 'Sams land';
	const description = 'Sam Apostel';
	const url = 'https://sams.land';
	const items = posts.map(
		(post) => `
		<item>
			<title>${esc(post.title)}</title>
			<link>https://sams.land/a/${post.slug}</link>
			<pubDate>${post.published.toISOString()}</pubDate>
			<guid isPermaLink="true">https://sams.land/a/${post.slug}</guid>
			<author>sam@apostel.be</author>
			<description>${esc(post.hook)}</description>
			<source:markdown>${esc(post.content)}</source:markdown>
			<content:encoded>${esc(post.content)}</content:encoded>
		</item>`
	);

	// ${post.cover ? `<![CDATA[<img align="left" hspace="5" src="https://sams.land/${post.cover}"/>` : ''}

	return `<?xml version="1.0" encoding="utf-8"?>
<rss
	xmlns:source="http://source.scripting.com/"
	xmlns:content="http://purl.org/rss/1.0/modules/content/"
	version="2.0"
>
	<channel>
		<title>${title}</title>
		<link>${url}</link>
		<description>${description}</description>
		<lastBuildDate>${posts[0].published}</lastBuildDate>
		<category>Web development</category>
		<copyright>© copyright 2022-${new Date().getFullYear()} Sam Apostel.</copyright>
		<language>en-us</language>
		<source:account service="twitter">sam_apostel</source:account>
		${items.join('\n')}
	</channel>
</rss>`;
};

const esc = (value: string) => `<![CDATA[${value}]]>`;
