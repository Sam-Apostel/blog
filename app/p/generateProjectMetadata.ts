import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getXataClient, Project } from '~/globals/db';

const xata = getXataClient();

export async function generateProjectMetadata(slug: string): Promise<Metadata> {
	const project = (await xata.db.project
		.filter({
			$all: [{ slug }],
		})
		.getFirst()) as Project | null;

	if (!project) notFound();
	if (!project.published) notFound();

	const { name, description } = project;

	return {
		title: name,
		description: description,
		alternates: {
			canonical: `https://sams.land/p/${slug}`,
		},
		openGraph: {
			title: `${name} | Sam Apostel`,
			description: description,
			url: `https://sams.land/p/${slug}`,
			siteName: 'sams.land',
			locale: 'en-US',
			authors: 'Sam Apostel',
		},
		twitter: {
			card: 'summary',
			title: name,
			description: description,
			creator: '@sam_apostel',
		},
	};
}
