import type { MDXComponents } from 'mdx/types';

import { CH } from '@apostel/mdx/components';


export function useMDXComponents(components: MDXComponents): MDXComponents {
	return {
		CH,
		...components,
	};
}
