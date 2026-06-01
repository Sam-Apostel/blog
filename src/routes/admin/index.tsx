import { createFileRoute, Link } from '@tanstack/react-router';
import { listAllPosts } from '~/server/admin';

export const Route = createFileRoute('/admin/')({
	loader: () => listAllPosts(),
	component: Dashboard,
});

function Dashboard() {
	const posts = Route.useLoaderData();
	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl">Posts</h1>
				<Link to="/admin/new" className="rounded-[var(--radius)] bg-accent px-3 py-1.5 text-sm">
					New post
				</Link>
			</div>
			<ul className="divide-y divide-[var(--border)]">
				{posts.map((p) => (
					<li key={p.id} className="flex items-center gap-3 py-3">
						<Link to="/admin/$id" params={{ id: p.id }} className="font-medium hover:text-accent">
							{p.title}
						</Link>
						<span className="text-xs uppercase tracking-wide text-muted">{p.mode}</span>
						<span className="ml-auto text-xs text-muted">{p.publishedAt ? 'published' : 'draft'}</span>
					</li>
				))}
				{posts.length === 0 && <li className="py-3 text-muted">No posts yet.</li>}
			</ul>
		</div>
	);
}
