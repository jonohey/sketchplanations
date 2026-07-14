const HEADING_ID_OVERRIDES = {
	"AI Adaptations": "ai-adaptations",
	Translations: "translations",
	"Licence FAQ": "licence-faq",
	"Using sketches in books": "using-sketches-in-books",
};

export const slugifyHeading = (text) => {
	const normalized = text.trim().replace(/\s+/g, " ");

	if (HEADING_ID_OVERRIDES[normalized]) {
		return HEADING_ID_OVERRIDES[normalized];
	}

	return normalized
		.toLowerCase()
		.replace(/['']/g, "")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
};

export { HEADING_ID_OVERRIDES };
