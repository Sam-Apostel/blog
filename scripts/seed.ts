import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../globals/schema';

// Seeds the database from JSON exports placed in ./seed (override with SEED_DIR).
// Accepts either a JSON array or newline-delimited JSON (Xata's export format).
// Run with: DATABASE_URL=... npm run db:seed

const SEED_DIR = process.env.SEED_DIR ?? join(process.cwd(), 'seed');

const read = (name: string): any[] => {
	const file = join(SEED_DIR, name);
	if (!existsSync(file)) {
		console.warn(`skipping ${name} (not found in ${SEED_DIR})`);
		return [];
	}
	const raw = readFileSync(file, 'utf8').trim();
	if (!raw) return [];
	if (raw.startsWith('[')) return JSON.parse(raw);
	return raw
		.split('\n')
		.filter(Boolean)
		.map((line) => JSON.parse(line));
};

const toDate = (value: unknown): Date | null => (value ? new Date(value as string) : null);

async function main() {
	const connectionString = process.env.DATABASE_URL;
	if (!connectionString) throw new Error('DATABASE_URL is not set');

	const client = postgres(connectionString, { max: 1 });
	const db = drizzle(client, { schema });

	const blogposts = read('blogpost.json').map((r) => ({
		id: r.id,
		content: r.content ?? '',
		title: r.title ?? '',
		published: toDate(r.published),
		hook: r.hook ?? '',
		canonical: r.canonical ?? null,
		slug: r.slug ?? null,
		cover: r.cover ?? null,
		keywords: r.keywords ?? null,
	}));

	const projects = read('project.json').map((r) => ({
		id: r.id,
		name: r.name ?? '',
		url: r.url ?? null,
		description: r.description ?? '',
		slug: r.slug ?? '',
		published: r.published ?? false,
		showUrl: r.showUrl ?? true,
		content: r.content ?? null,
		dedicatedPage: r.dedicatedPage ?? false,
	}));

	if (blogposts.length) {
		await db.insert(schema.blogpost).values(blogposts).onConflictDoNothing();
		console.log(`seeded ${blogposts.length} blogposts`);
	}
	if (projects.length) {
		await db.insert(schema.project).values(projects).onConflictDoNothing();
		console.log(`seeded ${projects.length} projects`);
	}

	await client.end();
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
