const NUMBER_WORDS = {
	0: "zero",
	1: "one",
	2: "two",
	3: "three",
	4: "four",
	5: "five",
	6: "six",
	7: "seven",
	8: "eight",
	9: "nine",
	10: "ten",
};

const WORD_NUMBERS = Object.fromEntries(
	Object.entries(NUMBER_WORDS).map(([digit, word]) => [word, digit]),
);

export const normalizeForSearch = (text) => {
	if (!text) return "";

	return String(text)
		.toLowerCase()
		.normalize("NFKD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[''`]/g, "")
		.replace(/[-–—_/]/g, " ")
		.replace(/[^\w\s]/g, " ")
		.replace(/\s+/g, " ")
		.trim();
};

const swapNumberWords = (text, map) =>
	text.replace(/\b(\d+|\w+)\b/g, (match) => map[match.toLowerCase()] ?? match);

export const expandQueryVariants = (query) => {
	if (!query) return [""];

	const variants = new Set([query, normalizeForSearch(query)]);

	const withoutApostrophes = query.replace(/[''`]/g, "");
	variants.add(withoutApostrophes);
	variants.add(normalizeForSearch(withoutApostrophes));

	const withDigitsAsWords = swapNumberWords(query, NUMBER_WORDS);
	const withWordsAsDigits = swapNumberWords(query, WORD_NUMBERS);

	for (const variant of [withDigitsAsWords, withWordsAsDigits]) {
		variants.add(variant);
		variants.add(normalizeForSearch(variant));
	}

	return [...variants].filter(Boolean);
};
