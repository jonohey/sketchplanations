import fs from "node:fs";
import path from "node:path";

import { client } from "../services/prismic.mjs";
import { fetchBooksFromPrismic } from "./bookLinks.mjs";

const OVERRIDES_PATH = path.join(process.cwd(), "data/books-overrides.json");
const AUTHORS_PATH = path.join(process.cwd(), "data/books-authors.json");
const COVERS_PATH = path.join(process.cwd(), "data/books-covers.json");

function loadJson(filePath, fallback) {
	try {
		const raw = fs.readFileSync(filePath, "utf8");
		return JSON.parse(raw);
	} catch {
		return fallback;
	}
}

function loadOverrides() {
	const data = loadJson(OVERRIDES_PATH, { books: {} });
	return data.books ?? {};
}

function loadAuthorsByTitle() {
	const data = loadJson(AUTHORS_PATH, { authors: {} });
	return data.authors ?? {};
}

function loadCoversByTitle() {
	const data = loadJson(COVERS_PATH, { covers: {} });
	return data.covers ?? {};
}

function mergeMetadataOverrides(overridesByTitle, authorsByTitle, coversByTitle) {
	const merged = { ...overridesByTitle };

	for (const [titleKey, author] of Object.entries(authorsByTitle)) {
		if (!author || merged[titleKey]?.author) continue;

		merged[titleKey] = {
			...(merged[titleKey] ?? {}),
			author,
		};
	}

	for (const [titleKey, cover] of Object.entries(coversByTitle)) {
		const thumbnail = typeof cover === "string" ? cover : cover?.path;
		if (!thumbnail || merged[titleKey]?.thumbnail) continue;

		merged[titleKey] = {
			...(merged[titleKey] ?? {}),
			thumbnail,
		};
	}

	return merged;
}

async function buildBooksIndex() {
	console.time("[buildBooksIndex]");
	console.log("[buildBooksIndex] Starting...");

	const overridesByTitle = mergeMetadataOverrides(
		loadOverrides(),
		loadAuthorsByTitle(),
		loadCoversByTitle(),
	);
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
