const { remarkCodeHike } = require('@apostel/mdx');

const withMDX = require('@next/mdx')({
	extension: /\.mdx?$/,
	options: {
		remarkPlugins: [[remarkCodeHike, { theme: 'material-palenight',
				lineNumbers: false,
				showCopyButton: false,
				theme: "dark-plus",
				staticMediaQuery: "not screen, (max-width: 10px)",

		 }]],
	},
});

module.exports = withMDX({
	pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
	eslint: { ignoreDuringBuilds: true },
});
