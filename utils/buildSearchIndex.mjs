import fs from "node:fs";
import path from "node:path";

import { client } from "../services/prismic.mjs";
import { sketchToIndexEntry, tagToIndexEntry } from "./searchIndexEntry.mjs";

async function buildSearchIndex() {
	console.time("[buildSearchIndex]");
	console.log("[buildSearchIndex] Starting...");

	const [sketchplanations, tags] = await Promise.all([
		client.getAllByType("sketchplanation", {
			fetch: [
				"sketchplanation.title",
				"sketchplanation.body",
				"sketchplanation.image",
				"sketchplanation.tags",
				"sketchplanation.published_at",
			],
			orderings: [
				{
					field: "my.sketchplanation.published_at",
					direction: "desc",
				},
			],
		}),
		client.getAllByType("tag", {
			orderings: [{ field: "my.tag.identifier" }],
		}),
	]);

	const tagById = new Map(
		tags.map((tag) => [
			tag.id,
			{
				identifier: tag.data.identifier,
				slug: tag.slugs[0],
			},
		]),
	);

	const sketches = sketchplanations.map((sketch) =>
		sketchToIndexEntry(sketch, tagById),
	);
	const categories = tags.map(tagToIndexEntry);

	const index = { sketches, categories };
	const filePath = path.join(process.cwd(), "data/search-index.json");

	fs.writeFileSync(filePath, JSON.stringify(index));

	console.log(
		`[buildSearchIndex] Wrote ${sketches.length} sketches and ${categories.length} categories`,
	);
	console.timeEnd("[buildSearchIndex]");
}

export default buildSearchIndex;
