import { XataClient, Blogposts } from './xata';

let instance: XataClient | undefined = undefined;

export const getXataClient = () => {
	if (instance) return instance;

	instance = new XataClient({
		fetch: (path, options) =>
			fetch(path, {
				...options,
				cache:
					process.env.NODE_ENV && process.env.NEXT_PHASE !== 'phase-production-build'
						? 'force-cache'
						: 'default',
			}),
	});
	return instance;
};

export type Blogpost = Blogposts;
