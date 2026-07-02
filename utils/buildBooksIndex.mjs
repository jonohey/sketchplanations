import fs from "node:fs";
import path from "node:path";

import { client } from "../services/prismic.mjs";
import { fetchBooksFromPrismic } from "./bookLinks.mjs";

const OVERRIDES_PATH = path.join(process.cwd(), "data/books-overrides.json");

function loadOverrides() {
	try {
		const raw = fs.readFileSync(OVERRIDES_PATH, "utf8");
		const data = JSON.parse(raw);
		return data.books ?? {};
	} catch {
		return {};
	}
}

async function buildBooksIndex() {
	console.time("[buildBooksIndex]");
	console.log("[buildBooksIndex] Starting...");

	const overridesByTitle = loadOverrides();
	const books = await fetchBooksFromPrismic(client, overridesByTitle);

	const output = {
		generatedAt: new Date().toISOString(),
		books,
	};

	const filePath = path.join(process.cwd(), "data/books-index.json");
	fs.writeFileSync(filePath, JSON.stringify(output, null, 2));

	console.log(`[buildBooksIndex] Wrote ${books.length} books`);
	console.timeEnd("[buildBooksIndex]");
}

export default buildBooksIndex;

if (import.meta.url === `file://${process.argv[1]}`) {
	buildBooksIndex().catch((error) => {
		console.error("[buildBooksIndex] Failed:", error);
		process.exit(1);
	});
}
