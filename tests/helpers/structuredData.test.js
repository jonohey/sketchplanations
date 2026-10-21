import { describe, expect, it } from "vitest";

import {
	buildCategoryStructuredData,
	buildPerson,
	buildSiteGraph,
	buildSketchStructuredData,
	imageDimensionsForWidth,
} from "../../helpers/structuredData";

describe("imageDimensionsForWidth", () => {
	it("scales height to match a width-constrained derivative", () => {
		expect(
			imageDimensionsForWidth({ width: 2400, height: 1800 }, 1200),
		).toEqual({
			width: 1200,
			height: 900,
		});
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
			tags: [
				{
					tag: {
						id: "creativity-id",
						slug: "creativity",
						uid: "creativity",
						isBroken: false,
					},
				},
			],
		});

		expect(data["@graph"]).toHaveLength(3);
		expect(data["@graph"][0]["@type"]).toBe("ImageObject");
		expect(data["@graph"][0].contentUrl).toContain("&w=1200");
		expect(data["@graph"][0].width).toBe(1200);
		expect(data["@graph"][0].height).toBe(900);
		expect(data["@graph"][0].license).toContain("creativecommons.org");
		expect(data["@graph"][1]["@type"]).toEqual(["CreativeWork", "Article"]);
		expect(data["@graph"][1].headline).toBe(
			"The first draft is always perfect",
		);
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
				{
					tag: { id: "broken", type: "broken_type", slug: "-", isBroken: true },
				},
				{
					tag: { id: "games-id", slug: "games", uid: "games", isBroken: false },
				},
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

describe("dateModified", () => {
	const sketch = {
		uid: "first-draft",
		title: "The first draft",
		description: "Short.",
		publishedAt: "2024-01-01",
		image: {
			url: "https://images.prismic.io/sketchplanations/example.png?",
			alt: "Alt",
			dimensions: { width: 2400, height: 1800 },
		},
	};
	const creativeWork = (data) =>
		data["@graph"].find(({ "@type": type }) => Array.isArray(type));

	it("uses the last CMS publish date when it is later", () => {
		const data = buildSketchStructuredData({
			...sketch,
			modifiedAt: "2025-03-01T00:00:00+0000",
		});
		expect(creativeWork(data).dateModified).toBe("2025-03-01T00:00:00+0000");
	});

	it("falls back to the publish date when the CMS date is missing or earlier", () => {
		expect(creativeWork(buildSketchStructuredData(sketch)).dateModified).toBe(
			"2024-01-01",
		);
		expect(
			creativeWork(
				buildSketchStructuredData({
					...sketch,
					modifiedAt: "2023-01-01T00:00:00+0000",
				}),
			).dateModified,
		).toBe("2024-01-01");
	});
});

describe("buildCategoryStructuredData", () => {
	it("describes the category as a collection of its sketches", () => {
		const data = buildCategoryStructuredData({
			slug: "psychology",
			name: "psychology",
			description: "About psychology.",
			sketches: [
				{ uid: "a", data: { title: "A" } },
				{ uid: "b", data: { title: "B" } },
			],
		});
		const [collection, breadcrumbs] = data["@graph"];

		expect(collection["@type"]).toBe("CollectionPage");
		expect(collection.url).toBe(
			"https://sketchplanations.com/categories/psychology",
		);
		expect(collection.mainEntity.numberOfItems).toBe(2);
		expect(collection.mainEntity.itemListElement[1]).toEqual({
			"@type": "ListItem",
			position: 2,
			url: "https://sketchplanations.com/b",
			name: "B",
		});
		expect(breadcrumbs.itemListElement).toHaveLength(3);
	});

	it("caps the list but reports the full count", () => {
		const sketches = Array.from({ length: 150 }, (_, i) => ({
			uid: `s${i}`,
			data: { title: `S${i}` },
		}));
		const [collection] = buildCategoryStructuredData({
			slug: "x",
			name: "x",
			description: "",
			sketches,
		})["@graph"];

		expect(collection.mainEntity.numberOfItems).toBe(150);
		expect(collection.mainEntity.itemListElement).toHaveLength(100);
	});
});
