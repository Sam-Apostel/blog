import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const globalForDb = globalThis as unknown as {
	client?: ReturnType<typeof postgres>;
	db?: PostgresJsDatabase<typeof schema>;
};

function createDb(): PostgresJsDatabase<typeof schema> {
	const connectionString = process.env.DATABASE_URL;
	if (!connectionString) throw new Error('DATABASE_URL is not set');

	const client = globalForDb.client ?? postgres(connectionString, { prepare: false });
	if (process.env.NODE_ENV !== 'production') globalForDb.client = client;

	return drizzle(client, { schema });
}

// Lazy: the connection isn't created (and the missing-env error isn't thrown)
// until the first query runs. This lets `next build` import route modules
// without a database present — all DB-backed routes are force-dynamic, so no
// queries execute at build time.
export const db = new Proxy({} as PostgresJsDatabase<typeof schema>, {
	get(_target, prop) {
		const instance = (globalForDb.db ??= createDb());
		const value = Reflect.get(instance as object, prop);
		return typeof value === 'function' ? value.bind(instance) : value;
	},
});

export type Blogpost = typeof schema.blogpost.$inferSelect;
export type Project = typeof schema.project.$inferSelect;
