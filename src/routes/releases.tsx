import { createFileRoute } from '@tanstack/react-router';
import { getReleases } from '~/server/queries';
import { Markdown } from '~/components/Markdown';

const kindColor: Record<string, string> = {
	feature: 'text-accent',
	fix: 'text-muted',
	breaking: 'text-accent',
	security: 'text-accent',
	chore: 'text-muted',
};

export const Route = createFileRoute('/releases')({
	loader: () => getReleases(),
	head: () => ({ meta: [{ title: 'Releases | Sam Apostel' }] }),
	component: Releases,
});

function Releases() {
	const releases = Route.useLoaderData();
	return (
		<div className="space-y-8">
			<header className="space-y-2">
				<h1 className="text-3xl">Releases</h1>
				<p className="text-muted">
					A live feed of what I'm shipping across all my projects. Projects report in following a{' '}
					<a className="text-accent" href="/docs/release-notes-standard">
						shared standard
					</a>
					.
				</p>
			</header>
			{releases.length === 0 ? (
				<p className="text-muted">No releases yet.</p>
			) : (
				<ol className="space-y-8">
					{releases.map((r) => (
						<li key={r.id} className="border-l-2 border-default pl-4">
							<div className="flex flex-wrap items-baseline gap-2 text-sm">
								<span className="font-medium">{r.projectName}</span>
								<span className="text-accent">{r.version}</span>
								<span className={'text-xs uppercase tracking-wide ' + (kindColor[r.kind] ?? 'text-muted')}>
									{r.kind}
								</span>
								<time className="ml-auto text-xs text-muted" dateTime={new Date(r.releasedAt).toISOString()}>
									{new Date(r.releasedAt).toLocaleDateString('en-GB', {
										year: 'numeric',
										month: 'short',
										day: 'numeric',
									})}
								</time>
							</div>
							{r.title && <h3 className="mt-1 text-base font-medium">{r.title}</h3>}
							{r.notes && (
								<div className="mt-2 text-sm text-muted">
									<Markdown>{r.notes}</Markdown>
								</div>
							)}
						</li>
					))}
				</ol>
			)}
		</div>
	);
}
