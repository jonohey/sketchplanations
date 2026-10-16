import { describe, expect, it } from "vitest";

import { BOOK_REVIEWS } from "../../helpers/bookReviews";
import {
	arrangeReaderQuotes,
	seededRandom,
} from "../../helpers/pickReaderQuotes";
import { READER_QUOTES } from "../../helpers/readerQuotes";

describe("READER_QUOTES", () => {
	it("has unique ids and a quote for each", () => {
		const ids = READER_QUOTES.map((quote) => quote.id);
		expect(new Set(ids).size).toBe(ids.length);
		for (const quote of READER_QUOTES) {
			expect(quote.quote, quote.id).toBeTruthy();
		}
	});

	it("contains no email addresses", () => {
		expect(JSON.stringify(READER_QUOTES)).not.toMatch(/\S+@\S+\.\S+/);
	});
});

describe("BOOK_REVIEWS", () => {
	it("has unique ids, a short quote, a source and a rating for each", () => {
		const ids = BOOK_REVIEWS.map((review) => review.id);
		expect(new Set(ids).size).toBe(ids.length);
		for (const review of BOOK_REVIEWS) {
			expect(review.quote.length, review.id).toBeGreaterThan(0);
			expect(review.quote.length, review.id).toBeLessThanOrEqual(200);
			expect(["amazon", "goodreads"]).toContain(review.source);
			expect([1, 2, 3, 4, 5]).toContain(review.rating);
		}
	});
});

describe("arrangeReaderQuotes", () => {
	const quote = (id, length, featured = false) => ({
		id,
		quote: "x".repeat(length),
		featured,
	});
	const quotes = [
		quote("f1", 40, true),
		quote("f2", 200, true),
		quote("a", 20),
		quote("b", 60),
		quote("c", 100),
		quote("d", 150),
		quote("e", 180),
	];

	it("uses every quote exactly once, in columns of at most two", () => {
		for (let seed = 1; seed < 30; seed++) {
			const columns = arrangeReaderQuotes(quotes, seededRandom(seed));
			const ids = columns.flat().map((q) => q.id);
			expect(ids.sort()).toEqual(quotes.map((q) => q.id).sort());
			for (const column of columns) {
				expect(column.length).toBeGreaterThan(0);
				expect(column.length).toBeLessThanOrEqual(2);
			}
		}
	});

	it("pairs long quotes with short ones", () => {
		const columns = arrangeReaderQuotes(quotes, seededRandom(3));
		const longest = columns.find((column) => column.some((q) => q.id === "f2"));
		expect(longest.map((q) => q.id)).toContain("a");
	});

	it("puts featured columns at the start and end", () => {
		const columns = arrangeReaderQuotes(quotes, seededRandom(5));
		const hasFeatured = (column) => column.some((q) => q.featured);
		expect(hasFeatured(columns[0])).toBe(true);
		expect(hasFeatured(columns.at(-1))).toBe(true);
	});

	it("opens on a column led by a lead quote", () => {
		const withLeads = [
			...quotes,
			quote("l1", 80, false),
			quote("l2", 120, false),
		].map((q) => (q.id.startsWith("l") ? { ...q, lead: true } : q));
		for (let seed = 1; seed < 30; seed++) {
			const columns = arrangeReaderQuotes(withLeads, seededRandom(seed));
			expect(columns[0][0].lead).toBe(true);
			expect(columns[0]).toHaveLength(2);
			expect(columns.flat()).toHaveLength(withLeads.length);
		}
	});

	it("is deterministic for a given seed", () => {
		expect(arrangeReaderQuotes(quotes, seededRandom(9))).toEqual(
			arrangeReaderQuotes(quotes, seededRandom(9)),
		);
	});
});
