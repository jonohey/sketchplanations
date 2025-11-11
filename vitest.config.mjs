import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
	test: {
		environment: "node",
		clearMocks: true,
	},
	resolve: {
		alias: {
			"services/": `${path.resolve(__dirname, "services")}/`,
		},
	},
});

