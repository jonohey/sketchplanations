import { describe, expect, it } from "vitest";
import {
	BOOKS_SECTION_ID,
	BOOKS_SECTION_TITLE,
	LICENCE_SECTIONS,
} from "../../utils/licenceContent.mjs";

describe("licenceContent", () => {
	it("includes the books section in the on-page nav", () => {
		expect(LICENCE_SECTIONS.some(({ id }) => id === BOOKS_SECTION_ID)).toBe(
			true,
		);
		expect(LICENCE_SECTIONS.some(({ label }) => label === BOOKS_SECTION_TITLE)).toBe(
			true,
		);
	});

	it("lists the main licence sections in order", () => {
		expect(LICENCE_SECTIONS.map(({ id }) => id)).toEqual([
			"using-sketches-in-books",
			"ai-adaptations",
			"translations",
			"licence-faq",
			"how-should-i-attribute-sketches",
		]);
	});
});
