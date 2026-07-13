#!/usr/bin/env node
/**
 * Fail if any sketchplanation still links to a deleted/empty Prismic tag.
 * Used in CI and the finish-PR checklist.
 */
import { client } from "../services/prismic.mjs";
import { isBrokenTagLink } from "./tag-cleanup/lib/tag-utils.mjs";

const sketches = await client.getAllByType("sketchplanation", {
	fetch: ["sketchplanation.tags"],
});

const broken = [];
for (const sketch of sketches) {
	for (const { tag } of sketch.data?.tags ?? []) {
		if (!isBrokenTagLink(tag)) continue;
		broken.push({
			uid: sketch.uid,
			tagId: tag?.id || "(empty)",
		});
	}
}

if (broken.length === 0) {
	console.log("[check-broken-tags] No broken tag links found.");
	process.exit(0);
}

const bySketch = new Map();
for (const row of broken) {
	const list = bySketch.get(row.uid) ?? [];
	list.push(row.tagId);
	bySketch.set(row.uid, list);
}

console.error(
	`[check-broken-tags] ${broken.length} broken tag link(s) across ${bySketch.size} sketch(es):`,
);
for (const [uid, tagIds] of bySketch) {
	console.error(`  - ${uid}: ${tagIds.join(", ")}`);
}
console.error(
	"Fix in Prismic, or run: npm run tag-cleanup:fix-broken-tags -- --dry-run",
);
process.exit(1);
