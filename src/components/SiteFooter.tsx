import { Link } from '@tanstack/react-router';

/**
 * This site is also the landing page for the attribution link in the footer of
 * every one of Sam's projects, so the footer makes the "who built this" story
 * explicit and points to the formal portfolio.
 */
export function SiteFooter() {
	return (
		<footer className="border-t border-default">
			<div className="mx-auto flex w-full max-w-3xl flex-col gap-2 px-5 py-8 text-sm text-muted sm:px-6">
				<p>
					Built by{' '}
					<a className="text-accent" href="https://github.com/Sam-Apostel" target="_blank" rel="noopener noreferrer">
						Sam Apostel
					</a>
					. This is the informal corner —{' '}
					<a className="text-accent" href="https://sams.works" target="_blank" rel="noopener noreferrer">
						sams.works
					</a>{' '}
					is the formal portfolio.
				</p>
				<div className="flex flex-wrap gap-x-4 gap-y-1">
					<Link to="/projects" className="hover:text-[var(--fg)]">
						Projects
					</Link>
					<Link to="/releases" className="hover:text-[var(--fg)]">
						Releases
					</Link>
					<a className="hover:text-[var(--fg)]" href="/rss.xml">
						RSS
					</a>
					<span>© {new Date().getFullYear()}</span>
				</div>
			</div>
		</footer>
	);
}
