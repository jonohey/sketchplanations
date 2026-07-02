import { describe, expect, it } from "vitest";

import {
	buildBooksIndex,
	cleanLinkText,
	extractBookLinksFromBody,
	isBookAffiliateUrl,
	normalizeBookTitle,
	normalizeBookUrl,
	parseBookLinkText,
} from "../../utils/bookLinks.mjs";

describe("isBookAffiliateUrl", () => {
	it("matches common book affiliate hosts", () => {
		expect(isBookAffiliateUrl("https://geni.us/factfulness")).toBe(true);
		expect(isBookAffiliateUrl("https://amzn.to/3YlrrHA")).toBe(true);
		expect(isBookAffiliateUrl("https://www.amazon.co.uk/dp/123")).toBe(true);
		expect(isBookAffiliateUrl("https://a.co/d/abc")).toBe(true);
	});

	it("rejects unrelated links", () => {
		expect(isBookAffiliateUrl("https://example.com/book")).toBe(false);
		expect(isBookAffiliateUrl("https://sketchplanations.com/atomic-habits")).toBe(
			false,
		);
	});
});

describe("parseBookLinkText", () => {
	it("parses title and author from by pattern", () => {
		expect(parseBookLinkText("Factfulness by Hans Rosling")).toEqual({
			title: "Factfulness",
			author: "Hans Rosling",
		});
	});

	it("parses comma-by pattern", () => {
		expect(
			parseBookLinkText(
				"50 Things You Should Know About The First World War, by Jim Eldridge",
			),
		).toEqual({
			title: "50 Things You Should Know About The First World War",
			author: "Jim Eldridge",
		});
	});

	it("cleans leading see and trailing book", () => {
		expect(cleanLinkText("see Factfulness by Hans Rosling")).toBe(
			"Factfulness by Hans Rosling",
		);
		expect(parseBookLinkText("Factfulness book")).toEqual({
			title: "Factfulness",
		});
	});
});

describe("extractBookLinksFromBody", () => {
	it("extracts hyperlink spans from Prismic rich text", () => {
		const body = [
			{
				type: "paragraph",
				text: "Read Factfulness by Hans Rosling for more.",
				spans: [
					{
						start: 5,
						end: 32,
						type: "hyperlink",
						data: {
							link_type: "Web",
							url: "https://geni.us/the-factfulness-book",
						},
					},
				],
			},
		];

		expect(extractBookLinksFromBody(body)).toEqual([
			{
				url: "https://geni.us/the-factfulness-book",
				text: "Factfulness by Hans Rosling",
			},
		]);
	});

	it("ignores non-affiliate links", () => {
		const body = [
			{
				type: "paragraph",
				text: "See the sketch for more.",
				spans: [
					{
						start: 4,
						end: 14,
						type: "hyperlink",
						data: {
							link_type: "Web",
							url: "https://sketchplanations.com/example",
						},
					},
				],
			},
		];

		expect(extractBookLinksFromBody(body)).toEqual([]);
	});
});

describe("buildBooksIndex", () => {
	it("merges duplicate titles and prefers geni.us links", () => {
		const books = buildBooksIndex([
			{
				url: "https://amzn.to/abc",
				text: "Atomic Habits",
				uid: "one",
				sketchTitle: "Sketch One",
			},
			{
				url: "https://geni.us/atomic-habits_clear",
				text: "Atomic Habits",
				uid: "two",
				sketchTitle: "Sketch Two",
			},
		]);

		expect(books).toHaveLength(1);
		expect(books[0].url).toBe("https://geni.us/atomic-habits_clear");
		expect(books[0].sketches).toHaveLength(2);
	});

	it("applies overrides and exclusions", () => {
		const books = buildBooksIndex(
			[
				{
					url: "https://geni.us/the-factfulness-book",
					text: "Factfulness",
					uid: "a",
					sketchTitle: "A",
				},
				{
					url: "https://geni.us/opxUQC7",
					text: "adjustable pliers",
					uid: "b",
					sketchTitle: "B",
				},
			],
			{
				factfulness: {
					author: "Hans Rosling",
					note: "Quietly hopeful.",
				},
				"adjustable pliers": { exclude: true },
			},
		);

		expect(books).toHaveLength(1);
		expect(books[0].title).toBe("Factfulness");
		expect(books[0].author).toBe("Hans Rosling");
		expect(books[0].note).toBe("Quietly hopeful.");
	});
});

describe("normalizeBookTitle", () => {
	it("normalizes titles for grouping", () => {
		expect(normalizeBookTitle("Factfulness")).toBe("factfulness");
		expect(normalizeBookTitle("Atomic Habits book")).toBe("atomic habits");
	});
});

describe("normalizeBookUrl", () => {
	it("normalizes protocol and trailing slash", () => {
		expect(normalizeBookUrl("http://geni.us/test/")).toBe(
			"https://geni.us/test",
		);
	});
});
