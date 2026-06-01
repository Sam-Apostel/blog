import { createFileRoute, Link } from '@tanstack/react-router';
import { getPosts } from '~/server/queries';
import { MODE_LABELS } from '~/lib/theme';

export const Route = createFileRoute('/blog/')({
	loader: () => getPosts(),
	head: () => ({ meta: [{ title: 'Blog | Sam Apostel' }] }),
	component: BlogIndex,
});

function BlogIndex() {
	const posts = Route.useLoaderData();
	return (
		<div className="space-y-8">
			<h1 className="text-3xl">Blog</h1>
			{posts.length === 0 ? (
				<p className="text-muted">No posts yet.</p>
			) : (
				<ul className="divide-y divide-[var(--border)]">
					{posts.map((p) => (
						<li key={p.slug} className="py-4">
							<Link to="/blog/$slug" params={{ slug: p.slug }} className="group flex flex-col gap-1">
								<div className="flex items-center gap-3 text-xs uppercase tracking-wide text-muted">
									<span>{MODE_LABELS[p.mode]}</span>
									{p.publishedAt && (
										<time dateTime={new Date(p.publishedAt).toISOString()}>
											{new Date(p.publishedAt).toLocaleDateString('en-GB', {
												year: 'numeric',
												month: 'short',
												day: 'numeric',
											})}
										</time>
									)}
								</div>
								<span className="text-lg font-medium group-hover:text-accent">{p.title}</span>
								{p.hook && <span className="text-muted">{p.hook}</span>}
							</Link>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
