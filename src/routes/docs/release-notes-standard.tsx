import { createFileRoute } from '@tanstack/react-router';
import { Markdown } from '~/components/Markdown';
// Render the canonical standard doc directly from the repo so they never drift.
import standard from '../../../docs/release-notes-standard.md?raw';

export const Route = createFileRoute('/docs/release-notes-standard')({
	head: () => ({ meta: [{ title: 'Release Notes Standard | Sam Apostel' }] }),
	component: () => (
		<article>
			<Markdown>{standard}</Markdown>
		</article>
	),
});
