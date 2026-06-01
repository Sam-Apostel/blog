import { createServerFn } from '@tanstack/react-start';
import { and, desc, eq, isNotNull, lte } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '~/db';
import { post, project, readingItem, release } from '~/db/schema';
import { isMode, type Mode } from '~/lib/theme';

const modeFilter = z.object({ mode: z.string().optional() });

/** Published posts, optionally filtered to a single mode. */
export const getPosts = createServerFn({ method: 'GET' })
	.inputValidator((data: unknown) => modeFilter.parse(data ?? {}))
	.handler(async ({ data }) => {
		const where = [isNotNull(post.publishedAt), lte(post.publishedAt, new Date())];
		if (data.mode && isMode(data.mode)) where.push(eq(post.mode, data.mode as Mode));
		return db
			.select({
				slug: post.slug,
				title: post.title,
				hook: post.hook,
				mode: post.mode,
				cover: post.cover,
				publishedAt: post.publishedAt,
			})
			.from(post)
			.where(and(...where))
			.orderBy(desc(post.publishedAt));
	});

export const getPost = createServerFn({ method: 'GET' })
	.inputValidator((data: unknown) => z.object({ slug: z.string() }).parse(data))
	.handler(async ({ data }) => {
		const [row] = await db.select().from(post).where(eq(post.slug, data.slug)).limit(1);
		return row ?? null;
	});

export const getProjects = createServerFn({ method: 'GET' }).handler(async () => {
	return db.select().from(project).where(eq(project.published, true)).orderBy(desc(project.updatedAt));
});

export const getReadingList = createServerFn({ method: 'GET' })
	.inputValidator((data: unknown) => modeFilter.parse(data ?? {}))
	.handler(async ({ data }) => {
		const where = data.mode && isMode(data.mode) ? eq(readingItem.mode, data.mode as Mode) : undefined;
		return db
			.select()
			.from(readingItem)
			.where(where)
			.orderBy(desc(readingItem.addedAt));
	});

/** Aggregated release notes across all of Sam's projects, newest first. */
export const getReleases = createServerFn({ method: 'GET' }).handler(async () => {
	return db
		.select({
			id: release.id,
			version: release.version,
			title: release.title,
			notes: release.notes,
			url: release.url,
			kind: release.kind,
			releasedAt: release.releasedAt,
			projectName: project.name,
			projectSlug: project.slug,
		})
		.from(release)
		.innerJoin(project, eq(release.projectId, project.id))
		.orderBy(desc(release.releasedAt))
		.limit(100);
});
