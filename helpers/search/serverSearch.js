import fs from "node:fs";
import path from "node:path";

import Fuse from "fuse.js";

import {
	categoryToTagResult,
	createCategoryFuse,
	createSketchFuse,
	searchCategories,
	searchSketches,
	sketchToGridResult,
} from "./fuseSearch.js";

let cachedIndex = null;
let sketchFuse = null;
let categoryFuse = null;

const loadSearchIndex = () => {
	if (cachedIndex) return cachedIndex;

	const filePath = path.join(process.cwd(), "data/search-index.json");
	cachedIndex = JSON.parse(fs.readFileSync(filePath, "utf8"));
	sketchFuse = createSketchFuse(Fuse, cachedIndex.sketches);
	categoryFuse = createCategoryFuse(Fuse, cachedIndex.categories);

	return cachedIndex;
};

export const searchSketchplanations = (query, { limit = 100 } = {}) => {
	const index = loadSearchIndex();

	const { items } = searchSketches(sketchFuse, index.sketches, query, { limit });

	return items.map(sketchToGridResult);
};

export const searchTags = (query, { limit = 20 } = {}) => {
	const index = loadSearchIndex();

	const { items } = searchCategories(categoryFuse, index.categories, query, {
		limit,
	});

	return items.map(categoryToTagResult);
};
