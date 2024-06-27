import styles from './Article.module.scss';

import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import DateTime from '~/components/Date';
import { getXataClient, Blogpost } from '~/globals/db';

import Markdown from '~/components/Markdown/Markdown';

const xata = getXataClient();

const dedicatedPages = ['communication-between-components'];

export async function generateStaticParams() {
	const posts = await xata.db.blogpost
		.filter({ published: { $lt: new Date() } })
		.select(['slug'])
		.getAll();

	return posts
		.filter((post) => !dedicatedPages.includes(post.slug!))
		.map((post) => ({
			slug: post.slug,
		}));
}

type PublishedBlogPost = Omit<Blogpost, 'published'> & { published: Date };

function isPublished(post: Blogpost): post is PublishedBlogPost {
	if (!post.published) return false;
	return post.published <= new Date();
}

type PageProps = { params: { slug: string } };

export default async function Article({ params: { slug } }: PageProps) {
	const post = (await xata.db.blogpost
		.filter({
			$all: [{ slug }, { published: { $lt: new Date() } }],
		})
		.getFirst()) as Blogpost | null;

	if (!post) notFound();
	if (!isPublished(post)) notFound();

	const { content, published } = post;

	return (
		<main>
			<DateTime date={published} className={styles.published} />
			<Link href="../../" className={styles.back}>
				{'<- '}GOBACK
			</Link>
			<article className={styles.content}>
				<Markdown>{content}</Markdown>
			</article>
		</main>
	);
}

export async function generateMetadata({ params: { slug } }: PageProps): Promise<Metadata> {
	const post = (await xata.db.blogpost
		.filter({
			$all: [{ slug }],
		})
		.getFirst()) as Blogpost | null;

	if (!post) notFound();
	if (!isPublished(post)) notFound();

	const { title, hook, canonical, keywords, published } = post;

	return {
		title: title,
		description: hook,
		alternates: {
			canonical: canonical ?? `https://sams.land/a/${slug}`,
		},
		keywords: ['React', 'JavaScript', 'Blog', 'Personal', 'Sam Apostel', ...(keywords ?? [])],
		openGraph: {
			title: `${title} | Sam Apostel`,
			description: hook,
			url: `https://sams.land/a/${slug}`,
			siteName: 'sams.land',
			// images: [
			// 	{
			// 		url: `https://sams.land/a/${slug}/og.png`,
			// 		width: 1800,
			//      height: 1600,
			// 	},
			// ],
			locale: 'en-US',
			type: 'article',
			publishedTime: published.toISOString(),
			authors: 'Sam Apostel',
			tags: ['React', 'JavaScript', 'Blog', 'Personal', 'Sam Apostel', ...(keywords ?? [])],
		},
		twitter: {
			card: 'summary', // summary_large_image
			title: title,
			description: hook,
			creator: '@sam_apostel',
			// 	images: ['https://sams.land/og.png'],
		},
	};
}
