import { defineConfig } from "vitest/config";
import path from "path";

const rootDir = import.meta.dirname;

export default defineConfig({
	test: {
		environment: "node",
		clearMocks: true,
	},
	resolve: {
		alias: {
			"services/": `${path.resolve(rootDir, "services")}/`,
			helpers: path.resolve(rootDir, "helpers"),
		},
	},
});

