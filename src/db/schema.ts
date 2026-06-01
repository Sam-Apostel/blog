import { pgTable, text, timestamp, boolean, integer, pgEnum, uniqueIndex, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createId } from '~/lib/id';

/**
 * Content "mode" of the site. A visitor can switch between these and the whole
 * site re-themes. Posts are tagged with the mode they belong to.
 */
export const modeEnum = pgEnum('mode', ['software', 'lifestyle', 'hardware']);

// ---------------------------------------------------------------------------
// Better Auth tables
// ---------------------------------------------------------------------------

export const user = pgTable('user', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	emailVerified: boolean('email_verified')
		.$defaultFn(() => false)
		.notNull(),
	image: text('image'),
	// Only the owner gets to write. Everyone else is just a reader.
	role: text('role').default('reader').notNull(),
	createdAt: timestamp('created_at')
		.$defaultFn(() => new Date())
		.notNull(),
	updatedAt: timestamp('updated_at')
		.$defaultFn(() => new Date())
		.notNull(),
});

export const session = pgTable('session', {
	id: text('id').primaryKey(),
	expiresAt: timestamp('expires_at').notNull(),
	token: text('token').notNull().unique(),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull(),
	ipAddress: text('ip_address'),
	userAgent: text('user_agent'),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
});

export const account = pgTable('account', {
	id: text('id').primaryKey(),
	accountId: text('account_id').notNull(),
	providerId: text('provider_id').notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	accessToken: text('access_token'),
	refreshToken: text('refresh_token'),
	idToken: text('id_token'),
	accessTokenExpiresAt: timestamp('access_token_expires_at'),
	refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
	scope: text('scope'),
	password: text('password'),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull(),
});

export const verification = pgTable('verification', {
	id: text('id').primaryKey(),
	identifier: text('identifier').notNull(),
	value: text('value').notNull(),
	expiresAt: timestamp('expires_at').notNull(),
	createdAt: timestamp('created_at').$defaultFn(() => new Date()),
	updatedAt: timestamp('updated_at').$defaultFn(() => new Date()),
});

// ---------------------------------------------------------------------------
// Content tables
// ---------------------------------------------------------------------------

/** Blog posts, written in markdown, grouped by `mode`. */
export const post = pgTable(
	'post',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => createId()),
		slug: text('slug').notNull().unique(),
		title: text('title').notNull(),
		/** Short teaser shown in lists and used for meta descriptions. */
		hook: text('hook').notNull().default(''),
		/** Full markdown body. */
		content: text('content').notNull().default(''),
		mode: modeEnum('mode').notNull().default('software'),
		cover: text('cover'),
		canonical: text('canonical'),
		keywords: text('keywords').array().notNull().default([]),
		publishedAt: timestamp('published_at'),
		createdAt: timestamp('created_at')
			.$defaultFn(() => new Date())
			.notNull(),
		updatedAt: timestamp('updated_at')
			.$defaultFn(() => new Date())
			.notNull(),
	},
	(t) => [index('post_mode_idx').on(t.mode), index('post_published_idx').on(t.publishedAt)],
);

/** Projects — the things Sam builds. Each can aggregate release notes. */
export const project = pgTable('project', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => createId()),
	slug: text('slug').notNull().unique(),
	name: text('name').notNull(),
	description: text('description').notNull().default(''),
	/** Long-form markdown for a dedicated project page. */
	content: text('content'),
	/** Public URL of the project. */
	url: text('url'),
	/** Source repository, used to pull releases from. */
	repo: text('repo'),
	mode: modeEnum('mode').notNull().default('software'),
	showUrl: boolean('show_url').notNull().default(true),
	dedicatedPage: boolean('dedicated_page').notNull().default(false),
	featured: boolean('featured').notNull().default(false),
	published: boolean('published').notNull().default(false),
	createdAt: timestamp('created_at')
		.$defaultFn(() => new Date())
		.notNull(),
	updatedAt: timestamp('updated_at')
		.$defaultFn(() => new Date())
		.notNull(),
});

/**
 * Release notes aggregated from across Sam's projects. Projects POST their
 * releases to /api/releases following the documented release-notes standard
 * (see docs/release-notes-standard.md).
 */
export const release = pgTable(
	'release',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => createId()),
		projectId: text('project_id')
			.notNull()
			.references(() => project.id, { onDelete: 'cascade' }),
		version: text('version').notNull(),
		title: text('title'),
		/** Markdown release notes body. */
		notes: text('notes').notNull().default(''),
		url: text('url'),
		/** Severity / type: feature | fix | breaking | chore | security. */
		kind: text('kind').notNull().default('feature'),
		releasedAt: timestamp('released_at')
			.$defaultFn(() => new Date())
			.notNull(),
		createdAt: timestamp('created_at')
			.$defaultFn(() => new Date())
			.notNull(),
	},
	(t) => [
		uniqueIndex('release_project_version_idx').on(t.projectId, t.version),
		index('release_released_idx').on(t.releasedAt),
	],
);

/** Reading list — useful articles Sam wants to keep and share. */
export const readingItem = pgTable(
	'reading_item',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => createId()),
		url: text('url').notNull(),
		title: text('title').notNull(),
		description: text('description'),
		author: text('author'),
		/** Where it came from, e.g. the site name. */
		source: text('source'),
		/** Sam's own note on why it's worth reading. */
		note: text('note'),
		mode: modeEnum('mode').notNull().default('software'),
		favorite: boolean('favorite').notNull().default(false),
		addedAt: timestamp('added_at')
			.$defaultFn(() => new Date())
			.notNull(),
	},
	(t) => [uniqueIndex('reading_url_idx').on(t.url), index('reading_mode_idx').on(t.mode)],
);

// ---------------------------------------------------------------------------
// Relations
// ---------------------------------------------------------------------------

export const projectRelations = relations(project, ({ many }) => ({
	releases: many(release),
}));

export const releaseRelations = relations(release, ({ one }) => ({
	project: one(project, {
		fields: [release.projectId],
		references: [project.id],
	}),
}));

export type Post = typeof post.$inferSelect;
export type Project = typeof project.$inferSelect;
export type Release = typeof release.$inferSelect;
export type ReadingItem = typeof readingItem.$inferSelect;
export type Mode = (typeof modeEnum.enumValues)[number];
