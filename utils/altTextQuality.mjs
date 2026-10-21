const MIN_ALT_LENGTH = 40;
const GENERIC_ALT = /^(image|picture|photo|sketch|sketchplanation|drawing)s?$/i;

const normalize = (text) =>
	String(text ?? "")
		.toLowerCase()
		.replace(/\s+/g, " ")
		.trim();

/**
 * Why a sketch's alt text is weak, or null if it looks fine. Alt text is the
 * main way a text-only reader (screen reader, search engine, AI agent) "sees"
 * the drawing, so it should say more than the title does.
 */
export const weakAltReason = (alt, title) => {
	const text = normalize(alt);

	if (!text) return "missing";
	if (GENERIC_ALT.test(text)) return "generic";
	if (text === normalize(title)) return "same as title";
	if (text.length < MIN_ALT_LENGTH) return "short";

	return null;
};
