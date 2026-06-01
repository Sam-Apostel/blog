import { createFileRoute } from '@tanstack/react-router';
import { getReadingList } from '~/server/queries';
import { MODE_LABELS } from '~/lib/theme';

export const Route = createFileRoute('/reading')({
	loader: () => getReadingList(),
	head: () => ({ meta: [{ title: 'Reading list | Sam Apostel' }] }),
	component: Reading,
});

function Reading() {
	const items = Route.useLoaderData();
	return (
		<div className="space-y-8">
			<header className="space-y-2">
				<h1 className="text-3xl">Reading list</h1>
				<p className="text-muted">Articles I found useful and want to keep around.</p>
			</header>
			{items.length === 0 ? (
				<p className="text-muted">Nothing here yet.</p>
			) : (
				<ul className="space-y-5">
					{items.map((item) => (
						<li key={item.id} className="space-y-1">
							<a
								href={item.url}
								target="_blank"
								rel="noopener noreferrer"
								className="font-medium hover:text-accent"
							>
								{item.title}
							</a>
							<div className="flex flex-wrap gap-x-3 text-xs uppercase tracking-wide text-muted">
								<span>{MODE_LABELS[item.mode]}</span>
								{item.source && <span>{item.source}</span>}
								{item.author && <span>{item.author}</span>}
							</div>
							{item.note && <p className="text-sm text-muted">{item.note}</p>}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
