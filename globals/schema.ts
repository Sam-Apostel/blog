import { boolean, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

// Fresh builders per table (drizzle column builders are single-use).
const id = () =>
	text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID());

const timestamps = () => ({
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true })
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date()),
});

export const blogpost = pgTable('blogpost', {
	id: id(),
	content: text('content').notNull().default(''),
	title: text('title').notNull().default(''),
	published: timestamp('published', { withTimezone: true }),
	hook: text('hook').notNull().default(''),
	canonical: text('canonical'),
	slug: text('slug').unique(),
	cover: text('cover'),
	keywords: text('keywords').array(),
	...timestamps(),
});

export const project = pgTable('project', {
	id: id(),
	name: text('name').notNull().default(''),
	url: text('url'),
	description: text('description').notNull().default(''),
	slug: text('slug').notNull().default(''),
	published: boolean('published').notNull().default(false),
	showUrl: boolean('show_url').notNull().default(true),
	content: text('content'),
	dedicatedPage: boolean('dedicated_page').notNull().default(false),
	...timestamps(),
});
