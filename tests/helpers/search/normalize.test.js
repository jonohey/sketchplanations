import { describe, expect, it } from "vitest";

import { expandQueryVariants, normalizeForSearch } from "helpers/search/normalize.js";

describe("normalizeForSearch", () => {
	it("lowercases and collapses whitespace", () => {
		expect(normalizeForSearch("  The   Doppler   Effect  ")).toBe(
			"the doppler effect",
		);
	});

	it("removes apostrophes", () => {
		expect(normalizeForSearch("don't think")).toBe("dont think");
		expect(normalizeForSearch("dont think")).toBe("dont think");
	});

	it("normalizes hyphens and punctuation", () => {
		expect(normalizeForSearch("Mc-Namara")).toBe("mc namara");
		expect(normalizeForSearch("two-factor authentication")).toBe(
			"two factor authentication",
		);
	});
});

describe("expandQueryVariants", () => {
	it("includes apostrophe variants", () => {
		const variants = expandQueryVariants("don't think");
		expect(variants).toContain("dont think");
	});

	it("includes number and word variants", () => {
		const variants = expandQueryVariants("2 factor authentication");
		expect(variants.some((variant) => variant.includes("two factor"))).toBe(
			true,
		);
	});

	it("includes normalized spacing variants", () => {
		const variants = expandQueryVariants("Mc Namara");
		expect(variants).toContain("mc namara");
	});
});
