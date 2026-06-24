/**
 * Shared helpers for Prismic tag/category consolidation.
 */

/** Homepage carousel slugs — never use as merge losers. */
export const PROTECTED_SLUGS = new Set([
	"learning",
	"management",
	"writing",
	"software-development",
	"entrepreneurship",
	"product-management",
	"parenting",
	"data",
	"marketing",
	"design",
	"wellbeing",
	"psychology",
	"science",
	"productivity",
	"motivation",
	"geography",
]);

/** Low-value identifiers that need manual reassignment targets. */
export const VAGUE_IDENTIFIERS = new Set([
	"stuff",
	"general",
	"misc",
	"miscellaneous",
	"other",
	"various",
]);

export const normalizeIdentifier = (value) =>
	(value ?? "")
		.toLowerCase()
		.trim()
		.replace(/\s+/g, " ")
		.replace(/-/g, " ");

export const normalizeSlug = (value) =>
	(value ?? "").toLowerCase().trim().replace(/\s+/g, "-");

export const singularize = (word) => {
	if (word.endsWith("ies") && word.length > 4) {
		return `${word.slice(0, -3)}y`;
	}
	if (word.endsWith("ses") && word.length > 4) {
		return word.slice(0, -2);
	}
	if (word.endsWith("s") && !word.endsWith("ss") && word.length > 2) {
		return word.slice(0, -1);
	}
	return word;
};

export const getTagSlug = (tag) => tag.uid ?? tag.slugs?.[0] ?? "";

/**
 * Replace loser tag IDs with winners and dedupe by linked document id.
 */
export const applyMergeMapToSketchTags = (tags, mergeMapById) => {
	const seen = new Set();
	const result = [];

	for (const item of tags ?? []) {
		const tagId = item?.tag?.id;
		if (!tagId) continue;

		const canonicalId = mergeMapById.get(tagId) ?? tagId;
		if (seen.has(canonicalId)) continue;
		seen.add(canonicalId);

		result.push({
			...item,
			tag: {
				...item.tag,
				id: canonicalId,
				link_type: item.tag.link_type ?? "Document",
			},
		});
	}

	return result;
};

/** Apply merges then strip removed tag IDs (deduped). */
export const applyTagChangesToSketchTags = (tags, { mergeMap, removeIds }) => {
	const merged = applyMergeMapToSketchTags(tags, mergeMap);
	if (!removeIds?.size) return merged;
	return merged.filter((item) => !removeIds.has(item?.tag?.id));
};

/** Remove tag IDs and add new ones without duplicates. */
export const applySketchTagEdits = (tags, { removeIds = new Set(), addIds = [] }) => {
	const result = (tags ?? []).filter((item) => !removeIds.has(item?.tag?.id));
	const seen = new Set(result.map((item) => item?.tag?.id).filter(Boolean));

	for (const id of addIds) {
		if (!id || seen.has(id)) continue;
		seen.add(id);
		result.push({
			tag: {
				id,
				link_type: "Document",
			},
		});
	}

	return result;
};

/**
 * Find singular/plural slug pairs where both tags exist.
 */
export const findSingularPluralPairs = (tags) => {
	const bySlug = new Map(tags.map((t) => [normalizeSlug(getTagSlug(t)), t]));
	const pairs = [];
	const seen = new Set();

	for (const tag of tags) {
		const slug = normalizeSlug(getTagSlug(tag));
		const singular = singularize(slug);
		const plural = slug.endsWith("s") ? slug : `${slug}s`;

		for (const candidate of [singular, plural]) {
			if (candidate === slug) continue;
			const other = bySlug.get(candidate);
			if (!other) continue;

			const key = [tag.id, other.id].sort().join("|");
			if (seen.has(key)) continue;
			seen.add(key);

			const loser =
				slug.length < candidate.length || slug === singular ? tag : other;
			const winner = loser.id === tag.id ? other : tag;
			if (loser.id === winner.id) continue;

			pairs.push({ loser, winner, reason: "singular_plural" });
		}
	}

	return pairs;
};

/**
 * Tags sharing normalized identifier but different slugs (hyphen vs space, etc.).
 */
export const findIdentifierVariants = (tags) => {
	const byNorm = new Map();

	for (const tag of tags) {
		const norm = normalizeIdentifier(tag.data?.identifier ?? getTagSlug(tag));
		if (!norm) continue;
		const list = byNorm.get(norm) ?? [];
		list.push(tag);
		byNorm.set(norm, list);
	}

	const pairs = [];
	for (const group of byNorm.values()) {
		if (group.length < 2) continue;
		const sorted = [...group].sort(
			(a, b) => getTagSlug(a).length - getTagSlug(b).length,
		);
		const winner = sorted[0];
		for (const loser of sorted.slice(1)) {
			if (getTagSlug(loser) === getTagSlug(winner)) continue;
			pairs.push({ loser, winner, reason: "identifier_variant" });
		}
	}

	return pairs;
};

export const suggestMergeTarget = (tag, pairs) => {
	const asLoser = pairs.find((p) => p.loser.id === tag.id);
	if (asLoser) {
		return {
			suggested_action: "merge",
			merge_into_slug: getTagSlug(asLoser.winner),
			merge_into_id: asLoser.winner.id,
			suggestion_reason: asLoser.reason,
		};
	}
	return null;
};
