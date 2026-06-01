import { defineConfig } from 'vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import { nitro } from 'nitro/vite';
import viteReact from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import tsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
	server: {
		port: 3000,
	},
	plugins: [
		tsConfigPaths(),
		tailwindcss(),
		// tanstackStart's plugin must come before react's plugin.
		// nitro produces a Node server (.output/server/index.mjs) for Railway.
		tanstackStart(),
		// Externalize node deps (required at runtime from node_modules) instead of
		// bundling them — and keep better-auth's optional kysely adapters external so
		// rollup never parses them (they're unused on our drizzle/postgres path).
		nitro({
			noExternals: false,
			rollupConfig: { external: [/kysely/, /@better-auth\/kysely-adapter/] },
		}),
		viteReact(),
	],
});
