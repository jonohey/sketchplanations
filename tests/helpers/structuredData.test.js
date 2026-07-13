import { describe, expect, it } from "vitest";
import {
	buildPerson,
	buildSiteGraph,
	buildSketchStructuredData,
	imageDimensionsForWidth,
} from "../../helpers/structuredData";

describe("imageDimensionsForWidth", () => {
	it("scales height to match a width-constrained derivative", () => {
		expect(imageDimensionsForWidth({ width: 2400, height: 1800 }, 1200)).toEqual(
			{
				width: 1200,
				height: 900,
			},
		);
	});

	it("does not upscale beyond the original width", () => {
		expect(imageDimensionsForWidth({ width: 800, height: 600 }, 1200)).toEqual({
			width: 800,
			height: 600,
		});
	});
});

describe("buildSketchStructuredData", () => {
	const baseSketch = {
		uid: "first-draft",
		title: "The first draft is always perfect",
		description: "A short description of the sketch.",
		publishedAt: "2024-01-01",
		image: {
			url: "https://images.prismic.io/sketchplanations/example.png?",
			alt: "Sketch alt text",
			dimensions: { width: 2400, height: 1800 },
		},
	};

	it("includes ImageObject, CreativeWork, and BreadcrumbList", () => {
		const data = buildSketchStructuredData({
			...baseSketch,
			tags: [{ tag: { id: "creativity-id", slug: "creativity", uid: "creativity", isBroken: false } }],
		});

		expect(data["@graph"]).toHaveLength(3);
		expect(data["@graph"][0]["@type"]).toBe("ImageObject");
		expect(data["@graph"][0].contentUrl).toContain("&w=1200");
		expect(data["@graph"][0].width).toBe(1200);
		expect(data["@graph"][0].height).toBe(900);
		expect(data["@graph"][0].license).toContain("creativecommons.org");
		expect(data["@graph"][1]["@type"]).toEqual(["CreativeWork", "Article"]);
		expect(data["@graph"][1].headline).toBe("The first draft is always perfect");
		expect(data["@graph"][2]["@type"]).toBe("BreadcrumbList");
		expect(data["@graph"][2].itemListElement).toHaveLength(3);
		expect(data["@graph"][2].itemListElement[1]).toMatchObject({
			name: "creativity",
			item: "https://sketchplanations.com/categories/creativity",
		});
	});

	it("skips broken Prismic tags in breadcrumbs and keywords", () => {
		const data = buildSketchStructuredData({
			...baseSketch,
			uid: "how-to-play-reverse-pool",
			title: "How to play reverse pool",
			tags: [
				{
					tag: {
						id: "broken",
						type: "broken_type",
						slug: "-",
						isBroken: true,
					},
				},
			],
		});

		const creativeWork = data["@graph"][1];
		const breadcrumbs = data["@graph"][2].itemListElement;

		expect(creativeWork.keywords).toBeUndefined();
		expect(creativeWork.about).toBeUndefined();
		expect(breadcrumbs).toHaveLength(2);
		expect(breadcrumbs[1]).toMatchObject({
			name: "How to play reverse pool",
			item: "https://sketchplanations.com/how-to-play-reverse-pool",
		});
		expect(JSON.stringify(breadcrumbs)).not.toContain("/categories/-");
	});

	it("uses the first valid tag when an earlier tag is broken", () => {
		const data = buildSketchStructuredData({
			...baseSketch,
			tags: [
				{ tag: { id: "broken", type: "broken_type", slug: "-", isBroken: true } },
				{ tag: { id: "games-id", slug: "games", uid: "games", isBroken: false } },
			],
		});

		expect(data["@graph"][2].itemListElement[1]).toMatchObject({
			name: "games",
			item: "https://sketchplanations.com/categories/games",
		});
		expect(data["@graph"][1].keywords).toBe("games");
	});
});

describe("buildSiteGraph", () => {
	it("includes Organization and WebSite with SearchAction", () => {
		const data = buildSiteGraph();
		expect(data["@graph"][0]["@type"]).toBe("Organization");
		expect(data["@graph"][1]["@type"]).toBe("WebSite");
		expect(data["@graph"][1].potentialAction["@type"]).toBe("SearchAction");
	});
});

describe("buildPerson", () => {
	it("includes LinkedIn in sameAs", () => {
		const person = buildPerson();
		expect(person.sameAs).toEqual(["https://uk.linkedin.com/in/jonohey"]);
	});
});
