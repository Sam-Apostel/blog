import styles from './Article.module.scss';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getXataClient, Project } from '~/globals/db';
import Markdown from '~/components/Markdown/Markdown';
import { generateProjectMetadata } from '../generateProjectMetadata';

const xata = getXataClient();
const dedicatedPages = ['polar-printer'];
export async function generateStaticParams() {
	const projects = await xata.db.project.filter({ published: true }).select(['slug']).getAll();

	return projects
		.filter((project) => !dedicatedPages.includes(project.slug))
		.map((project) => ({
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
	return generateProjectMetadata(slug);
}
