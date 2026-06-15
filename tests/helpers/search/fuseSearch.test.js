import Fuse from "fuse.js";
import { describe, expect, it } from "vitest";

import {
	categoryToTagResult,
	createCategoryFuse,
	createSketchFuse,
	getCorrectedQueryLabel,
	isLikelyTypoCorrection,
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
		imageAlt: "Wave frequency from a moving siren",
		categories: "Science Nature",
		image: { url: "https://example.com/doppler.png", alt: "Wave frequency" },
	},
	{
		id: "2",
		uid: "mcnamara-fallacy",
		title: "McNamara Fallacy",
		titleNormalized: "mcnamara fallacy",
		body: "Decision making based only on metrics ignores unknown unknowns.",
		imageAlt: "Charts and missing qualitative detail",
		categories: "Business Psychology",
		image: { url: "https://example.com/mcnamara.png", alt: "Charts" },
	},
	{
		id: "3",
		uid: "feedback-loops",
		title: "Feedback loops",
		titleNormalized: "feedback loops",
		body: "Systems thinking often involves positive feedback loop and negative feedback.",
		imageAlt: "Two loops showing a feedback loop",
		categories: "Learning",
		image: { url: "https://example.com/loops.png", alt: "Two loops" },
	},
	{
		id: "4",
		uid: "turn-carrots-while-cutting",
		title: "Turn carrots while cutting",
		titleNormalized: "turn carrots while cutting",
		body: "Turn carrots while cutting for swifter, smoother cuts.",
		imageAlt: "Carrots being cut",
		categories: "Cooking",
		image: { url: "https://example.com/carrots.png", alt: "Carrots" },
	},
	{
		id: "5",
		uid: "bycatch",
		title: "Bycatch",
		titleNormalized: "bycatch",
		body: "The fish and other creatures, like a whale shark, caught unintentionally.",
		imageAlt: "A whale shark caught in a fishing net",
		categories: "Nature",
		image: { url: "https://example.com/bycatch.png", alt: "Bycatch" },
	},
	{
		id: "6",
		uid: "walk-in-the-wind",
		title: "Walk in the wind",
		titleNormalized: "walk in the wind",
		body: "Going outside in blustery weather to clear your head.",
		imageAlt: "A person walking on a blustery day",
		categories: "Wellbeing",
		image: { url: "https://example.com/wind.png", alt: "Walking in wind" },
	},
	{
		id: "7",
		uid: "9-windows",
		title: "9 Windows",
		titleNormalized: "9 windows",
		body: "A creativity tool with nine panes for thinking across time and scale.",
		imageAlt: "A grid of nine windows",
		categories: "Creativity",
		image: { url: "https://example.com/windows.png", alt: "9 Windows" },
	},
	{
		id: "8",
		uid: "urinal-etiquette",
		title: "Urinal etiquette",
		titleNormalized: "urinal etiquette",
		body: "The unspoken rules of etiquette at the urinal.",
		imageAlt: "Figures spacing themselves out",
		categories: "Etiquette",
		image: { url: "https://example.com/urinal.png", alt: "Urinal etiquette" },
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

	it("finds typo-tolerant title matches as corrected results", () => {
		const { items, matchQuality, correctedLabel } = searchSketches(
			sketchFuse,
			sketches,
			"dopler",
		);
		expect(items.some((result) => result.uid === "doppler-effect")).toBe(true);
		expect(matchQuality).toBe("corrected");
		expect(correctedLabel).toBe("Doppler");
	});

	it("ranks a whole-word title match above substring matches", () => {
		const { items } = searchSketches(sketchFuse, sketches, "wind");
		// "wind" as a word in the title beats "wind" inside "windows"
		expect(items[0]?.uid).toBe("walk-in-the-wind");
		expect(items.some((result) => result.uid === "9-windows")).toBe(true);
	});

	it("does not treat a short query buried mid-word as a confident match", () => {
		// "iq" appears inside "etiquette" but not at a word boundary, so it must
		// not be a good match.
		const { matchQuality } = searchSketches(sketchFuse, sketches, "iq");
		expect(matchQuality).not.toBe("good");
	});

	it("matches spacing variants for McNamara", () => {
		for (const query of ["mc namara", "mcnamara", "Mc-Namara"]) {
			const { items } = searchSketches(sketchFuse, sketches, query);
			expect(items.some((result) => result.uid === "mcnamara-fallacy")).toBe(
				true,
			);
		}
	});

	it("returns full-text matches when all query words appear in a sketch", () => {
		const { items, matchQuality } = searchSketches(
			sketchFuse,
			sketches,
			"ambulance siren",
		);
		expect(matchQuality).toBe("good");
		expect(items.some((result) => result.uid === "doppler-effect")).toBe(true);
	});

	it("requires every query word to be present for a full-text match", () => {
		// "ambulance" is only in the Doppler body, "metrics" only in McNamara's,
		// so no single sketch contains both.
		const { matchQuality } = searchSketches(
			sketchFuse,
			sketches,
			"ambulance metrics",
		);
		expect(matchQuality).toBe("none");
	});

	it("finds full-text body matches by word stem (whale finds whale shark)", () => {
		const { items, matchQuality } = searchSketches(
			sketchFuse,
			sketches,
			"whale",
		);
		expect(matchQuality).toBe("good");
		expect(items.some((result) => result.uid === "bycatch")).toBe(true);
		// the incidental "while" fuzzy match must not surface
		expect(
			items.some((result) => result.uid === "turn-carrots-while-cutting"),
		).toBe(false);
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

	it("does not label genuine full-text matches as typo corrections", () => {
		const { matchQuality, correctedLabel } = searchSketches(
			sketchFuse,
			sketches,
			"whale",
		);

		expect(matchQuality).not.toBe("corrected");
		expect(correctedLabel).toBeUndefined();
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

describe("getCorrectedQueryLabel", () => {
	it("returns the corrected search term instead of the sketch title", () => {
		expect(
			getCorrectedQueryLabel(
				{
					title: "What's the difference between a dolphin and a porpoise",
					titleNormalized:
						"whats the difference between a dolphin and a porpoise",
				},
				"dolpin",
			),
		).toBe("dolphin");
	});
});

describe("isLikelyTypoCorrection", () => {
	it("accepts near-title matches", () => {
		expect(
			isLikelyTypoCorrection(
				{
					titleNormalized: "the doppler effect",
				},
				"dopler",
			),
		).toBe(true);
	});

	it("rejects vowel-swap matches to unrelated title words", () => {
		expect(
			isLikelyTypoCorrection(
				{
					titleNormalized: "turn carrots while cutting",
				},
				"whale",
			),
		).toBe(false);
	});
});

describe("categoryToTagResult", () => {
	it("includes sketch count when present on the category", () => {
		const result = categoryToTagResult({
			id: "c1",
			slug: "psychology",
			identifier: "Psychology",
			count: 42,
		});

		expect(result).toEqual({
			id: "c1",
			slugs: ["psychology"],
			data: { identifier: "Psychology", count: 42 },
		});
	});
});
