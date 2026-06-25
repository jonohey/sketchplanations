import { describe, expect, it } from "vitest";

import {
	isRudeSearch,
	shouldShowStretchMissMessage,
	shouldShowSuggestMissingSketch,
} from "helpers/search/rudeSearch.js";

describe("isRudeSearch", () => {
	it("matches exact rude terms from analytics", () => {
		expect(isRudeSearch("shit")).toBe(true);
		expect(isRudeSearch("Fuck")).toBe(true);
		expect(isRudeSearch("  Dick  ")).toBe(true);
		expect(isRudeSearch("Poop")).toBe(true);
		expect(isRudeSearch("Rude")).toBe(true);
	});

	it("matches additional crude terms", () => {
		expect(isRudeSearch("tits")).toBe(true);
		expect(isRudeSearch("boobs")).toBe(true);
		expect(isRudeSearch("boob")).toBe(true);
		expect(isRudeSearch("farting")).toBe(true);
		expect(isRudeSearch("wanker")).toBe(true);
		expect(isRudeSearch("pussy")).toBe(true);
	});

	it("matches rude terms inside a longer query", () => {
		expect(isRudeSearch("oh shit")).toBe(true);
		expect(isRudeSearch("what the fuck")).toBe(true);
	});

	it("does not match bullshit because of the bs asymmetry principle sketch", () => {
		expect(isRudeSearch("bullshit")).toBe(false);
	});

	it("does not match crap because of Sturgeon's law sketch topic", () => {
		expect(isRudeSearch("crap")).toBe(false);
	});

	it("does not match legitimate sketch topics", () => {
		expect(isRudeSearch("sex")).toBe(false);
		expect(isRudeSearch("sexual")).toBe(false);
		expect(isRudeSearch("naked")).toBe(false);
		expect(isRudeSearch("classic")).toBe(false);
	});

	it("does not match ambiguous abbreviations", () => {
		expect(isRudeSearch("bs")).toBe(false);
	});

	it("does not match normal searches", () => {
		expect(isRudeSearch("dunning kruger")).toBe(false);
		expect(isRudeSearch("bureaucracy")).toBe(false);
	});
});

describe("rude search presentation", () => {
	it('shows the easter egg for "fuck" and hides miss feedback', () => {
		const query = "fuck";
		const showRudeSearchEasterEgg = isRudeSearch(query);

		expect(showRudeSearchEasterEgg).toBe(true);
		expect(
			shouldShowStretchMissMessage(true, showRudeSearchEasterEgg),
		).toBe(false);
		expect(shouldShowSuggestMissingSketch(showRudeSearchEasterEgg)).toBe(
			false,
		);
	});

	it("shows miss feedback for normal stretch matches", () => {
		const showRudeSearchEasterEgg = isRudeSearch("dunning");

		expect(showRudeSearchEasterEgg).toBe(false);
		expect(
			shouldShowStretchMissMessage(true, showRudeSearchEasterEgg),
		).toBe(true);
		expect(shouldShowSuggestMissingSketch(showRudeSearchEasterEgg)).toBe(
			true,
		);
	});
});
