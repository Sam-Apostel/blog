import './globals.scss';
import { PropsWithChildren } from 'react';
import Footer from '~/components/Footer/Footer';
import styles from './Layout.module.scss';
import { Metadata, Viewport } from 'next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }: PropsWithChildren) {
	return (
		<html lang="en">
			<head />
			<body>
				<div className={styles.body}>
					{children}
					<Footer />
				</div>
				<SpeedInsights />
				<Analytics />
			</body>
		</html>
	);
}

export const metadata: Metadata = {
	title: {
		default: 'Sam Apostel',
		template: '%s | Sam Apostel',
	},
	description: 'Web and personal development.',
	applicationName: 'sams.land',
	referrer: 'origin-when-cross-origin',
	keywords: ['React', 'JavaScript', 'Blog', 'Personal', 'Sam Apostel'],
	authors: [{ name: 'Sam Apostel', url: 'https://github.com/Sam_Apostel' }],
	creator: 'Sam Apostel',
	publisher: 'Sam Apostel',
	formatDetection: {
		email: true,
		address: false,
		telephone: false,
	},
	robots: 'index, follow',
	openGraph: {
		title: 'Sam Apostel',
		description: 'Web and personal development.',
		url: 'https://sams.land',
		siteName: 'sams.land',
		// images: [
		// 	{
		// 		url: 'https://sams.land/og.png',
		// 		width: 1800,
		// 		height: 1600,
		// 	},
		// ],
		locale: 'en-US',
		type: 'website',
	},
	twitter: {
		card: 'summary', // summary_large_image
		title: 'Sam Apostel',
		description: 'Web and personal development.',
		creator: '@sam_apostel',
		// 	images: ['https://sams.land/og.png'],
	},
	alternates: {
		canonical: 'https://sams.land',
		types: {
			'application/rss+xml': 'https://sams.land/rss.xml',
		},
	},
};

export const viewport: Viewport = {
	themeColor: [
		{ media: '(prefers-color-scheme: light)', color: '#a99dd3' },
		{ media: '(prefers-color-scheme: light)', color: '#585ea6' },
	],
	colorScheme: 'dark',
};
