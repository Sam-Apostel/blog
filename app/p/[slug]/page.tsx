import styles from './Article.module.scss';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getXataClient, Project } from '~/globals/db';
import Markdown from '~/components/Markdown/Markdown';

const xata = getXataClient();

export async function generateStaticParams() {
	const projects = await xata.db.project.filter({ published: true }).select(['slug']).getAll();

	return projects.map((project) => ({
		slug: project.slug,
	}));
}

type PageProps = { params: { slug: string } };

export default async function Article({ params: { slug } }: PageProps) {
	const post = (await xata.db.project
		.filter({
			$all: [{ slug }, { published: true }],
		})
		.getFirst()) as Project | null;

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
	const project = (await xata.db.project
		.filter({
			$all: [{ slug }],
		})
		.getFirst()) as Project | null;

	if (!project) notFound();
	if (!project.published) notFound();

	const { name, description, url, showUrl } = project;

	return {
		title: name,
		description: description,
		alternates: {
			canonical: `https://sams.land/p/${slug}`,
		},
		// keywords: ['React', 'JavaScript', 'Blog', 'Personal', 'Sam Apostel', ...keywords ?? []],
		openGraph: {
			title: `${name} | Sam Apostel`,
			description: description,
			url: `https://sams.land/p/${slug}`,
			siteName: 'sams.land',
			// images: [
			// 	{
			// 		url: `https://sams.land/a/${slug}/og.png`,
			// 		width: 1800,
			//      height: 1600,
			// 	},
			// ],
			locale: 'en-US',
			authors: 'Sam Apostel',
			// tags: ['React', 'JavaScript', 'Blog', 'Personal', 'Sam Apostel', ...keywords ?? []]
		},
		twitter: {
			card: 'summary', // summary_large_image
			title: name,
			description: description,
			creator: '@sam_apostel',
			// 	images: ['https://sams.land/og.png'],
		},
	};
}
