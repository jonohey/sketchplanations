import { describe, expect, it } from "vitest";

import {
	applyMergeMapToSketchTags,
	applySketchTagEdits,
	applyTagChangesToSketchTags,
	findSingularPluralPairs,
	isBrokenTagLink,
	normalizeIdentifier,
	stripBrokenTagLinks,
} from "../../scripts/tag-cleanup/lib/tag-utils.mjs";

const tag = (id, slug, identifier = slug) => ({
	id,
	uid: slug,
	slugs: [slug],
	data: { identifier },
});

describe("tag-utils", () => {
	it("normalizes identifiers for comparison", () => {
		expect(normalizeIdentifier("Decision-Making")).toBe("decision making");
	});

	it("finds singular/plural pairs", () => {
		const tags = [tag("a", "sport"), tag("b", "sports")];
		const pairs = findSingularPluralPairs(tags);
		expect(pairs).toHaveLength(1);
		expect(pairs[0].loser.uid).toBe("sport");
		expect(pairs[0].winner.uid).toBe("sports");
	});

	it("applyMergeMapToSketchTags replaces and dedupes", () => {
		const tags = [
			{ tag: { id: "sport-id", link_type: "Document" } },
			{ tag: { id: "other-id", link_type: "Document" } },
		];
		const mergeMap = new Map([["sport-id", "sports-id"]]);
		const result = applyMergeMapToSketchTags(tags, mergeMap);
		expect(result.map((r) => r.tag.id)).toEqual(["sports-id", "other-id"]);
	});

	it("applyTagChangesToSketchTags merges and removes", () => {
		const tags = [
			{ tag: { id: "brand-id", link_type: "Document" } },
			{ tag: { id: "isa-id", link_type: "Document" } },
		];
		const mergeMap = new Map([["brand-id", "branding-id"]]);
		const removeIds = new Set(["isa-id"]);
		const result = applyTagChangesToSketchTags(tags, { mergeMap, removeIds });
		expect(result.map((r) => r.tag.id)).toEqual(["branding-id"]);
	});

	it("dedupes when sketch has both loser and winner", () => {
		const tags = [
			{ tag: { id: "sport-id", link_type: "Document" } },
			{ tag: { id: "sports-id", link_type: "Document" } },
		];
		const mergeMap = new Map([["sport-id", "sports-id"]]);
		const result = applyMergeMapToSketchTags(tags, mergeMap);
		expect(result.map((r) => r.tag.id)).toEqual(["sports-id"]);
	});

	it("applySketchTagEdits removes and adds without duplicates", () => {
		const tags = [
			{ tag: { id: "jogging-id", link_type: "Document" } },
			{ tag: { id: "sport-id", link_type: "Document" } },
		];
		const result = applySketchTagEdits(tags, {
			removeIds: new Set(["jogging-id"]),
			addIds: ["sport-id", "health-id"],
		});
		expect(result.map((r) => r.tag.id)).toEqual(["sport-id", "health-id"]);
	});

	it("detects and strips broken Prismic tag links", () => {
		const tags = [
			{ tag: { id: "broken", type: "broken_type", slug: "-", isBroken: true } },
			{ tag: { link_type: "Document" } },
			{ tag: { id: "games", uid: "games", slug: "games", isBroken: false } },
		];
		expect(isBrokenTagLink(tags[0].tag)).toBe(true);
		expect(isBrokenTagLink(tags[1].tag)).toBe(true);
		expect(isBrokenTagLink(tags[2].tag)).toBe(false);
		expect(isBrokenTagLink({ id: "new", link_type: "Document" })).toBe(false);
		expect(stripBrokenTagLinks(tags).map((t) => t.tag.id)).toEqual(["games"]);
		expect(
			applySketchTagEdits(tags, { addIds: ["sport"] }).map((t) => t.tag.id),
		).toEqual(["games", "sport"]);
	});
});
