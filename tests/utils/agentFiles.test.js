import { describe, expect, it } from "vitest";

import { weakAltReason } from "../../utils/altTextQuality.mjs";
import {
	agentSketchesFromCatalog,
	llmsFullTxtFromCatalog,
	llmsTxtFromCatalog,
	sketchesJsonFromCatalog,
} from "../../utils/buildAgentFiles.mjs";
import { sketchImageUrl } from "../../utils/sketchImage.mjs";
import { buildCatalog } from "../fixtures/build-catalog.js";

describe("sketchImageUrl", () => {
	it("adds the width to a URL with or without a query", () => {
		expect(sketchImageUrl({ url: "https://x.test/a.png" })).toBe(
			"https://x.test/a.png?w=1200",
		);
		expect(sketchImageUrl({ url: "https://x.test/a.png?foo=1&bar=2" })).toBe(
			"https://x.test/a.png?foo=1&bar=2&w=1200",
		);
	});

	it("replaces an existing width and returns null without an image", () => {
		expect(sketchImageUrl({ url: "https://x.test/a.png?w=50" }, 800)).toBe(
			"https://x.test/a.png?w=800",
		);
		expect(sketchImageUrl(undefined)).toBeNull();
	});
});

describe("weakAltReason", () => {
	it("flags missing, generic, title-only and short alt text", () => {
		expect(weakAltReason("", "Title")).toBe("missing");
		expect(weakAltReason("  ", "Title")).toBe("missing");
		expect(weakAltReason("Sketch", "Title")).toBe("generic");
		expect(weakAltReason("the overview effect", "The Overview Effect")).toBe(
			"same as title",
		);
		expect(weakAltReason("A cat on a mat", "Cats")).toBe("short");
	});

	it("accepts a descriptive alt text", () => {
		expect(
			weakAltReason(
				"Two astronauts sit on the moon looking back at a distant Earth",
				"The Overview Effect",
			),
		).toBeNull();
	});
});

describe("agent files", () => {
	it("lists sketches newest first with their categories", () => {
		const sketches = agentSketchesFromCatalog(buildCatalog);

		expect(sketches.map(({ uid }) => uid)).toEqual([
			"newest-sketch",
			"middle-sketch",
			"edited-recently",
			"oldest-sketch",
		]);
		expect(sketches[1].categories.map(({ slug }) => slug)).toEqual([
			"science",
			"psychology",
		]);
		expect(sketches[0].imageUrl).toBe(
			"https://images.example.com/newest.png?w=1200",
		);
	});

	it("builds a compact JSON index with licence and category counts", () => {
		const index = sketchesJsonFromCatalog(buildCatalog);

		expect(index.licence.name).toBe("CC BY-NC 4.0");
		expect(index.categories).toEqual([
			expect.objectContaining({ slug: "psychology", count: 2 }),
			expect.objectContaining({ slug: "science", count: 2 }),
		]);
		expect(index.sketches[0]).toEqual({
			uid: "newest-sketch",
			url: "https://sketchplanations.com/newest-sketch",
			title: "Newest Sketch",
			summary: "A brand new explanation.",
			published: "2025-08-01",
			updated: "2025-01-01T00:00:00+0000",
			image: {
				url: "https://images.example.com/newest.png?w=1200",
				alt: "Newest",
			},
			categories: ["science"],
		});
	});

	it("writes llms.txt with the terms and latest sketches with image URLs", () => {
		const text = llmsTxtFromCatalog(buildCatalog);

		expect(text.startsWith("# Sketchplanations\n")).toBe(true);
		expect(text).toContain("CC BY-NC 4.0");
		expect(text).toContain(
			"- [Newest Sketch](https://sketchplanations.com/newest-sketch): image https://images.example.com/newest.png?w=1200",
		);
	});

	it("writes llms-full.txt with every sketch's text, credit and image", () => {
		const text = llmsFullTxtFromCatalog(buildCatalog);

		for (const { uid } of buildCatalog.sketchplanations) {
			expect(text).toContain(`URL: https://sketchplanations.com/${uid}`);
		}
		expect(text).toContain("An old idea about habits.");
		expect(text).toContain("Categories: science, psychology");
		expect(text).toContain(
			"Credit: Image: Jono Hey, Sketchplanations (https://sketchplanations.com/middle-sketch), CC BY-NC 4.0",
		);
	});
});
