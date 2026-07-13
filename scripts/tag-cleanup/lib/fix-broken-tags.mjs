/**
 * Strip orphaned Prismic tag links from sketches, optionally adding replacements.
 */
import fs from "node:fs";
import path from "node:path";

import { client } from "../../../services/prismic.mjs";
import { BROKEN_TAG_REPAIRS } from "../broken-tag-repairs.mjs";
import { DATA_DIR } from "./paths.mjs";
import { createMigration, getWriteClient } from "./prismic-write.mjs";
import {
	applySketchTagEdits,
	getTagSlug,
	isBrokenTagLink,
} from "./tag-utils.mjs";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const resolveTagIdsBySlug = async (slugs) => {
	const tags = await client.getAllByType("tag");
	const bySlug = new Map(tags.map((tag) => [getTagSlug(tag), tag.id]));
	const missing = slugs.filter((slug) => !bySlug.has(slug));
	if (missing.length > 0) {
		throw new Error(`Unknown tag slug(s): ${missing.join(", ")}`);
	}
	return bySlug;
};

const describeTags = (tags, idToSlug = new Map()) =>
	(tags ?? [])
		.map(({ tag }) => {
			if (isBrokenTagLink(tag)) {
				return `BROKEN:${tag?.id || "(empty)"}`;
			}
			return getTagSlug(tag) || idToSlug.get(tag?.id) || tag?.id || "?";
		})
		.join(", ");

export const runFixBrokenTags = async ({
	dryRun,
	repairs = BROKEN_TAG_REPAIRS,
} = {}) => {
	const repairByUid = new Map(repairs.map((repair) => [repair.uid, repair]));
	const addSlugs = [
		...new Set(repairs.flatMap((repair) => repair.addSlugs ?? [])),
	];
	const tagIdsBySlug =
		addSlugs.length > 0 ? await resolveTagIdsBySlug(addSlugs) : new Map();
	const idToSlug = new Map(
		[...tagIdsBySlug.entries()].map(([slug, id]) => [id, slug]),
	);

	console.log("[tag-cleanup] Fetching sketchplanations…");
	const sketches = await client.getAllByType("sketchplanation", {
		fetch: ["sketchplanation.tags"],
	});

	const updates = [];
	for (const sketch of sketches) {
		const repair = repairByUid.get(sketch.uid);
		const hasBroken = (sketch.data?.tags ?? []).some(({ tag }) =>
			isBrokenTagLink(tag),
		);
		if (!hasBroken && !repair) continue;

		const addIds = (repair?.addSlugs ?? []).map((slug) =>
			tagIdsBySlug.get(slug),
		);
		const nextTags = applySketchTagEdits(sketch.data?.tags, { addIds });
		const before = describeTags(sketch.data?.tags, idToSlug);
		const after = describeTags(nextTags, idToSlug);
		if (before === after) continue;

		updates.push({
			sketch,
			repair,
			nextTags,
			before,
			after,
		});
	}

	if (updates.length === 0) {
		console.log("[tag-cleanup] No broken tag links (or pending repairs) found.");
		return { updates: [] };
	}

	console.log(
		`\n[tag-cleanup] ${dryRun ? "DRY RUN —" : ""} ${updates.length} sketch(es) to update\n`,
	);
	for (const { sketch, repair, before, after } of updates) {
		console.log(`  ${sketch.uid}`);
		if (repair?.notes) console.log(`    ${repair.notes}`);
		console.log(`    tags: ${before}`);
		console.log(`       → ${after}`);
	}

	if (dryRun) {
		console.log("\n[tag-cleanup] Dry run complete. No changes written.");
		return { updates };
	}

	const writeClient = getWriteClient();
	const migration = createMigration();
	const logLines = ["uid,sketch_id,status,timestamp"];

	for (const { sketch, nextTags } of updates) {
		const doc = await writeClient.getByUID("sketchplanation", sketch.uid);
		doc.data.tags = nextTags;
		migration.updateDocument(doc);
		logLines.push(
			`${sketch.uid},${sketch.id},queued,${new Date().toISOString()}`,
		);
		await sleep(1100);
	}

	await writeClient.migrate(migration, {
		reporter: (event) => {
			if (event.type === "start" || event.type === "end") {
				console.log(`[migration] ${event.type}: ${event.data?.title ?? ""}`);
			}
		},
	});

	if (!fs.existsSync(DATA_DIR)) {
		fs.mkdirSync(DATA_DIR, { recursive: true });
	}
	const logPath = path.join(
		DATA_DIR,
		`tag-fix-broken-log-${new Date().toISOString().slice(0, 10)}.csv`,
	);
	fs.appendFileSync(logPath, `${logLines.join("\n")}\n`);

	console.log(
		"\n[tag-cleanup] Broken-tag fixes submitted. Review Migration Release in Prismic and publish.",
	);
	console.log(`  Log: ${logPath}`);

	return { updates, logPath };
};
