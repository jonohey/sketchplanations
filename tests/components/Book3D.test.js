import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const readFile = (path) =>
	readFileSync(new URL(`../../${path}`, import.meta.url), "utf8");

describe("Book3D", () => {
	it("has a small variant that loads lazily with a thumbnail-sized image", () => {
		const book = readFile("components/Book3D.js");

		expect(book).toMatch(/small = false/);
		expect(book).toMatch(/priority = !small/);
		expect(book).toMatch(/sizes=\{small \? "96px"/);
	});

	it("uses the 3D book for the promo card and the homepage book section", () => {
		expect(readFile("components/Cards.js")).toMatch(/<Book3D[^>]*\bsmall\b/);
		expect(readFile("pages/index.js")).toMatch(/<Book3D/);
	});

	it("keeps the cover margin reset specific enough to beat `.prose img`", () => {
		const css = readFile("components/Book3D.module.css");

		expect(css).toMatch(/\.front \.cover\s*\{[^}]*margin:\s*0/);
	});
});
