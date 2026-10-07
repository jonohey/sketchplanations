import { describe, expect, it } from "vitest";
import { allBookPageImages, stackBookPageImages } from "../../utils/bookImages.mjs";

describe("stackBookPageImages", () => {
	it("leaves out the table-of-contents photos", () => {
		const names = stackBookPageImages.map((image) => image.filename);
		expect(names.some((name) => name.includes("table-of-contents"))).toBe(false);
	});

	it("has no duplicates or gaps", () => {
		const names = stackBookPageImages.map((image) => image.filename);
		expect(new Set(names).size).toBe(names.length);
		expect(stackBookPageImages.every(Boolean)).toBe(true);
	});

	it("starts with the Coastline Paradox and includes every other spread", () => {
		expect(stackBookPageImages[0].conceptName).toBe("Coastline Paradox");
		expect(stackBookPageImages).toHaveLength(allBookPageImages.length - 2);
	});
});
