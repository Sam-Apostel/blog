import { createFileRoute, Outlet, redirect, Link } from '@tanstack/react-router';
import { getSession } from '~/server/auth';

/** Guards everything under /admin behind an authenticated session. */
export const Route = createFileRoute('/admin')({
	beforeLoad: async () => {
		const session = await getSession();
		if (!session?.user) throw redirect({ to: '/login' });
		return { user: session.user };
	},
	component: AdminLayout,
});

function AdminLayout() {
	return (
		<div className="space-y-6">
			<nav className="flex items-center gap-4 border-b border-default pb-3 text-sm">
				<Link to="/admin" className="font-medium">
					Admin
				</Link>
				<Link to="/admin/new" className="text-muted hover:text-[var(--fg)]">
					New post
				</Link>
			</nav>
			<Outlet />
		</div>
	);
}
