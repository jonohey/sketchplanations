import { client } from "../services/prismic.mjs";

/**
 * Full sketch and tag documents for prebuild. Skipping Prismic `fetch` keeps
 * new CMS fields available to builders without another catalog change.
 * Body and image dominate payload size; extra scalars are cheap.
 *
 * Used by: search index, books index, RSS, sitemap, tooltips, KV, newer set,
 * and initial search results.
 */
export const RSS_ITEM_COUNT = 20;
export const INITIAL_SEARCH_RESULT_COUNT = 20;
export const OLDEST_SKETCHES_EXCLUDED_FROM_NEWER = 365;

export async function fetchBuildCatalog() {
	console.time("[fetchBuildCatalog]");
	console.log("[fetchBuildCatalog] Starting...");

	const [sketchplanations, tags] = await Promise.all([
		client.getAllByType("sketchplanation"),
		client.getAllByType("tag"),
	]);

	console.log(
		`[fetchBuildCatalog] Loaded ${sketchplanations.length} sketches and ${tags.length} tags`,
	);
	console.timeEnd("[fetchBuildCatalog]");

	return { sketchplanations, tags };
}

export function sortSketchplanationsByPublishedAtDesc(sketchplanations) {
	return [...sketchplanations].sort((a, b) =>
		String(b.data?.published_at ?? "").localeCompare(
			String(a.data?.published_at ?? ""),
		),
	);
}

export function sortDocsByLastPublicationDateAsc(docs) {
	return [...docs].sort((a, b) =>
		String(a.last_publication_date ?? "").localeCompare(
			String(b.last_publication_date ?? ""),
		),
	);
}

export function sortTagsByIdentifier(tags) {
	return [...tags].sort((a, b) =>
		String(a.data?.identifier ?? "").localeCompare(
			String(b.data?.identifier ?? ""),
		),
	);
}

export function newestSketchplanations(
	sketchplanations,
	count = INITIAL_SEARCH_RESULT_COUNT,
) {
	return sortSketchplanationsByPublishedAtDesc(sketchplanations).slice(0, count);
}

export function newerSketchplanationUids(
	sketchplanations,
	oldestCount = OLDEST_SKETCHES_EXCLUDED_FROM_NEWER,
) {
	const ordered = sortSketchplanationsByPublishedAtDesc(sketchplanations);
	if (ordered.length <= oldestCount) return [];
	return ordered.slice(0, -oldestCount).map(({ uid }) => uid);
}

export function sketchplanationUids(sketchplanations) {
	return sketchplanations.map(({ uid }) => uid);
}
