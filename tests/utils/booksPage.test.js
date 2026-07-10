import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import {
	buildBooksIndex,
	findPotentialDuplicateBooks,
	normalizeBookTitle,
} from "../../utils/bookLinks.mjs";

const OVERRIDES_PATH = path.join(process.cwd(), "data/books-overrides.json");
const AUTHORS_PATH = path.join(process.cwd(), "data/books-authors.json");

function loadBooksOverrides() {
	return JSON.parse(fs.readFileSync(OVERRIDES_PATH, "utf8")).books ?? {};
}

function loadBooksAuthors() {
	return JSON.parse(fs.readFileSync(AUTHORS_PATH, "utf8")).authors ?? {};
}

function mergeMetadataOverrides(overridesByTitle, authorsByTitle) {
	const merged = { ...overridesByTitle };

	for (const [titleKey, author] of Object.entries(authorsByTitle)) {
		if (!author || merged[titleKey]?.author) continue;

		merged[titleKey] = {
			...(merged[titleKey] ?? {}),
			author,
		};
	}

	return merged;
}

describe("books page curation files", () => {
	it("uses normalised keys in books-authors.json", () => {
		const authors = loadBooksAuthors();

		for (const key of Object.keys(authors)) {
			expect(key).toBe(key.toLowerCase());
			expect(key).toMatch(/^[a-z0-9 ]+$/);
		}
	});
});

describe("books page index quality", () => {
	it("builds clean titles from known messy link texts", () => {
		const overrides = mergeMetadataOverrides(
			loadBooksOverrides(),
			loadBooksAuthors(),
		);

		const books = buildBooksIndex(
			[
				{
					url: "https://amzn.to/greenlights-audio",
					text: "audiobook of Greenlights",
					uid: "a",
					sketchTitle: "A",
				},
				{
					url: "https://geni.us/greenlights",
					text: "Greenlights",
					uid: "b",
					sketchTitle: "B",
				},
				{
					url: "https://geni.us/pyramid",
					text: "her book The Pyramid Principle",
					uid: "c",
					sketchTitle: "C",
				},
			],
			overrides,
		);

		const badTitlePattern = /audiobook|her book|his book|popular book on/i;

		for (const book of books) {
			expect(badTitlePattern.test(book.title)).toBe(false);
			expect(book.note).toBeNull();
		}

		expect(books.find((book) => book.title === "Greenlights")?.sketches).toHaveLength(
			2,
		);
		expect(
			books.find((book) => normalizeBookTitle(book.title) === "the pyramid principle")
				?.author,
		).toBe("Barbara Minto");
	});

	it("has no likely duplicate books in the built index", () => {
		const indexPath = path.join(process.cwd(), "data/books-index.json");
		if (!fs.existsSync(indexPath)) return;

		const index = JSON.parse(fs.readFileSync(indexPath, "utf8"));
		const duplicates = findPotentialDuplicateBooks(index.books ?? []);

		expect(
			duplicates,
			duplicates
				.map(
					({ a, b, reason }) =>
						`"${a.title}" / "${b.title}" (${reason})`,
				)
				.join("\n"),
		).toEqual([]);
	});
});
