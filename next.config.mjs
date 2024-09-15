import redirects from "./redirects.mjs";

const nextConfig = {
	experimental: {
		largePageDataBytes: 256 * 1000, // 128KB by default
	},
	images: {
		domains: ["images.prismic.io"],
		// loader: "custom",
		// loaderFile: "./loader.js",
	},
	async headers() {
		return [
			{
				source: "/rss",
				headers: [
					{
						key: "Content-Type",
						value: "application/rss+xml",
					},
					{
						key: "Cache-Control",
						value: "public, max-age=3600",
					},
				],
			},
		];
	},
	async redirects() {
		return redirects;
	},
};

export default async () => nextConfig;
