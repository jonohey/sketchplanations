import fs from "node:fs";
import path from "node:path";

import {
	sortSketchplanationsByPublishedAtDesc,
	sortTagsByIdentifier,
} from "./fetchBuildCatalog.mjs";

export function categoryNavFromCatalog({ sketchplanations, tags }) {
	const orderedSketches =
		sortSketchplanationsByPublishedAtDesc(sketchplanations);
	const orderedTags = sortTagsByIdentifier(tags);

	const slugByTagId = new Map();
	const categories = {};

	for (const tag of orderedTags) {
		const slug = (tag.uid || tag.slugs?.[0] || "").trim();
		if (!slug || slug === "-") continue;
		slugByTagId.set(tag.id, slug);
		categories[slug] = [];
	}

	for (const sketch of orderedSketches) {
		if (!sketch.uid) continue;
		const seenSlugs = new Set();

		for (const entry of sketch.data?.tags ?? []) {
			const slug = slugByTagId.get(entry?.tag?.id);
			if (!slug || seenSlugs.has(slug)) continue;
			seenSlugs.add(slug);
			categories[slug].push(sketch.uid);
		}
	}

	const recentUids = orderedSketches.map(({ uid }) => uid).filter(Boolean);

	return { categories, recentUids };
}

function buildCategoryNav(catalog) {
	console.time("[buildCategoryNav]");
	console.log("[buildCategoryNav] Starting...");

	const categoryNav = categoryNavFromCatalog(catalog);
	const filePath = path.join(process.cwd(), "data/category-nav.json");
	fs.writeFileSync(filePath, JSON.stringify(categoryNav));

	console.log(
		`[buildCategoryNav] Wrote ${Object.keys(categoryNav.categories).length} categories (${categoryNav.recentUids.length} sketches)`,
	);
	console.timeEnd("[buildCategoryNav]");
}

export default buildCategoryNav;
