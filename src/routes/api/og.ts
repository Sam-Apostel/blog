import { createFileRoute } from '@tanstack/react-router';
import satori from 'satori';
import { Resvg, initWasm } from '@resvg/resvg-wasm';
import { eq } from 'drizzle-orm';
import { db } from '~/db';
import { post } from '~/db/schema';

const MODE_ACCENT: Record<string, { bg: string; fg: string; accent: string }> = {
	software: { bg: '#fbf3ec', fg: '#1a1614', accent: '#e8501e' },
	lifestyle: { bg: '#f6f5f2', fg: '#1c1c1a', accent: '#1c1c1a' },
	hardware: { bg: '#0e1116', fg: '#e8edf2', accent: '#ff6b35' },
};

// Assets (fonts + wasm) are fetched once from the site's own /public and cached
// for the lifetime of the process. This keeps everything self-hosted.
let fontCache: { regular: ArrayBuffer; bold: ArrayBuffer } | null = null;
let wasmReady: Promise<void> | null = null;

function base() {
	return process.env.PUBLIC_SITE_URL ?? 'http://localhost:3000';
}

async function loadFonts() {
	if (fontCache) return fontCache;
	const [regular, bold] = await Promise.all([
		fetch(`${base()}/fonts/ttf/JetBrainsMono-Regular.ttf`).then((r) => r.arrayBuffer()),
		fetch(`${base()}/fonts/ttf/JetBrainsMono-Bold.ttf`).then((r) => r.arrayBuffer()),
	]);
	fontCache = { regular, bold };
	return fontCache;
}

function ensureWasm() {
	if (!wasmReady) {
		wasmReady = initWasm(fetch(`${base()}/og/resvg.wasm`)).catch((err) => {
			// Reset so a later request can retry if init failed transiently.
			wasmReady = null;
			throw err;
		});
	}
	return wasmReady;
}

export const Route = createFileRoute('/api/og')({
	server: {
		handlers: {
			GET: async ({ request }) => {
				const url = new URL(request.url);
				const slug = url.searchParams.get('slug');

				let title = 'Sam Apostel';
				let subtitle = 'software · lifestyle · hardware';
				let mode = 'software';

				if (slug) {
					const [row] = await db
						.select({ title: post.title, hook: post.hook, mode: post.mode })
						.from(post)
						.where(eq(post.slug, slug))
						.limit(1);
					if (row) {
						title = row.title;
						subtitle = row.hook || subtitle;
						mode = row.mode;
					}
				}

				const theme = MODE_ACCENT[mode] ?? MODE_ACCENT.software;
				const [fonts] = await Promise.all([loadFonts(), ensureWasm()]);

				// Satori accepts a React-element-shaped object; build it without JSX
				// (this is a .ts server route) and cast for the type checker.
				const element = {
					type: 'div',
						props: {
							style: {
								width: '100%',
								height: '100%',
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'space-between',
								padding: '64px',
								backgroundColor: theme.bg,
								color: theme.fg,
								fontFamily: 'JetBrains Mono',
							},
							children: [
								{
									type: 'div',
									props: {
										style: { fontSize: 28, color: theme.accent, textTransform: 'uppercase' },
										children: mode,
									},
								},
								{
									type: 'div',
									props: {
										style: { display: 'flex', flexDirection: 'column', gap: '16px' },
										children: [
											{
												type: 'div',
												props: {
													style: { fontSize: 64, fontWeight: 700, lineHeight: 1.1 },
													children: title,
												},
											},
											{
												type: 'div',
												props: {
													style: { fontSize: 28, color: '#888' },
													children: subtitle,
												},
											},
										],
									},
								},
								{
									type: 'div',
									props: {
										style: { fontSize: 26, color: theme.accent },
										children: 'sam.land',
									},
								},
							],
						},
				};

				const svg = await satori(element as unknown as Parameters<typeof satori>[0], {
					width: 1200,
					height: 630,
					fonts: [
						{ name: 'JetBrains Mono', data: fonts.regular, weight: 400, style: 'normal' },
						{ name: 'JetBrains Mono', data: fonts.bold, weight: 700, style: 'normal' },
					],
				});

				const png = new Resvg(svg).render().asPng();
				return new Response(new Uint8Array(png), {
					headers: {
						'content-type': 'image/png',
						'cache-control': 'public, max-age=3600, s-maxage=86400',
					},
				});
			},
		},
	},
});
