import { createServerFn } from '@tanstack/react-start';
import { desc, eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '~/db';
import { post } from '~/db/schema';
import { requireUser } from './auth';

/** All posts (published or not) for the admin dashboard. */
export const listAllPosts = createServerFn({ method: 'GET' }).handler(async () => {
	await requireUser();
	return db
		.select({
			id: post.id,
			slug: post.slug,
			title: post.title,
			mode: post.mode,
			publishedAt: post.publishedAt,
			updatedAt: post.updatedAt,
		})
		.from(post)
		.orderBy(desc(post.updatedAt));
});

export const getPostById = createServerFn({ method: 'GET' })
	.inputValidator((d: unknown) => z.object({ id: z.string() }).parse(d))
	.handler(async ({ data }) => {
		await requireUser();
		const [row] = await db.select().from(post).where(eq(post.id, data.id)).limit(1);
		return row ?? null;
	});

const upsertSchema = z.object({
	id: z.string().optional(),
	slug: z
		.string()
		.min(1)
		.regex(/^[a-z0-9-]+$/, 'slug must be kebab-case'),
	title: z.string().min(1),
	hook: z.string().default(''),
	content: z.string().default(''),
	mode: z.enum(['software', 'lifestyle', 'hardware']),
	cover: z.string().optional(),
	canonical: z.string().optional(),
	published: z.boolean().default(false),
});

/** Create or update a post from the markdown editor. */
export const savePost = createServerFn({ method: 'POST' })
	.inputValidator((d: unknown) => upsertSchema.parse(d))
	.handler(async ({ data }) => {
		await requireUser();
		const publishedAt = data.published ? new Date() : null;
		const values = {
			slug: data.slug,
			title: data.title,
			hook: data.hook,
			content: data.content,
			mode: data.mode,
			cover: data.cover || null,
			canonical: data.canonical || null,
			publishedAt,
			updatedAt: new Date(),
		};

		if (data.id) {
			// Preserve the original publish date when editing a live post.
			const set = data.published ? values : { ...values, publishedAt };
			await db.update(post).set(set).where(eq(post.id, data.id));
			return { id: data.id };
		}
		const [created] = await db.insert(post).values(values).returning({ id: post.id });
		return { id: created.id };
	});
