import { XataClient, Blogpost as _Blogpost, Project as _Project } from './xata';

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

export type Blogpost = _Blogpost;
export type Project = _Project;
