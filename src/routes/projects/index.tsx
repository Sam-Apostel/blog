import { createFileRoute } from '@tanstack/react-router';
import { getProjects } from '~/server/queries';

export const Route = createFileRoute('/projects/')({
	loader: () => getProjects(),
	head: () => ({ meta: [{ title: 'Projects | Sam Apostel' }] }),
	component: Projects,
});

function Projects() {
	const projects = Route.useLoaderData();
	return (
		<div className="space-y-8">
			<header className="space-y-2">
				<h1 className="text-3xl">Projects</h1>
				<p className="text-muted">Things I'm building. Many of them link here from their footer.</p>
			</header>
			{projects.length === 0 ? (
				<p className="text-muted">No projects yet.</p>
			) : (
				<ul className="grid gap-4 sm:grid-cols-2">
					{projects.map((p) => (
						<li key={p.id} className="rounded-[var(--radius)] border border-default bg-surface p-4">
							<div className="flex items-baseline justify-between gap-2">
								<h2 className="text-lg font-medium">{p.name}</h2>
								{p.featured && <span className="text-xs text-accent">featured</span>}
							</div>
							<p className="mt-1 text-sm text-muted">{p.description}</p>
							{p.showUrl && p.url && (
								<a
									href={p.url}
									target="_blank"
									rel="noopener noreferrer"
									className="mt-3 inline-block text-sm text-accent"
								>
									{p.url.replace(/^https?:\/\//, '')} →
								</a>
							)}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
