import { describe, expect, it } from "vitest";

import {
	applyMergeMapToSketchTags,
	applyTagChangesToSketchTags,
	findSingularPluralPairs,
	normalizeIdentifier,
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
});
