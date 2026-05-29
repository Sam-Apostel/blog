import styles from './Article.module.scss';

import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { and, eq, lt } from 'drizzle-orm';

import DateTime from '~/components/Date';
import { db, Blogpost } from '~/globals/db';
import { blogpost } from '~/globals/schema';

import Markdown from '~/components/Markdown/Markdown';

export const dynamic = 'force-dynamic';

type PublishedBlogPost = Omit<Blogpost, 'published'> & { published: Date };

function isPublished(post: Blogpost): post is PublishedBlogPost {
	if (!post.published) return false;
	return post.published <= new Date();
}

type PageProps = { params: { slug: string } };

export default async function Article({ params: { slug } }: PageProps) {
	const [post] = await db
		.select()
		.from(blogpost)
		.where(and(eq(blogpost.slug, slug), lt(blogpost.published, new Date())))
		.limit(1);

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
	const [post] = await db.select().from(blogpost).where(eq(blogpost.slug, slug)).limit(1);

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
			locale: 'en-US',
			type: 'article',
			publishedTime: published.toISOString(),
			authors: 'Sam Apostel',
			tags: ['React', 'JavaScript', 'Blog', 'Personal', 'Sam Apostel', ...(keywords ?? [])],
		},
		twitter: {
			card: 'summary',
			title: title,
			description: hook,
			creator: '@sam_apostel',
		},
	};
}
