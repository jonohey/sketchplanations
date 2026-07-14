export const BOOKS_SECTION_TITLE = "Using sketches in books";
export const BOOKS_SECTION_ID = "using-sketches-in-books";

export const isFaqQuestion = (block) => {
	if (block?.type !== "paragraph" || !block.text?.trim()) return false;

	const strongSpans = block.spans?.filter((span) => span.type === "strong") ?? [];
	if (strongSpans.length !== 1) return false;

	const [span] = strongSpans;
	return span.start === 0 && span.end === block.text.length;
};

export const splitLicenceFaqContent = (content) => {
	const booksIndex = content.findIndex(
		(block) =>
			isFaqQuestion(block) &&
			block.text.trim() === BOOKS_SECTION_TITLE,
	);

	if (booksIndex === -1) {
		return { faqContent: content, booksContent: [] };
	}

	let booksEnd = booksIndex + 1;
	while (booksEnd < content.length) {
		if (isFaqQuestion(content[booksEnd])) break;
		booksEnd += 1;
	}

	return {
		faqContent: [...content.slice(0, booksIndex), ...content.slice(booksEnd)],
		booksContent: content.slice(booksIndex + 1, booksEnd),
	};
};

export const getLicenceSections = ({ hasBooksSection = true } = {}) => {
	const sections = [
		{ id: "ai-adaptations", label: "AI adaptations" },
		{ id: "translations", label: "Translations" },
	];

	if (hasBooksSection) {
		sections.push({
			id: BOOKS_SECTION_ID,
			label: BOOKS_SECTION_TITLE,
		});
	}

	sections.push(
		{ id: "licence-faq", label: "Licence FAQ" },
		{
			id: "how-should-i-attribute-sketches",
			label: "How to attribute sketches",
		},
		{
			id: "do-you-have-an-image-consent-form-i-can-complete",
			label: "Image consent form",
		},
	);

	return sections;
};
