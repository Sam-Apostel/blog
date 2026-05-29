import styles from './Article.module.scss';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { and, eq } from 'drizzle-orm';
import { db } from '~/globals/db';
import { project } from '~/globals/schema';
import Markdown from '~/components/Markdown/Markdown';
import { generateProjectMetadata } from '../generateProjectMetadata';

export const dynamic = 'force-dynamic';

type PageProps = { params: { slug: string } };

export default async function Article({ params: { slug } }: PageProps) {
	const [post] = await db
		.select()
		.from(project)
		.where(and(eq(project.slug, slug), eq(project.published, true)))
		.limit(1);

	if (!post) notFound();

	const { content } = post;

	return (
		<main>
			<Link href="../../" className={styles.back}>
				{'<- '}GOBACK
			</Link>
			<Markdown>{content}</Markdown>
		</main>
	);
}

export async function generateMetadata({ params: { slug } }: PageProps): Promise<Metadata> {
	return generateProjectMetadata(slug);
}
