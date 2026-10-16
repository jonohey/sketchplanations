import path from "path";
import { defineConfig } from "vitest/config";

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
