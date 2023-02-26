/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	experimental: {
		appDir: true,
		swcPlugins: [['next-superjson-plugin', {}]],
		serverComponentsExternalPackages: ['@xata.io/client'],
	},
};

module.exports = nextConfig;
