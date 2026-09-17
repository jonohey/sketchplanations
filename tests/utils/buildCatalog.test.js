import { describe, expect, it } from "vitest";

import { booksFromSketchplanations } from "../../utils/bookLinks.mjs";
import { initialSearchResultsFromCatalog } from "../../utils/buildInitialSearchResults.mjs";
import { rssItemsFromCatalog } from "../../utils/buildRss.mjs";
import { searchIndexFromCatalog } from "../../utils/buildSearchIndex.mjs";
import { sitemapDocumentUrls } from "../../utils/buildSitemap.mjs";
import { sketchTooltipEntries } from "../../utils/buildSketchTooltipsData.mjs";
import {
	newerSketchplanationUids,
	newestSketchplanations,
	sketchplanationUids,
	sortDocsByLastPublicationDateAsc,
	sortSketchplanationsByPublishedAtDesc,
	sortTagsByIdentifier,
} from "../../utils/fetchBuildCatalog.mjs";
import { buildCatalog, buildCatalogSketches } from "../fixtures/build-catalog.js";

describe("catalog sorting", () => {
	it("orders sketches by published_at descending", () => {
		expect(
			sortSketchplanationsByPublishedAtDesc(buildCatalogSketches).map(
				({ uid }) => uid,
			),
		).toEqual([
			"newest-sketch",
			"middle-sketch",
			"edited-recently",
			"oldest-sketch",
		]);
	});

	it("orders documents by last_publication_date ascending for sitemap lastmod", () => {
		expect(
			sortDocsByLastPublicationDateAsc(buildCatalogSketches).map(
				({ uid }) => uid,
			),
		).toEqual([
			"oldest-sketch",
			"middle-sketch",
			"newest-sketch",
			"edited-recently",
		]);
	});

	it("orders tags by identifier", () => {
		expect(
			sortTagsByIdentifier(buildCatalog.tags).map((tag) => tag.data.identifier),
		).toEqual(["psychology", "science"]);
	});
});

describe("catalog derivatives", () => {
	it("takes the newest sketches for RSS and initial search", () => {
		expect(newestSketchplanations(buildCatalogSketches, 2).map(({ uid }) => uid)).toEqual([
			"newest-sketch",
			"middle-sketch",
		]);
	});

	it("drops the oldest sketches from the newer set", () => {
		expect(newerSketchplanationUids(buildCatalogSketches, 2)).toEqual([
			"newest-sketch",
			"middle-sketch",
		]);
		expect(newerSketchplanationUids(buildCatalogSketches, 4)).toEqual([]);
	});

	it("lists every uid for the KV set", () => {
		expect(sketchplanationUids(buildCatalogSketches)).toEqual([
			"oldest-sketch",
			"middle-sketch",
			"edited-recently",
			"newest-sketch",
		]);
	});
});

describe("searchIndexFromCatalog", () => {
	it("indexes sketches newest-first and counts category usage", () => {
		const index = searchIndexFromCatalog(buildCatalog);

		expect(index.sketches.map(({ uid }) => uid)).toEqual([
			"newest-sketch",
			"middle-sketch",
			"edited-recently",
			"oldest-sketch",
		]);
		expect(index.sketches[1].body).toContain("Factfulness");
		expect(index.sketches[1].categories).toBe("science psychology");

		expect(index.categories.map(({ slug, count }) => ({ slug, count }))).toEqual([
			{ slug: "psychology", count: 2 },
			{ slug: "science", count: 2 },
		]);
	});
});

describe("rssItemsFromCatalog", () => {
	it("emits the newest sketches with escaped image URLs", () => {
		const items = rssItemsFromCatalog(buildCatalog);

		expect(items.map(({ guid }) => guid)).toEqual([
			"https://sketchplanations.com/newest-sketch",
			"https://sketchplanations.com/middle-sketch",
			"https://sketchplanations.com/edited-recently",
			"https://sketchplanations.com/oldest-sketch",
		]);
		expect(items.at(-1).description.$).toContain(
			"https://images.example.com/oldest.png?foo=1&amp;bar=2&amp;w=798",
		);
	});
});

describe("sitemapDocumentUrls", () => {
	it("uses the latest CMS publication date for the homepage lastmod", () => {
		const urls = sitemapDocumentUrls(buildCatalog);
		const home = urls[0];
		const sketchUrls = urls.slice(1, 5);
		const tagUrls = urls.slice(5);

		expect(home).toMatchObject({
			loc: "https://sketchplanations.com/",
			priority: "1.00",
		});
		expect(home.lastmod).toBe(new Date("2025-09-01T00:00:00+0000").toISOString());

		expect(sketchUrls.map(({ loc }) => loc)).toEqual([
			"https://sketchplanations.com/oldest-sketch",
			"https://sketchplanations.com/middle-sketch",
			"https://sketchplanations.com/newest-sketch",
			"https://sketchplanations.com/edited-recently",
		]);
		expect(tagUrls.map(({ loc }) => loc)).toEqual([
			"https://sketchplanations.com/categories/psychology",
			"https://sketchplanations.com/categories/science",
		]);
	});
});

describe("other catalog consumers", () => {
	it("builds tooltip entries from uid and image", () => {
		expect(sketchTooltipEntries(buildCatalogSketches)).toEqual([
			{
				uid: "oldest-sketch",
				image: buildCatalogSketches[0].data.image,
			},
			{
				uid: "middle-sketch",
				image: buildCatalogSketches[1].data.image,
			},
			{
				uid: "edited-recently",
				image: buildCatalogSketches[2].data.image,
			},
			{
				uid: "newest-sketch",
				image: buildCatalogSketches[3].data.image,
			},
		]);
	});

	it("uses the newest sketches for the empty search grid", () => {
		expect(
			initialSearchResultsFromCatalog(buildCatalog).map(({ uid }) => uid),
		).toEqual([
			"newest-sketch",
			"middle-sketch",
			"edited-recently",
			"oldest-sketch",
		]);
	});

	it("extracts affiliate books from sketch bodies", () => {
		const books = booksFromSketchplanations(buildCatalogSketches);

		expect(books).toHaveLength(1);
		expect(books[0].title).toBe("Factfulness");
		expect(books[0].sketches[0].uid).toBe("middle-sketch");
	});
});
