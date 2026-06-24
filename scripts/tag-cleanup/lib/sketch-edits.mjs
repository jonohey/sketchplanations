/**
 * Apply per-sketch tag add/remove edits via Prismic Migration API.
 */
import fs from "node:fs";
import path from "node:path";

import { client } from "../../../services/prismic.mjs";
import { DATA_DIR } from "./paths.mjs";
import { createMigration, getWriteClient } from "./prismic-write.mjs";
import { applySketchTagEdits, getTagSlug } from "./tag-utils.mjs";

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

const describeEdit = (sketch, edit, tagIdsBySlug) => {
	const removeIds = new Set(
		edit.removeSlugs.map((slug) => tagIdsBySlug.get(slug)),
	);
	const addIds = edit.addSlugs.map((slug) => tagIdsBySlug.get(slug));
	const before = (sketch.data?.tags ?? []).map(({ tag }) => tag?.id).filter(Boolean);
	const after = applySketchTagEdits(sketch.data?.tags, { removeIds, addIds }).map(
		({ tag }) => tag.id,
	);
	return {
		removeIds,
		addIds,
		before,
		after,
		changed: before.join(",") !== after.join(","),
	};
};

export const runSketchEdits = async ({ edits, batchId, dryRun }) => {
	const slugs = [
		...new Set(edits.flatMap((edit) => [...edit.removeSlugs, ...edit.addSlugs])),
	];
	const tagIdsBySlug = await resolveTagIdsBySlug(slugs);

	const sketches = [];
	for (const edit of edits) {
		const sketch = await client.getByUID("sketchplanation", edit.uid);
		const description = describeEdit(sketch, edit, tagIdsBySlug);
		if (!description.changed) continue;
		sketches.push({ sketch, edit, ...description });
	}

	if (sketches.length === 0) {
		console.log("[tag-cleanup] No sketches need per-sketch tag edits.");
		return;
	}

	console.log(
		`\n[tag-cleanup] ${dryRun ? "DRY RUN —" : ""} ${sketches.length} sketch edit(s)\n`,
	);

	for (const { sketch, edit, before, after } of sketches) {
		console.log(`  ${sketch.uid}`);
		if (edit.notes) console.log(`    ${edit.notes}`);
		console.log(`    tags: ${before.join(", ")} → ${after.join(", ")}`);
	}

	if (dryRun) {
		console.log("\n[tag-cleanup] Dry run complete. No changes written.");
		return;
	}

	const writeClient = getWriteClient();
	const migration = createMigration();
	const logLines = [`uid,sketch_id,status,batch_id,timestamp`];

	for (const { sketch, removeIds, addIds } of sketches) {
		const doc = await writeClient.getByUID("sketchplanation", sketch.uid);
		doc.data.tags = applySketchTagEdits(doc.data.tags, { removeIds, addIds });
		migration.updateDocument(doc);
		logLines.push(
			`${sketch.uid},${sketch.id},queued,${batchId ?? ""},${new Date().toISOString()}`,
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
		`tag-sketch-edits-log-${new Date().toISOString().slice(0, 10)}.csv`,
	);
	fs.appendFileSync(logPath, `${logLines.join("\n")}\n`);

	console.log(`\n[tag-cleanup] Sketch edits submitted. Review Migration Release in Prismic and publish.`);
	console.log(`  Log: ${logPath}`);
};
