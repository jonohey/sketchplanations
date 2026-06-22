/**
 * Apply approved merges from tag-merge-plan.csv via Prismic Migration API.
 */
import fs from "node:fs";
import path from "node:path";

import { client } from "../../../services/prismic.mjs";
import {
	buildMergeMapFromPlan,
	buildRemoveSetFromPlan,
	getPendingChangeRows,
	loadMergePlan,
	saveMergePlan,
} from "./merge-plan.mjs";
import { DATA_DIR } from "./paths.mjs";
import { createMigration, getWriteClient } from "./prismic-write.mjs";
import { applyTagChangesToSketchTags } from "./tag-utils.mjs";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchSketchesNeedingUpdate = async (mergeMap, removeIds, { pairSlug, limit }) => {
	const sketchplanations = await client.getAllByType("sketchplanation", {
		fetch: ["sketchplanation.tags", "sketchplanation.uid", "sketchplanation.title"],
	});

	const loserIds = new Set([...mergeMap.keys(), ...removeIds]);
	let candidates = sketchplanations.filter((sketch) =>
		(sketch.data?.tags ?? []).some(({ tag }) => loserIds.has(tag?.id)),
	);

	if (pairSlug) {
		const plan = loadMergePlan();
		const row = plan.rows.find(
			(r) => r.from_slug === pairSlug && (r.action === "merge" || r.action === "remove"),
		);
		if (!row) {
			throw new Error(`No merge plan row for from_slug="${pairSlug}"`);
		}
		candidates = candidates.filter((sketch) =>
			(sketch.data?.tags ?? []).some(({ tag }) => tag?.id === row.from_tag_id),
		);
	}

	if (limit > 0) {
		candidates = candidates.slice(0, limit);
	}

	return candidates;
};

const describeSketchChange = (sketch, mergeMap, removeIds) => {
	const before = (sketch.data?.tags ?? []).map(({ tag }) => tag?.id).filter(Boolean);
	const after = applyTagChangesToSketchTags(sketch.data?.tags, { mergeMap, removeIds }).map(
		({ tag }) => tag.id,
	);
	return { before, after, changed: before.join(",") !== after.join(",") };
};

export const runMigrate = async (options) => {
	const { dryRun, pairSlug, limit = 0, batchId } = options;
	const { rows } = loadMergePlan();
	const pendingRows = getPendingChangeRows(rows);
	const mergeMap = buildMergeMapFromPlan(rows);
	const removeIds = buildRemoveSetFromPlan(rows);

	if (mergeMap.size === 0 && removeIds.size === 0) {
		console.log(
			"[tag-cleanup] No pending changes in tag-merge-plan.csv (merge or remove, status=pending).",
		);
		return;
	}

	const effectiveLimit = limit > 0 ? limit : dryRun ? 9999 : 20;
	const sketches = await fetchSketchesNeedingUpdate(mergeMap, removeIds, {
		pairSlug,
		limit: effectiveLimit,
	});

	if (sketches.length === 0) {
		console.log("[tag-cleanup] No sketches need updating for current merge plan.");
		return;
	}

	console.log(
		`\n[tag-cleanup] ${dryRun ? "DRY RUN —" : ""} ${sketches.length} sketch(es) to update\n`,
	);

	for (const sketch of sketches) {
		const { before, after, changed } = describeSketchChange(sketch, mergeMap, removeIds);
		if (!changed) continue;
		console.log(`  ${sketch.uid}`);
		console.log(`    tags: ${before.join(", ")} → ${after.join(", ")}`);
	}

	if (dryRun) {
		console.log("\n[tag-cleanup] Dry run complete. No changes written.");
		return;
	}

	const writeClient = getWriteClient();
	const migration = createMigration();
	const logLines = [`uid,sketch_id,status,batch_id,timestamp`];

	for (const sketch of sketches) {
		const { changed } = describeSketchChange(sketch, mergeMap, removeIds);
		if (!changed) continue;

		const doc = await writeClient.getByUID("sketchplanation", sketch.uid);
		doc.data.tags = applyTagChangesToSketchTags(doc.data.tags, { mergeMap, removeIds });
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
		`tag-migrate-log-${new Date().toISOString().slice(0, 10)}.csv`,
	);
	fs.appendFileSync(logPath, `${logLines.join("\n")}\n`);

	const allSketches = await client.getAllByType("sketchplanation", {
		fetch: ["sketchplanation.tags"],
	});

	for (const row of rows) {
		if (row.status === "published") continue;
		if (row.action !== "merge" && row.action !== "remove") continue;
		const stillReferenced = allSketches.some((sketch) =>
			(sketch.data?.tags ?? []).some(({ tag }) => tag?.id === row.from_tag_id),
		);
		const wasInBatch = sketches.some((sketch) =>
			(sketch.data?.tags ?? []).some(({ tag }) => tag?.id === row.from_tag_id),
		);
		if (!wasInBatch) continue;
		if (batchId) row.batch_id = String(batchId);
		row.status = stillReferenced ? "pending" : "migrated";
	}
	saveMergePlan(rows);

	console.log(`\n[tag-cleanup] Migration submitted. Review Migration Release in Prismic and publish.`);
	console.log(`  Log: ${logPath}`);
};
