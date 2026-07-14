import { withSentryConfig } from "@sentry/nextjs";
import redirects from "./redirects.mjs";

const nextConfig = {
	allowedDevOrigins: ["*.trycloudflare.com"],
	experimental: {
		largePageDataBytes: 256 * 1000, // 128KB by default
	},
	images: {
		remotePatterns: [
			{
				hostname: "images.prismic.io",
			},
		],
		imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 448, 512],
		qualities: [75, 90, 95],
		// loader: "custom",
		// loaderFile: "./loader.js",
	},
	async headers() {
		return [
			{
				source: "/rss.xml",
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

export default withSentryConfig(nextConfig, {
	org: process.env.SENTRY_ORG,
	project: process.env.SENTRY_PROJECT,
	authToken: process.env.SENTRY_AUTH_TOKEN,
	// Only print source-map upload logs in CI
	silent: !process.env.CI,
	widenClientFileUpload: true,
	webpack: {
		treeshake: {
			removeDebugLogging: true,
		},
	},
});
