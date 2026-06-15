import Fuse from "fuse.js";
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import {
	createCategoryFuse,
	createSketchFuse,
	searchCategories,
	searchSketches,
} from "helpers/search/fuseSearch.js";

const indexPath = path.join(process.cwd(), "data/search-index.json");
const index = JSON.parse(fs.readFileSync(indexPath, "utf8"));
const sketchFuse = createSketchFuse(Fuse, index.sketches);
const categoryFuse = createCategoryFuse(Fuse, index.categories);

const search = (query, limit = 20) =>
	searchSketches(sketchFuse, index.sketches, query, { limit });

const topUid = (query) => search(query, 5).items[0]?.uid;

const includesUid = (query, uid) =>
	search(query).items.some((result) => result.uid === uid);

const topCategorySlug = (query) =>
	searchCategories(categoryFuse, index.categories, query, { limit: 5 }).items[0]
		?.slug;

describe("search index integration", () => {
	it("finds title and exact-ish matches", () => {
		expect(includesUid("doppler", "the-doppler-effect")).toBe(true);
		expect(includesUid("the doppler effect", "the-doppler-effect")).toBe(true);
		expect(includesUid("fun scale", "the-fun-scale")).toBe(true);
		expect(includesUid("black swan", "black-swan")).toBe(true);
		expect(includesUid("trolley problem", "the-trolley-problem")).toBe(true);
		expect(includesUid("pomodoro technique", "the-pomodoro-technique")).toBe(
			true,
		);
		expect(includesUid("mcnamara fallacy", "the-mcnamara-fallacy")).toBe(true);
	});

	it("finds typo-tolerant matches", () => {
		expect(includesUid("dopler", "the-doppler-effect")).toBe(true);
		expect(search("dopler").matchQuality).toBe("weak");
		expect(includesUid("pomodoroo", "the-pomodoro-technique")).toBe(true);
		expect(includesUid("trolly problem", "the-trolley-problem")).toBe(true);
		expect(includesUid("mcnamara falacy", "the-mcnamara-fallacy")).toBe(true);
		expect(includesUid("didero effect", "the-diderot-effect")).toBe(true);
	});

	it("pins exact category matches", () => {
		for (const category of [
			"psychology",
			"nature",
			"sport",
			"technology",
			"creativity",
			"productivity",
			"learning",
			"business",
			"design",
		]) {
			expect(topCategorySlug(category)).toBe(category);
		}
	});

	it("handles spacing and punctuation variants", () => {
		for (const query of ["Mc Namara", "McNamara", "mcnamara", "Mc-Namara"]) {
			expect(includesUid(query, "the-mcnamara-fallacy")).toBe(true);
		}

		expect(
			includesUid("dont think of an elephant", "dont-think-of-an-elephant"),
		).toBe(true);
		expect(
			includesUid("don't think of an elephant", "dont-think-of-an-elephant"),
		).toBe(true);
		expect(includesUid("2 factor authentication", "2fa")).toBe(true);
		expect(includesUid("two factor authentication", "2fa")).toBe(true);
		expect(includesUid("two-factor authentication", "2fa")).toBe(true);
	});

	it("finds body and alt text matches", () => {
		expect(includesUid("unknown unknowns", "unknown-unknowns")).toBe(true);
		expect(search("unknown unknowns").matchQuality).toBe("good");

		const waveFrequency = search("wave frequency");
		expect(
			waveFrequency.items.some((item) => item.uid === "the-frequency-illusion"),
		).toBe(true);
		expect(waveFrequency.matchQuality).toBe("weak");
	});

	it("ranks title matches near the top", () => {
		expect(topUid("doppler")).toBe("the-doppler-effect");
		expect(topUid("the doppler effect")).toBe("the-doppler-effect");
		expect(topUid("mcnamara")).toBe("the-mcnamara-fallacy");
	});

	it("returns no results for nonsense queries", () => {
		const { items, matchQuality } = search("asdfghjklzzzz");
		expect(items).toHaveLength(0);
		expect(matchQuality).toBe("none");
	});

	it("filters very poor sketch matches", () => {
		const { items, matchQuality } = search("quantum foam");
		expect(items).toHaveLength(0);
		expect(matchQuality).toBe("none");
	});

	it("returns only good matches for strong queries", () => {
		const { items, matchQuality } = search("doppler");
		expect(matchQuality).toBe("good");
		expect(items.every((item) => item.uid === "the-doppler-effect")).toBe(true);
	});
});
