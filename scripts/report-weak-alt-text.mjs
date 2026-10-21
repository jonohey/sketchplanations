#!/usr/bin/env node
/**
 * Report sketches whose image alt text is missing or weak. Report only: it
 * never fails, so it is safe to run any time. Fix alt text in Prismic.
 *
 * Usage: pnpm report:alt-text [--limit=50]
 */
import { client } from "../services/prismic.mjs";
import { weakAltReason } from "../utils/altTextQuality.mjs";

const limitArg = process.argv.find((arg) => arg.startsWith("--limit="));
const limit = limitArg ? Number(limitArg.split("=")[1]) : 50;

const sketches = await client.getAllByType("sketchplanation", {
	fetch: ["sketchplanation.title", "sketchplanation.image"],
});

const byReason = new Map();
for (const sketch of sketches) {
	const reason = weakAltReason(sketch.data.image?.alt, sketch.data.title);
	if (!reason) continue;
	const list = byReason.get(reason) ?? [];
	list.push(sketch.uid);
	byReason.set(reason, list);
}

const total = [...byReason.values()].reduce(
	(sum, list) => sum + list.length,
	0,
);
console.log(
	`[report-weak-alt-text] ${total} of ${sketches.length} sketches have weak alt text`,
);

for (const [reason, uids] of byReason) {
	console.log(`\n${reason}: ${uids.length}`);
	for (const uid of uids.slice(0, limit)) {
		console.log(`  https://sketchplanations.com/${uid}`);
	}
	if (uids.length > limit) {
		console.log(
			`  …and ${uids.length - limit} more (use --limit=${uids.length})`,
		);
	}
}
