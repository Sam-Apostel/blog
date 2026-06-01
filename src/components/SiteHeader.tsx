import { Link } from '@tanstack/react-router';
import { ModeSwitcher } from './ModeSwitcher';

const nav = [
	{ to: '/blog', label: 'Blog' },
	{ to: '/reading', label: 'Reading' },
	{ to: '/projects', label: 'Projects' },
	{ to: '/releases', label: 'Releases' },
];

export function SiteHeader() {
	return (
		<header className="sticky top-0 z-10 border-b border-default bg-[var(--bg)]/85 backdrop-blur">
			<div className="mx-auto flex w-full max-w-3xl flex-wrap items-center gap-x-5 gap-y-3 px-5 py-3 sm:px-6">
				<Link to="/" className="font-bold tracking-tight">
					sam<span className="text-accent">.</span>land
				</Link>
				<nav className="flex items-center gap-4 text-sm text-muted">
					{nav.map((item) => (
						<Link
							key={item.to}
							to={item.to}
							className="hover:text-[var(--fg)]"
							activeProps={{ className: 'text-[var(--fg)]' }}
						>
							{item.label}
						</Link>
					))}
				</nav>
				<div className="ml-auto">
					<ModeSwitcher />
				</div>
			</div>
		</header>
	);
}
