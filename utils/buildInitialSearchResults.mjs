import fs from "node:fs";
import path from "node:path";

import {
	INITIAL_SEARCH_RESULT_COUNT,
	newestSketchplanations,
} from "./fetchBuildCatalog.mjs";

export function initialSearchResultsFromCatalog({ sketchplanations }) {
	return newestSketchplanations(sketchplanations, INITIAL_SEARCH_RESULT_COUNT);
}

function buildInitialSearchResults(catalog) {
	console.time("[buildInitialSearchResults]");
	console.log("[buildInitialSearchResults] Starting...");

	const results = initialSearchResultsFromCatalog(catalog);
	const filePath = path.join(process.cwd(), "data/initial-search-results.json");
	fs.writeFileSync(filePath, JSON.stringify(results));

	console.timeEnd("[buildInitialSearchResults]");
}

export default buildInitialSearchResults;
