import { createFileRoute, Link } from '@tanstack/react-router';
import { getPosts, getReleases } from '~/server/queries';
import { MODE_LABELS } from '~/lib/theme';

export const Route = createFileRoute('/')({
	loader: async () => {
		const [posts, releases] = await Promise.all([getPosts(), getReleases()]);
		return { posts: posts.slice(0, 5), releases: releases.slice(0, 4) };
	},
	component: Home,
});

function Home() {
	const { posts, releases } = Route.useLoaderData();

	return (
		<div className="space-y-14">
			<section className="space-y-4">
				<h1 className="text-4xl sm:text-5xl">Sam Apostel</h1>
				<p className="max-w-xl text-lg text-muted">
					I build things and write about them. This is the informal corner — notes on{' '}
					<span className="text-accent">software</span>, <span className="text-accent">lifestyle</span> and{' '}
					<span className="text-accent">hardware</span>. Switch modes up top to re-theme the whole place.
				</p>
			</section>

			<section className="space-y-4">
				<header className="flex items-baseline justify-between">
					<h2 className="text-2xl">Writing</h2>
					<Link to="/blog" className="text-sm text-accent">
						All posts →
					</Link>
				</header>
				{posts.length === 0 ? (
					<p className="text-muted">No posts yet. Import the database export to populate this.</p>
				) : (
					<ul className="divide-y divide-[var(--border)]">
						{posts.map((p) => (
							<li key={p.slug} className="py-3">
								<Link to="/blog/$slug" params={{ slug: p.slug }} className="group flex flex-col gap-1">
									<span className="text-xs uppercase tracking-wide text-muted">{MODE_LABELS[p.mode]}</span>
									<span className="font-medium group-hover:text-accent">{p.title}</span>
									{p.hook && <span className="text-sm text-muted">{p.hook}</span>}
								</Link>
							</li>
						))}
					</ul>
				)}
			</section>

			<section className="space-y-4">
				<header className="flex items-baseline justify-between">
					<h2 className="text-2xl">Latest releases</h2>
					<Link to="/releases" className="text-sm text-accent">
						All releases →
					</Link>
				</header>
				{releases.length === 0 ? (
					<p className="text-muted">
						Releases from my projects show up here. See the{' '}
						<a className="text-accent" href="/docs/release-notes-standard">
							release-notes standard
						</a>{' '}
						for how projects report in.
					</p>
				) : (
					<ul className="space-y-2">
						{releases.map((r) => (
							<li key={r.id} className="flex items-baseline gap-3 text-sm">
								<span className="font-medium">{r.projectName}</span>
								<span className="text-accent">{r.version}</span>
								<span className="truncate text-muted">{r.title}</span>
							</li>
						))}
					</ul>
				)}
			</section>
		</div>
	);
}
