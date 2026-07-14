import { describe, expect, it } from "vitest";
import { slugifyHeading } from "../../helpers/slugifyHeading";
import {
	BOOKS_SECTION_TITLE,
	isFaqQuestion,
	splitLicenceFaqContent,
} from "../../utils/licenceContent.mjs";

describe("slugifyHeading", () => {
	it("uses stable ids for known licence sections", () => {
		expect(slugifyHeading("AI Adaptations")).toBe("ai-adaptations");
		expect(slugifyHeading("Using sketches in books")).toBe(
			"using-sketches-in-books",
		);
	});

	it("slugifies unknown headings", () => {
		expect(slugifyHeading("Can I sell them?")).toBe("can-i-sell-them");
	});
});

describe("licenceContent", () => {
	const faqQuestion = (text) => ({
		type: "paragraph",
		text,
		spans: [{ start: 0, end: text.length, type: "strong" }],
	});

	const paragraph = (text) => ({
		type: "paragraph",
		text,
		spans: [],
	});

	it("detects bold FAQ questions", () => {
		expect(isFaqQuestion(faqQuestion("Can I sell them?"))).toBe(true);
		expect(isFaqQuestion(paragraph("Can I sell them?"))).toBe(false);
	});

	it("extracts the books section from the licence FAQ", () => {
		const content = [
			{ type: "heading2", text: "Licence FAQ", spans: [] },
			faqQuestion("Can I use them in my article?"),
			paragraph("Yes."),
			faqQuestion(BOOKS_SECTION_TITLE),
			paragraph("Yes—sketches can be used in books."),
			paragraph("For independent authors, I licence images at $65 per image."),
			faqQuestion("Can I sell them?"),
			paragraph("No, not without permission."),
		];

		const { faqContent, booksContent } = splitLicenceFaqContent(content);

		expect(booksContent.map((block) => block.text)).toEqual([
			"Yes—sketches can be used in books.",
			"For independent authors, I licence images at $65 per image.",
		]);
		expect(faqContent.some((block) => block.text === BOOKS_SECTION_TITLE)).toBe(
			false,
		);
		expect(faqContent.some((block) => block.text === "Can I sell them?")).toBe(
			true,
		);
	});
});
