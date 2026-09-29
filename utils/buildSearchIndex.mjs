import fs from "node:fs";
import path from "node:path";

import {
	sortSketchplanationsByPublishedAtDesc,
	sortTagsByIdentifier,
} from "./fetchBuildCatalog.mjs";
import { sketchToIndexEntry, tagToIndexEntry } from "./searchIndexEntry.mjs";

export function searchIndexFromCatalog({ sketchplanations, tags }) {
	const orderedSketches = sortSketchplanationsByPublishedAtDesc(sketchplanations);

	const orderedTags = sortTagsByIdentifier(tags);

	const tagById = new Map(
		orderedTags.map((tag) => [
			tag.id,
			{
				identifier: tag.data.identifier,
				slug: tag.slugs[0],
			},
		]),
	);

	const sketches = orderedSketches.map((sketch) =>
		sketchToIndexEntry(sketch, tagById),
	);

	const categoryCounts = new Map();
	for (const sketch of orderedSketches) {
		for (const { tag } of sketch.data.tags ?? []) {
			if (tag?.id) {
				categoryCounts.set(tag.id, (categoryCounts.get(tag.id) ?? 0) + 1);
			}
		}
	}

	const categories = orderedTags.map((tag) => ({
		...tagToIndexEntry(tag),
		count: categoryCounts.get(tag.id) ?? 0,
	}));

	return { sketches, categories };
}

function buildSearchIndex(catalog) {
	console.time("[buildSearchIndex]");
	console.log("[buildSearchIndex] Starting...");

	const index = searchIndexFromCatalog(catalog);
	const filePath = path.join(process.cwd(), "data/search-index.json");

	fs.writeFileSync(filePath, JSON.stringify(index));

	console.log(
		`[buildSearchIndex] Wrote ${index.sketches.length} sketches and ${index.categories.length} categories`,
	);
	console.timeEnd("[buildSearchIndex]");
}

export default buildSearchIndex;
