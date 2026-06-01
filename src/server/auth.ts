import { createServerFn } from '@tanstack/react-start';
import { getRequest } from '@tanstack/react-start/server';
import { auth } from '~/lib/auth';

/** Returns the current session (or null) based on the request cookies. */
export const getSession = createServerFn({ method: 'GET' }).handler(async () => {
	const { headers } = getRequest();
	const session = await auth.api.getSession({ headers });
	return session ?? null;
});

/** Throws if there is no authenticated user. Use to guard mutations. */
export async function requireUser() {
	const session = await getSession();
	if (!session?.user) throw new Error('Unauthorized');
	return session.user;
}
