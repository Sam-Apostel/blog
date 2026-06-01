/**
 * Seeds the owner account and a little sample content so a fresh database isn't
 * empty. Run with `npm run db:seed`. Requires DATABASE_URL, and uses
 * SEED_OWNER_EMAIL / SEED_OWNER_PASSWORD for the admin login.
 */
// Allow the owner account to be created even though sign-ups are closed in prod.
// Must be set before `~/lib/auth` is evaluated, so auth is imported dynamically.
process.env.ALLOW_SIGNUP = 'true';

import { db } from './index';
import { post, project, release } from './schema';

async function main() {
	const { auth } = await import('~/lib/auth');
	const email = process.env.SEED_OWNER_EMAIL ?? 'sam@apostel.be';
	const password = process.env.SEED_OWNER_PASSWORD ?? 'change-me-now';

	// Create the owner via Better Auth so the password is hashed correctly.
	try {
		await auth.api.signUpEmail({ body: { email, password, name: 'Sam Apostel' } });
		console.log(`Created owner account: ${email}`);
	} catch (e) {
		console.log(`Owner account already exists or sign-up disabled (${(e as Error).message}).`);
	}

	const [demoProject] = await db
		.insert(project)
		.values({
			slug: 'blog',
			name: 'sam.land',
			description: 'This very blog — TanStack Start, Drizzle, Better Auth, on Railway.',
			url: 'https://sam.land',
			repo: 'Sam-Apostel/blog',
			mode: 'software',
			published: true,
			featured: true,
		})
		.onConflictDoNothing()
		.returning({ id: project.id });

	if (demoProject) {
		await db
			.insert(release)
			.values({
				projectId: demoProject.id,
				version: '2.0.0',
				title: 'Rebuilt on TanStack Start',
				notes: '- New stack: TanStack Start + Drizzle + Better Auth\n- Three theme modes\n- Aggregated release notes',
				kind: 'feature',
			})
			.onConflictDoNothing();
	}

	await db
		.insert(post)
		.values({
			slug: 'hello-again',
			title: 'Hello, again',
			hook: 'Rebuilt from scratch — here is what changed.',
			mode: 'software',
			content: '# Hello again\n\nThe blog has a new foundation. Import the old posts to bring back the archive.',
			publishedAt: new Date(),
		})
		.onConflictDoNothing();

	console.log('Seed complete.');
	process.exit(0);
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
