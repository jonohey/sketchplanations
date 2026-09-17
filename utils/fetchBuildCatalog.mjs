import { client } from "../services/prismic.mjs";

/**
 * Field union for every prebuild consumer of the sketch catalog.
 * Document metadata (id, uid, last_publication_date, slugs) is always included.
 *
 * Used by: search index, books index, RSS, sitemap, tooltips, KV, newer set,
 * and initial search results.
 */
export const BUILD_CATALOG_SKETCH_FIELDS = [
	"sketchplanation.title",
	"sketchplanation.body",
	"sketchplanation.image",
	"sketchplanation.tags",
	"sketchplanation.published_at",
];

export const RSS_ITEM_COUNT = 20;
export const INITIAL_SEARCH_RESULT_COUNT = 20;
export const OLDEST_SKETCHES_EXCLUDED_FROM_NEWER = 365;

export async function fetchBuildCatalog() {
	console.time("[fetchBuildCatalog]");
	console.log("[fetchBuildCatalog] Starting...");

	const [sketchplanations, tags] = await Promise.all([
		client.getAllByType("sketchplanation", {
			fetch: BUILD_CATALOG_SKETCH_FIELDS,
		}),
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
