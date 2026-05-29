import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { db } from '~/globals/db';
import { project } from '~/globals/schema';

export async function generateProjectMetadata(slug: string): Promise<Metadata> {
	const [proj] = await db.select().from(project).where(eq(project.slug, slug)).limit(1);

	if (!proj) notFound();
	if (!proj.published) notFound();

	const { name, description } = proj;

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
