import { expandQueryVariants, normalizeForSearch } from "./normalize.js";

const FUSE_OPTIONS = {
	threshold: 0.35,
	distance: 100,
	minMatchCharLength: 2,
	ignoreLocation: true,
	includeScore: true,
	shouldSort: true,
};

// Fuse scores: 0 = perfect, 1 = no match. Lower is better.
export const GOOD_MATCH_SCORE = 0.5;
export const WEAK_MATCH_SCORE = 0.85;
export const WEAK_MATCH_LIMIT = 4;

const SKETCH_KEYS = [
	{ name: "title", weight: 0.35 },
	{ name: "categories", weight: 0.25 },
	{ name: "tags", weight: 0.15 },
	{ name: "imageAlt", weight: 0.15 },
	{ name: "body", weight: 0.1 },
];

const CATEGORY_KEYS = [
	{ name: "identifier", weight: 0.7 },
	{ name: "slug", weight: 0.3 },
];

export const createSketchFuse = (Fuse, sketches) =>
	new Fuse(sketches, { ...FUSE_OPTIONS, keys: SKETCH_KEYS });

export const createCategoryFuse = (Fuse, categories) =>
	new Fuse(categories, { ...FUSE_OPTIONS, keys: CATEGORY_KEYS, threshold: 0.3 });

const isExactCategoryMatch = (category, normalizedQuery) =>
	category.identifierNormalized === normalizedQuery ||
	category.slugNormalized === normalizedQuery;

const titleMatchScore = (entry, normalizedQuery) => {
	const title = entry.titleNormalized;

	if (title === normalizedQuery) return 0;
	if (title.startsWith(normalizedQuery)) return 0.05;
	if (title.includes(normalizedQuery)) return 0.1;

	return 1;
};

const mergeSketchResults = (resultSets) => {
	const byId = new Map();

	for (const results of resultSets) {
		for (const result of results) {
			const existing = byId.get(result.item.id);

			if (!existing || result.score < existing.score) {
				byId.set(result.item.id, result);
			}
		}
	}

	return [...byId.values()];
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

const isGoodMatch = (result) => (result.score ?? 1) <= GOOD_MATCH_SCORE;

const isWeakMatch = (result) => {
	const score = result.score ?? 1;
	return score > GOOD_MATCH_SCORE && score <= WEAK_MATCH_SCORE;
};

const classifySketchResults = (scoredResults) => {
	const good = scoredResults.filter(isGoodMatch);
	const weak = scoredResults.filter(isWeakMatch);

	if (good.length > 0) {
		return { items: good.map((result) => result.item), matchQuality: "good" };
	}

	if (weak.length > 0) {
		return {
			items: weak.slice(0, WEAK_MATCH_LIMIT).map((result) => result.item),
			matchQuality: "weak",
		};
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

	const variantResults = expandQueryVariants(query).flatMap((variant) =>
		sketchFuse.search(variant, { limit }),
	);

	const merged = mergeSketchResults([variantResults]);
	const ranked = rankSketchResults(merged, query);

	const exactIds = new Set(exactTitleMatches.map((entry) => entry.id));
	const ordered = [
		...exactTitleMatches.map((item) => ({ item, score: 0 })),
		...ranked.filter((result) => !exactIds.has(result.item.id)),
	];

	return classifySketchResults(ordered.slice(0, limit));
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
	const fuzzyMatches = mergeSketchResults([variantResults])
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

export { FUSE_OPTIONS, SKETCH_KEYS, CATEGORY_KEYS };
