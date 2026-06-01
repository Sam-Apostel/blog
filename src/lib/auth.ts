import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { tanstackStartCookies } from 'better-auth/tanstack-start';
import { db } from '~/db';
import * as schema from '~/db/schema';

const githubConfigured = Boolean(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET);

export const auth = betterAuth({
	baseURL: process.env.BETTER_AUTH_URL ?? process.env.PUBLIC_SITE_URL ?? 'http://localhost:3000',
	secret: process.env.BETTER_AUTH_SECRET,
	database: drizzleAdapter(db, {
		provider: 'pg',
		schema: {
			user: schema.user,
			session: schema.session,
			account: schema.account,
			verification: schema.verification,
		},
	}),
	// This is a single-author blog: signups are closed in production. The seed
	// script sets ALLOW_SIGNUP=true to create the owner account once.
	emailAndPassword: {
		enabled: true,
		disableSignUp: process.env.ALLOW_SIGNUP !== 'true',
	},
	...(githubConfigured
		? {
				socialProviders: {
					github: {
						clientId: process.env.GITHUB_CLIENT_ID as string,
						clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
					},
				},
			}
		: {}),
	user: {
		additionalFields: {
			role: { type: 'string', defaultValue: 'reader', input: false },
		},
	},
	// Must be the last plugin so Set-Cookie headers flow through TanStack Start.
	plugins: [tanstackStartCookies()],
});

export type Session = typeof auth.$Infer.Session;
