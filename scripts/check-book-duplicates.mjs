import fs from "node:fs";
import path from "node:path";

import { findPotentialDuplicateBooks } from "../utils/bookLinks.mjs";

const BOOKS_INDEX_PATH = path.join(process.cwd(), "data/books-index.json");

function loadBooksIndex() {
	if (!fs.existsSync(BOOKS_INDEX_PATH)) {
		console.error(
			"[check-book-duplicates] Missing data/books-index.json — run npm run build:books first.",
		);
		process.exit(1);
	}

	return JSON.parse(fs.readFileSync(BOOKS_INDEX_PATH, "utf8")).books ?? [];
}

const duplicates = findPotentialDuplicateBooks(loadBooksIndex());

if (duplicates.length === 0) {
	console.log("[check-book-duplicates] No likely duplicate books found.");
	process.exit(0);
}

console.error("[check-book-duplicates] Likely duplicate books found:");
for (const { a, b, reason } of duplicates) {
	console.error(`  - "${a.title}" / "${b.title}" (${reason})`);
}

process.exit(1);
