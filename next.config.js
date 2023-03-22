/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	experimental: {
		appDir: true,
		serverComponentsExternalPackages: ['@xata.io/client'],
	},
};

module.exports = nextConfig;
