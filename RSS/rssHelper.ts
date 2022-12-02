import { SerializedArticle } from '../firebase/types';

export const getRssXml = (posts: Array<SerializedArticle>) => {
	const title = 'Sams land';
	const description = '';
	const url = 'https://sams.land';
	const items = posts.map(post => `
		<item>
			<title>${esc(post.title)}</title>
			<link>https://sams.land/${post.slug}</link>
			<pubDate>${post.published}</pubDate>
			<guid isPermaLink="true">sams.land.${post.slug}</guid>
			<description>${esc(post.hook)}</description>
			<content:encoded>${esc(post.content)}</content:encoded>
		</item>
	`);

	// TODO: add image -> <![CDATA[<img align="left" hspace="5" src=""/>

	return `<?xml version="1.0" ?>
		<rss
			xmlns:dc="http://purl.org/dc/elements/1.1/"
			xmlns:content="http://purl.org/rss/1.0/modules/content/"
			xmlns:atom="http://www.w3.org/2005/Atom"
			version="2.0"
		>
		<channel>
		    <title>${title}</title>
		    <link>${url}</link>
		    <description>${description}</description>
		    <lastBuildDate>${posts[0].published}</lastBuildDate>
		    <image>
				<url>https://ua.confessions.link/images/logo.jpg</url>
				<title>${title}</title>
			    <link>${url}</link>
		    </image>
		    ${items}
		</channel>
		</rss>`;
};

const esc = (value: string) => `<![CDATA[${value}]]>`;
