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

const indexPath = path.join(
	process.cwd(),
	"tests/fixtures/search-index.json",
);
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
		const dopler = search("dopler");
		expect(dopler.items.some((result) => result.uid === "the-doppler-effect")).toBe(
			true,
		);
		expect(dopler.matchQuality).toBe("corrected");
		expect(dopler.correctedLabel).toBe("Doppler");

		expect(includesUid("pomodoroo", "the-pomodoro-technique")).toBe(true);
		expect(includesUid("trolly problem", "the-trolley-problem")).toBe(true);
		expect(includesUid("mcnamara falacy", "the-mcnamara-fallacy")).toBe(true);
		expect(includesUid("didero effect", "the-diderot-effect")).toBe(true);
	});

	it("returns full-text matches for multi-word concept queries", () => {
		const systemsThinking = search("systems thinking");
		expect(systemsThinking.matchQuality).toBe("good");
		expect(systemsThinking.items.length).toBeGreaterThan(0);
		expect(systemsThinking.correctedLabel).toBeUndefined();
	});

	it("finds full-text body matches by word stem across the index", () => {
		const whale = search("whale");
		expect(whale.matchQuality).toBe("good");
		// "whale shark" in the body
		expect(whale.items.some((result) => result.uid === "bycatch")).toBe(true);
		// "whaling" shares the stem "whale"
		expect(
			whale.items.some((result) => result.uid === "types-of-phishing"),
		).toBe(true);
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

	it("includes sketch counts on category entries", () => {
		const psychology = index.categories.find(
			(category) => category.slug === "psychology",
		);
		expect(psychology?.count).toBeGreaterThan(0);
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

	it("finds strong body text matches", () => {
		expect(includesUid("unknown unknowns", "unknown-unknowns")).toBe(true);
		expect(search("unknown unknowns").matchQuality).toBe("good");
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

	it("returns no results for unrelated queries", () => {
		const { items, matchQuality } = search("tables of vulture");
		expect(items).toHaveLength(0);
		expect(matchQuality).toBe("none");
	});

	it("surfaces a genuine word match over mid-word noise for short queries", () => {
		// "iq" is buried in "etiquette"/"technique", but only "Common
		// distributions" mentions IQ as a word — it should lead and the mid-word
		// matches should not be confident results.
		const iq = search("iq");
		expect(iq.matchQuality).toBe("good");
		expect(iq.items[0]?.uid).toBe("common-distributions-normal-skewed-pareto");
		expect(
			iq.items.some((result) => result.uid === "urinal-etiquette"),
		).toBe(false);
	});

	it("filters very poor sketch matches", () => {
		const { items, matchQuality } = search("quantum foam");
		expect(items).toHaveLength(0);
		expect(matchQuality).toBe("none");
	});

	it("returns good matches led by the strongest title match", () => {
		const { items, matchQuality } = search("doppler");
		expect(matchQuality).toBe("good");
		expect(items[0]?.uid).toBe("the-doppler-effect");
	});
});
