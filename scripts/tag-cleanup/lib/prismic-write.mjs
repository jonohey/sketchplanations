/**
 * Prismic Migration API write client (requires PRISMIC_WRITE_TOKEN).
 */
import dotenv from "dotenv";
import path from "node:path";
import * as prismic from "@prismicio/client";

import { REPO_ROOT } from "./paths.mjs";

dotenv.config({ path: path.join(REPO_ROOT, ".env") });
dotenv.config({ path: path.join(REPO_ROOT, ".env.local"), override: true });

const REPOSITORY = "sketchplanations";

export const getWriteClient = () => {
	const writeToken = process.env.PRISMIC_WRITE_TOKEN?.trim();
	if (!writeToken) {
		throw new Error(
			"PRISMIC_WRITE_TOKEN is not set. Add a permanent write token to .env or .env.local (Prismic → Settings → API & Security).",
		);
	}
	if (writeToken.startsWith("=")) {
		throw new Error(
			"PRISMIC_WRITE_TOKEN looks malformed (starts with '='). In .env.local use a single equals, e.g. PRISMIC_WRITE_TOKEN=eyJ... or PRISMIC_WRITE_TOKEN=\"eyJ...\"",
		);
	}
	return prismic.createWriteClient(REPOSITORY, { writeToken });
};

export const createMigration = () => prismic.createMigration();
