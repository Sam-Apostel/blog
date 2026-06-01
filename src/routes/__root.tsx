import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { getRequest } from '@tanstack/react-start/server';
import type { PropsWithChildren } from 'react';
import { ThemeProvider, modeFromCookie, DEFAULT_MODE, type Mode } from '~/lib/theme';
import { SiteHeader } from '~/components/SiteHeader';
import { SiteFooter } from '~/components/SiteFooter';
import appCss from '~/styles/app.css?url';

const getInitialMode = createServerFn({ method: 'GET' }).handler(async (): Promise<Mode> => {
	const { headers } = getRequest();
	return modeFromCookie(headers.get('cookie'));
});

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: 'utf-8' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
			{ title: 'Sam Apostel' },
			{ name: 'description', content: 'Software, lifestyle and hardware — the informal corner of Sam Apostel.' },
		],
		links: [{ rel: 'stylesheet', href: appCss }],
	}),
	beforeLoad: async () => {
		const mode = await getInitialMode();
		return { mode };
	},
	loader: ({ context }) => ({ mode: context.mode ?? DEFAULT_MODE }),
	component: RootComponent,
});

function RootComponent() {
	const { mode } = Route.useLoaderData();
	return (
		<RootDocument mode={mode}>
			<ThemeProvider initialMode={mode}>
				<div className="flex min-h-dvh flex-col">
					<SiteHeader />
					<main className="mx-auto w-full max-w-3xl flex-1 px-5 py-10 sm:px-6">
						<Outlet />
					</main>
					<SiteFooter />
				</div>
			</ThemeProvider>
		</RootDocument>
	);
}

function RootDocument({ mode, children }: PropsWithChildren<{ mode: Mode }>) {
	return (
		<html lang="en" data-mode={mode}>
			<head>
				<HeadContent />
			</head>
			<body>
				{children}
				<Scripts />
			</body>
		</html>
	);
}
