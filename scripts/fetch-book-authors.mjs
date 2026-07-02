import fs from "node:fs";
import path from "node:path";

import { normalizeBookTitle } from "../utils/bookLinks.mjs";

const BOOKS_INDEX_PATH = path.join(process.cwd(), "data/books-index.json");
const AUTHORS_PATH = path.join(process.cwd(), "data/books-authors.json");
const OVERRIDES_PATH = path.join(process.cwd(), "data/books-overrides.json");

const USER_AGENT = "SketchplanationsBooksBot/1.0 (author lookup; jonohey@sketchplanations.com)";

function loadJson(filePath, fallback) {
	try {
		return JSON.parse(fs.readFileSync(filePath, "utf8"));
	} catch {
		return fallback;
	}
}

function lookupTitle(title) {
	return title
		.replace(/^audiobook of\s+/i, "")
		.replace(/\s+book$/i, "")
		.trim();
}

async function resolveProductId(url) {
	const response = await fetch(url, {
		redirect: "follow",
		headers: { "User-Agent": USER_AGENT },
	});

	const finalUrl = response.url;
	const patterns = [
		/\/dp\/([A-Z0-9]{10})/i,
		/\/gp\/product\/([A-Z0-9]{10})/i,
		/\/d\/([A-Z0-9]{10})/i,
	];

	for (const pattern of patterns) {
		const match = finalUrl.match(pattern);
		if (match) return match[1];
	}

	return null;
}

async function fetchAuthorNames(authorRefs) {
	const names = [];

	for (const authorRef of authorRefs.slice(0, 2)) {
		const response = await fetch(`https://openlibrary.org${authorRef.key}.json`, {
			headers: { "User-Agent": USER_AGENT },
		});

		if (!response.ok) continue;

		const author = await response.json();
		if (author.name) names.push(author.name);
	}

	return names;
}

async function lookupByProductId(productId) {
	const response = await fetch(`https://openlibrary.org/isbn/${productId}.json`, {
		headers: { "User-Agent": USER_AGENT },
	});

	if (!response.ok) return null;

	const edition = await response.json();
	const authors = edition.authors?.length
		? await fetchAuthorNames(edition.authors)
		: [];

	return authors.length ? authors.join(", ") : null;
}

async function lookupByTitle(title) {
	const query = encodeURIComponent(lookupTitle(title));
	const response = await fetch(
		`https://openlibrary.org/search.json?title=${query}&limit=5`,
		{ headers: { "User-Agent": USER_AGENT } },
	);

	if (!response.ok) return null;

	const data = await response.json();
	const normalizedTitle = lookupTitle(title).toLowerCase();

	for (const doc of data.docs ?? []) {
		if (!doc.author_name?.length || !doc.title) continue;

		const docTitle = doc.title.toLowerCase();
		if (
			docTitle === normalizedTitle ||
			docTitle.startsWith(normalizedTitle.slice(0, 12)) ||
			normalizedTitle.startsWith(docTitle.slice(0, 12))
		) {
			return doc.author_name.slice(0, 2).join(", ");
		}
	}

	return null;
}

async function lookupAuthor(book) {
	const productId = await resolveProductId(book.url);
	if (productId) {
		const author = await lookupByProductId(productId);
		if (author) return { author, source: "isbn" };
	}

	const author = await lookupByTitle(book.title);
	if (author) return { author, source: "title" };

	return null;
}

async function fetchBookAuthors({ force = false } = {}) {
	const index = loadJson(BOOKS_INDEX_PATH, { books: [] });
	const overrides = loadJson(OVERRIDES_PATH, { books: {} }).books ?? {};
	const authors = loadJson(AUTHORS_PATH, { authors: {} }).authors ?? {};

	const missing = index.books.filter((book) => {
		const key = normalizeBookTitle(book.title);
		if (overrides[key]?.author) return false;
		if (book.author) return false;
		if (!force && authors[key]) return false;
		return true;
	});

	console.log(`[fetchBookAuthors] Looking up ${missing.length} books...`);

	let found = 0;
	let failed = 0;

	for (const book of missing) {
		const key = normalizeBookTitle(book.title);

		try {
			const result = await lookupAuthor(book);

			if (result) {
				authors[key] = result.author;
				found += 1;
				console.log(`✓ ${book.title} → ${result.author} (${result.source})`);
			} else {
				failed += 1;
				console.log(`✗ ${book.title}`);
			}
		} catch (error) {
			failed += 1;
			console.log(`✗ ${book.title} (${error.message})`);
		}

		await new Promise((resolve) => setTimeout(resolve, 300));
	}

	const sortedAuthors = Object.fromEntries(
		Object.entries(authors).sort(([a], [b]) => a.localeCompare(b)),
	);

	fs.writeFileSync(
		AUTHORS_PATH,
		`${JSON.stringify({ authors: sortedAuthors }, null, "\t")}\n`,
	);

	console.log(
		`[fetchBookAuthors] Done. Found ${found}, still missing ${failed}. Wrote ${Object.keys(sortedAuthors).length} authors.`,
	);
}

const force = process.argv.includes("--force");

fetchBookAuthors({ force }).catch((error) => {
	console.error("[fetchBookAuthors] Failed:", error);
	process.exit(1);
});
