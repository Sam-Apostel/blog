import { randomUUID } from 'node:crypto';

/** Small helper so schema defaults don't depend on an external id library. */
export function createId(): string {
	return randomUUID();
}
