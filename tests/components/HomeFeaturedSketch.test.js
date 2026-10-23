import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const readFile = (path) =>
	readFileSync(new URL(`../../${path}`, import.meta.url), "utf8");

describe("HomeFeaturedSketch milestone callout", () => {
	it("only renders the callout when the sketch carries a milestone", () => {
		const component = readFile("components/HomeFeaturedSketch.js");

		expect(component).toMatch(/\{sketch\.milestone && \(/);
	});

	it("only flags the 1,000th sketch while it is the latest sketch", () => {
		const page = readFile("pages/index.js");

		expect(page).toMatch(
			/isSketch1000 = recent\.results\[0\]\?\.uid === SKETCH_1000_UID/,
		);
		expect(page).toMatch(/\.\.\.\(isSketch1000 && \{ milestone: "1,000" \}\)/);
	});

	it("only flashes the rays when the visitor allows motion", () => {
		const css = readFile("components/HomeFeaturedSketch.module.css");

		expect(css).toMatch(
			/@media \(prefers-reduced-motion: no-preference\)\s*\{\s*\.milestoneRays\s*\{[^}]*animation:\s*flash/,
		);
	});
});
