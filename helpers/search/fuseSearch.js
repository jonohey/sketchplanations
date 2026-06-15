import { stemmer } from "stemmer";

import { expandQueryVariants, normalizeForSearch } from "./normalize.js";

const FUSE_OPTIONS = {
	threshold: 0.3,
	minMatchCharLength: 2,
	ignoreLocation: true,
	includeScore: true,
	shouldSort: true,
};

// Fuse scores: 0 = perfect, 1 = no match. Lower is better.
export const GOOD_MATCH_SCORE = 0.5;
export const WEAK_MATCH_SCORE = 0.75;
export const WEAK_MATCH_LIMIT = 4;

const SKETCH_KEYS = [
	{ name: "title", weight: 0.4 },
	{ name: "categories", weight: 0.3 },
	{ name: "imageAlt", weight: 0.2 },
	{ name: "body", weight: 0.1 },
];

const CATEGORY_KEYS = [
	{ name: "identifier", weight: 0.7 },
	{ name: "slug", weight: 0.3 },
];

export const createSketchFuse = (Fuse, sketches) =>
	new Fuse(sketches, { ...FUSE_OPTIONS, keys: SKETCH_KEYS });

export const createCategoryFuse = (Fuse, categories) =>
	new Fuse(categories, { ...FUSE_OPTIONS, keys: CATEGORY_KEYS, threshold: 0.25 });

const isExactCategoryMatch = (category, normalizedQuery) =>
	category.identifierNormalized === normalizedQuery ||
	category.slugNormalized === normalizedQuery;

// Normalized titles are single-spaced with no punctuation, so padding with
// spaces lets us test for a whole-word/phrase match (e.g. "wind" in "walk in
// the wind") without also matching it inside "windows".
const containsWholeWord = (title, normalizedQuery) =>
	` ${title} `.includes(` ${normalizedQuery} `);

const titleMatchScore = (entry, normalizedQuery) => {
	const title = entry.titleNormalized;

	if (title === normalizedQuery) return 0;
	if (containsWholeWord(title, normalizedQuery)) return 0.03;
	if (title.startsWith(normalizedQuery)) return 0.06;
	if (title.includes(normalizedQuery)) return 0.1;

	return 1;
};

// Query variants can surface the same item more than once; keep the best
// (lowest) score per item id.
const dedupeByBestScore = (results) => {
	const byId = new Map();

	for (const result of results) {
		const existing = byId.get(result.item.id);

		if (!existing || result.score < existing.score) {
			byId.set(result.item.id, result);
		}
	}

	return [...byId.values()];
};

// Score given to literal (word-stem) matches. Comfortably inside the "good"
// band so genuine full-text hits beat Fuse's fuzzy stretch matches.
const LITERAL_MATCH_SCORE = 0.2;

// Queries up to this length are treated as "short". For them, fuzzy substring
// hits buried inside longer words (e.g. "iq" inside "etiquette") are usually
// noise, so we only trust matches that land at a word boundary.
const SHORT_QUERY_LENGTH = 3;

const wordTokens = (normalizedText) =>
	normalizedText ? normalizedText.split(" ").filter((token) => token.length >= 2) : [];

// Per-sketch word list + stem set for everything searchable. Walking the full
// body text is the expensive part, so it is memoized per loaded index.
const docIndexCache = new WeakMap();

const getDocIndex = (sketches) => {
	let docIndex = docIndexCache.get(sketches);

	if (!docIndex) {
		docIndex = new Map();

		for (const entry of sketches) {
			const words = wordTokens(
				[
					entry.titleNormalized ?? normalizeForSearch(entry.title),
					normalizeForSearch(entry.categories),
					normalizeForSearch(entry.imageAlt),
					normalizeForSearch(entry.body),
				].join(" "),
			);

			docIndex.set(entry.id, {
				words,
				stems: new Set(words.map((word) => stemmer(word))),
			});
		}

		docIndexCache.set(sketches, docIndex);
	}

	return docIndex;
};

// Mirrors Prismic full-text search: a sketch matches when every word in the
// query (reduced to its stem, so "whale" finds "whaling") appears somewhere in
// the sketch. Stemming keeps "whale" distinct from "while"/"whole".
const findLiteralMatches = (sketches, query) => {
	const queryStems = [...new Set(wordTokens(normalizeForSearch(query)).map(stemmer))];

	if (queryStems.length === 0) return [];

	const docIndex = getDocIndex(sketches);

	const matches = [];

	for (const entry of sketches) {
		const doc = docIndex.get(entry.id);

		if (doc && queryStems.every((stem) => doc.stems.has(stem))) {
			matches.push({ item: entry, score: LITERAL_MATCH_SCORE });
		}
	}

	return matches;
};

// A sketch is word-relevant when every query word lands at a word boundary:
// it matches a whole word (by stem) or is a prefix of one. This excludes
// mid-word substring hits like "iq" inside "etiquette".
const isWordRelevant = (entry, queryWords, docIndex) => {
	const doc = docIndex.get(entry.id);

	if (!doc) return false;

	return queryWords.every(
		(queryWord) =>
			doc.stems.has(stemmer(queryWord)) ||
			doc.words.some((word) => word.startsWith(queryWord)),
	);
};

const rankSketchResults = (results, query) => {
	const normalizedQuery = normalizeForSearch(query);

	return [...results].sort((a, b) => {
		const titleDelta = titleMatchScore(a.item, normalizedQuery) -
			titleMatchScore(b.item, normalizedQuery);

		if (titleDelta !== 0) return titleDelta;

		return (a.score ?? 1) - (b.score ?? 1);
	});
};

// result.wordMatch is set per search; only short queries can flip it to false,
// which demotes an otherwise-good score to a stretch (weak) match.
const isGoodMatch = (result) =>
	(result.score ?? 1) <= GOOD_MATCH_SCORE && result.wordMatch !== false;

const isEligibleFuseResult = (result) => (result.score ?? 1) <= WEAK_MATCH_SCORE;

const levenshteinDistance = (a, b) => {
	if (a === b) return 0;
	if (a.length === 0) return b.length;
	if (b.length === 0) return a.length;

	const row = Array.from({ length: b.length + 1 }, (_, index) => index);

	for (let i = 1; i <= a.length; i++) {
		let previous = i;

		for (let j = 1; j <= b.length; j++) {
			const value =
				a[i - 1] === b[j - 1]
					? row[j - 1]
					: Math.min(row[j - 1], row[j], previous) + 1;

			row[j - 1] = previous;
			previous = value;
		}

		row[b.length] = previous;
	}

	return row[b.length];
};

const maxTypoDistance = (word) => {
	if (word.length <= 4) return 1;
	if (word.length <= 8) return 2;
	return 3;
};

const TYPO_STOP_WORDS = new Set([
	"while",
	"through",
	"with",
	"from",
	"into",
	"over",
	"after",
	"before",
	"about",
	"other",
	"their",
	"there",
	"where",
	"which",
	"would",
	"could",
	"should",
	"have",
	"been",
	"being",
	"were",
	"when",
	"what",
	"that",
	"this",
	"than",
	"then",
	"them",
	"they",
	"will",
	"just",
	"like",
	"some",
	"such",
	"also",
	"only",
	"very",
	"well",
	"more",
	"most",
	"both",
	"each",
	"your",
	"the",
	"and",
	"for",
	"are",
	"but",
	"not",
	"you",
	"all",
	"can",
	"had",
	"her",
	"was",
	"one",
	"our",
	"out",
	"how",
	"its",
	"may",
	"new",
	"now",
	"old",
	"see",
	"way",
	"who",
	"did",
	"let",
	"put",
	"say",
	"she",
	"too",
	"use",
]);

const isVowel = (char) => "aeiou".includes(char);

const isSingleVowelSubstitution = (queryToken, titleToken) => {
	if (queryToken.length !== titleToken.length) return false;

	let mismatches = 0;
	let queryChar = null;
	let titleChar = null;

	for (let index = 0; index < queryToken.length; index++) {
		if (queryToken[index] === titleToken[index]) continue;

		mismatches++;
		queryChar = queryToken[index];
		titleChar = titleToken[index];
	}

	return (
		mismatches === 1 &&
		queryChar != null &&
		titleChar != null &&
		isVowel(queryChar) &&
		isVowel(titleChar)
	);
};

const isTypoTokenMatch = (queryToken, titleToken) => {
	if (TYPO_STOP_WORDS.has(titleToken)) return false;

	const distance = levenshteinDistance(queryToken, titleToken);
	if (distance > maxTypoDistance(queryToken)) return false;
	if (distance === 0) return true;

	if (
		distance === 1 &&
		queryToken.length >= 5 &&
		titleToken.length >= 5 &&
		isSingleVowelSubstitution(queryToken, titleToken)
	) {
		return false;
	}

	return true;
};

const queryTokens = (query) =>
	normalizeForSearch(query).split(" ").filter((token) => token.length >= 3);

export const isLikelyTypoCorrection = (entry, query) => {
	const normalizedQuery = normalizeForSearch(query);
	const title = entry.titleNormalized;

	if (title === normalizedQuery) return true;
	if (title.startsWith(normalizedQuery)) return true;
	if (normalizedQuery.length >= 3 && title.includes(normalizedQuery)) return true;

	const tokens = queryTokens(query);

	if (tokens.length === 0) return false;

	const titleTokens = title.split(" ").filter((token) => token.length >= 3);

	return tokens.every((queryToken) =>
		titleTokens.some((titleToken) => isTypoTokenMatch(queryToken, titleToken)),
	);
};

const titleWords = (title) =>
	String(title)
		.normalize("NFKD")
		.replace(/[\u0300-\u036f]/g, "")
		.match(/[\p{L}\p{N}]+(?:'[\p{L}\p{N}]+)*/gu) ?? [];

const originalWordForNormalizedToken = (title, normalizedToken) => {
	for (const word of titleWords(title)) {
		if (normalizeForSearch(word) === normalizedToken) {
			return word;
		}
	}

	return normalizedToken;
};

export const getCorrectedQueryLabel = (entry, query) => {
	const normalizedQuery = normalizeForSearch(query);
	const title = entry.titleNormalized;
	const trimmedQuery = query.trim();

	if (title === normalizedQuery || title.startsWith(normalizedQuery)) {
		return trimmedQuery;
	}

	const tokens = queryTokens(query);

	if (tokens.length === 0) {
		return trimmedQuery;
	}

	const titleTokens = title.split(" ").filter((token) => token.length >= 3);

	const correctedTokens = tokens.map((queryToken) => {
		let bestMatch = null;
		let bestDistance = Number.POSITIVE_INFINITY;

		for (const titleToken of titleTokens) {
			if (!isTypoTokenMatch(queryToken, titleToken)) continue;

			const distance = levenshteinDistance(queryToken, titleToken);

			if (distance < bestDistance) {
				bestDistance = distance;
				bestMatch = titleToken;
			}
		}

		if (bestMatch) {
			return originalWordForNormalizedToken(entry.title, bestMatch);
		}

		return originalWordForNormalizedToken(entry.title, queryToken);
	});

	return correctedTokens.join(" ");
};

const classifySketchResults = (scoredResults, query) => {
	const good = scoredResults.filter(isGoodMatch);
	// Stretch matches: eligible by score but not good (too weak, or a short
	// query that only hit mid-word).
	const weak = scoredResults.filter(
		(result) => isEligibleFuseResult(result) && !isGoodMatch(result),
	);

	if (good.length > 0) {
		return { items: good.map((result) => result.item), matchQuality: "good" };
	}

	if (weak.length > 0) {
		const items = weak.slice(0, WEAK_MATCH_LIMIT).map((result) => result.item);

		if (isLikelyTypoCorrection(weak[0].item, query)) {
			return {
				items,
				matchQuality: "corrected",
				correctedLabel: getCorrectedQueryLabel(weak[0].item, query),
			};
		}

		return { items, matchQuality: "weak" };
	}

	return { items: [], matchQuality: "none" };
};

export const searchSketches = (sketchFuse, sketches, query, { limit = 100 } = {}) => {
	if (!query?.trim()) {
		return { items: [], matchQuality: "none" };
	}

	const normalizedQuery = normalizeForSearch(query);
	const exactTitleMatches = sketches.filter(
		(entry) => entry.titleNormalized === normalizedQuery,
	);

	const literalMatches = findLiteralMatches(sketches, query);

	const variantResults = expandQueryVariants(query).flatMap((variant) =>
		sketchFuse.search(variant, { limit }),
	);
	const fuzzyMatches = dedupeByBestScore(variantResults).filter(
		isEligibleFuseResult,
	);

	// dedupeByBestScore keeps the lowest score per id, so exact title matches
	// (0) win over literal matches (0.2), which win over weaker fuzzy hits.
	const combined = dedupeByBestScore([
		...exactTitleMatches.map((item) => ({ item, score: 0 })),
		...literalMatches,
		...fuzzyMatches,
	]);
	const ranked = rankSketchResults(combined, query);

	// For short queries, demote fuzzy hits that don't land on a word boundary
	// (e.g. "iq" inside "etiquette") so they fall back to the stretch tier.
	const isShortQuery = normalizedQuery.length <= SHORT_QUERY_LENGTH;
	const queryWords = wordTokens(normalizedQuery);
	const docIndex = getDocIndex(sketches);

	const tagged = ranked.map((result) => ({
		...result,
		wordMatch: !isShortQuery || isWordRelevant(result.item, queryWords, docIndex),
	}));

	return classifySketchResults(tagged.slice(0, limit), query);
};

export const searchCategories = (categoryFuse, categories, query, { limit = 20 } = {}) => {
	if (!query?.trim()) {
		return { items: [], hasExactMatch: false };
	}

	const normalizedQuery = normalizeForSearch(query);
	const exactMatches = categories.filter((category) =>
		isExactCategoryMatch(category, normalizedQuery),
	);

	const variantResults = expandQueryVariants(query).flatMap((variant) =>
		categoryFuse.search(variant, { limit }),
	);

	const exactIds = new Set(exactMatches.map((category) => category.id));
	const fuzzyMatches = dedupeByBestScore(variantResults)
		.filter(isEligibleFuseResult)
		.map((result) => result.item)
		.filter((category) => !exactIds.has(category.id));

	return {
		items: [...exactMatches, ...fuzzyMatches].slice(0, limit),
		hasExactMatch: exactMatches.length > 0,
	};
};

export const categoryToTagResult = (category) => ({
	id: category.id,
	slugs: [category.slug],
	data: {
		identifier: category.identifier,
		count: category.count,
	},
});

export const sketchToGridResult = (entry) => ({
	id: entry.id,
	uid: entry.uid,
	data: {
		title: entry.title,
		image: entry.image,
	},
});
