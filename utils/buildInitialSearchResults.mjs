import fs from "node:fs";
import path from "node:path";

import { client } from "../services/prismic.mjs";

async function buildInitialSearchResults() {
	console.time("[buildInitialSearchResults]");
	console.log("[buildInitialSearchResults] Starting...");

	const results = await client.getAllByType("sketchplanation", {
		orderings: [
			{
				field: "my.sketchplanation.published_at",
				direction: "desc",
			},
		],
		limit: 20,
	});

	const filePath = path.join(process.cwd(), "data/initial-search-results.json");
	fs.writeFileSync(filePath, JSON.stringify(results));

	console.timeEnd("[buildInitialSearchResults]");
}

export default buildInitialSearchResults;
