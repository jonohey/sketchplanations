import Fuse from "fuse.js";
import { describe, expect, it } from "vitest";

import {
	createCategoryFuse,
	createSketchFuse,
	searchCategories,
	searchSketches,
} from "helpers/search/fuseSearch.js";

const sketches = [
	{
		id: "1",
		uid: "doppler-effect",
		title: "The Doppler Effect",
		titleNormalized: "the doppler effect",
		body: "An ambulance siren changes pitch as it passes due to frequency change.",
		bodyNormalized:
			"an ambulance siren changes pitch as it passes due to frequency change",
		imageAlt: "Wave frequency from a moving siren",
		imageAltNormalized: "wave frequency from a moving siren",
		categories: "Science Nature",
		categoriesNormalized: "science nature",
		categorySlugs: "science nature",
		tags: "Science Nature",
		tagsNormalized: "science nature",
		image: { url: "https://example.com/doppler.png", alt: "Wave frequency" },
	},
	{
		id: "2",
		uid: "mcnamara-fallacy",
		title: "McNamara Fallacy",
		titleNormalized: "mcnamara fallacy",
		body: "Decision making based only on metrics ignores unknown unknowns.",
		bodyNormalized:
			"decision making based only on metrics ignores unknown unknowns",
		imageAlt: "Charts and missing qualitative detail",
		imageAltNormalized: "charts and missing qualitative detail",
		categories: "Business Psychology",
		categoriesNormalized: "business psychology",
		categorySlugs: "business psychology",
		tags: "Business Psychology",
		tagsNormalized: "business psychology",
		image: { url: "https://example.com/mcnamara.png", alt: "Charts" },
	},
	{
		id: "3",
		uid: "feedback-loops",
		title: "Feedback loops",
		titleNormalized: "feedback loops",
		body: "Systems thinking often involves positive feedback loop and negative feedback.",
		bodyNormalized:
			"systems thinking often involves positive feedback loop and negative feedback",
		imageAlt: "Two loops showing a feedback loop",
		imageAltNormalized: "two loops showing a feedback loop",
		categories: "Learning",
		categoriesNormalized: "learning",
		categorySlugs: "learning",
		tags: "Learning",
		tagsNormalized: "learning",
		image: { url: "https://example.com/loops.png", alt: "Two loops" },
	},
];

const categories = [
	{
		id: "c1",
		identifier: "Psychology",
		slug: "psychology",
		identifierNormalized: "psychology",
		slugNormalized: "psychology",
	},
	{
		id: "c2",
		identifier: "Nature",
		slug: "nature",
		identifierNormalized: "nature",
		slugNormalized: "nature",
	},
];

const sketchFuse = createSketchFuse(Fuse, sketches);
const categoryFuse = createCategoryFuse(Fuse, categories);

describe("searchSketches", () => {
	it("ranks exact title matches first", () => {
		const { items } = searchSketches(sketchFuse, sketches, "the doppler effect");
		expect(items[0]?.uid).toBe("doppler-effect");
		expect(items).toHaveLength(1);
	});

	it("finds typo-tolerant title matches as weak results", () => {
		const { items, matchQuality } = searchSketches(sketchFuse, sketches, "dopler");
		expect(items.some((result) => result.uid === "doppler-effect")).toBe(true);
		expect(matchQuality).toBe("weak");
	});

	it("matches spacing variants for McNamara", () => {
		for (const query of ["mc namara", "mcnamara", "Mc-Namara"]) {
			const { items } = searchSketches(sketchFuse, sketches, query);
			expect(items.some((result) => result.uid === "mcnamara-fallacy")).toBe(
				true,
			);
		}
	});

	it("matches body text as a weak result", () => {
		const { items, matchQuality } = searchSketches(
			sketchFuse,
			sketches,
			"ambulance siren",
		);
		expect(items[0]?.uid).toBe("doppler-effect");
		expect(matchQuality).toBe("weak");
	});

	it("matches alt text above body-only matches", () => {
		const { items } = searchSketches(sketchFuse, sketches, "feedback loop");
		expect(items[0]?.uid).toBe("feedback-loops");
	});

	it("filters out poor matches when a good match exists", () => {
		const { items, matchQuality } = searchSketches(
			sketchFuse,
			sketches,
			"the doppler effect",
		);

		expect(matchQuality).toBe("good");
		expect(items).toHaveLength(1);
	});
});

describe("searchCategories", () => {
	it("pins exact category matches to the top", () => {
		const { items } = searchCategories(categoryFuse, categories, "psychology");
		expect(items[0]?.slug).toBe("psychology");
		expect(items).toHaveLength(1);
	});

	it("still finds fuzzy category matches", () => {
		const { items } = searchCategories(categoryFuse, categories, "psycology");
		expect(items.some((result) => result.slug === "psychology")).toBe(true);
	});

	it("reports exact category matches", () => {
		const { hasExactMatch } = searchCategories(
			categoryFuse,
			categories,
			"psychology",
		);
		expect(hasExactMatch).toBe(true);
	});
});
