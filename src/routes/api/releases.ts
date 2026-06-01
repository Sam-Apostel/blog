import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db } from '~/db';
import { project, release } from '~/db/schema';
import { isMode } from '~/lib/theme';

/**
 * Ingestion endpoint for the release-notes standard. Any of Sam's projects can
 * POST a release here with a shared bearer token. See
 * docs/release-notes-standard.md for the contract.
 */
const payloadSchema = z.object({
	project: z.object({
		slug: z
			.string()
			.min(1)
			.regex(/^[a-z0-9-]+$/, 'slug must be kebab-case'),
		name: z.string().min(1),
		url: z.string().url().optional(),
		repo: z.string().optional(),
		mode: z.enum(['software', 'lifestyle', 'hardware']).optional(),
	}),
	release: z.object({
		version: z.string().min(1),
		title: z.string().optional(),
		notes: z.string().default(''),
		url: z.string().url().optional(),
		kind: z.enum(['feature', 'fix', 'breaking', 'chore', 'security']).default('feature'),
		releasedAt: z.string().datetime().optional(),
	}),
});

function json(body: unknown, status = 200) {
	return new Response(JSON.stringify(body), {
		status,
		headers: { 'content-type': 'application/json' },
	});
}

export const Route = createFileRoute('/api/releases')({
	server: {
		handlers: {
			POST: async ({ request }) => {
				const token = process.env.RELEASES_INGEST_TOKEN;
				const auth = request.headers.get('authorization');
				if (!token || auth !== `Bearer ${token}`) {
					return json({ error: 'unauthorized' }, 401);
				}

				let parsed;
				try {
					parsed = payloadSchema.parse(await request.json());
				} catch (err) {
					return json({ error: 'invalid payload', details: (err as z.ZodError).issues ?? String(err) }, 422);
				}

				const { project: p, release: r } = parsed;
				const mode = p.mode && isMode(p.mode) ? p.mode : 'software';

				// Upsert the project by slug.
				const [existing] = await db.select().from(project).where(eq(project.slug, p.slug)).limit(1);
				let projectId: string;
				if (existing) {
					projectId = existing.id;
					await db
						.update(project)
						.set({ name: p.name, url: p.url, repo: p.repo, updatedAt: new Date() })
						.where(eq(project.id, projectId));
				} else {
					const [created] = await db
						.insert(project)
						.values({ slug: p.slug, name: p.name, url: p.url, repo: p.repo, mode, published: true })
						.returning({ id: project.id });
					projectId = created.id;
				}

				// Upsert the release by (projectId, version).
				await db
					.insert(release)
					.values({
						projectId,
						version: r.version,
						title: r.title,
						notes: r.notes,
						url: r.url,
						kind: r.kind,
						releasedAt: r.releasedAt ? new Date(r.releasedAt) : new Date(),
					})
					.onConflictDoUpdate({
						target: [release.projectId, release.version],
						set: { title: r.title, notes: r.notes, url: r.url, kind: r.kind },
					});

				return json({ ok: true, project: p.slug, version: r.version }, 201);
			},
		},
	},
});
