/**
 * Load and save the committed tag-merge-plan.csv.
 */
import fs from "node:fs";

import { parseCsv, rowToCsv } from "./csv.mjs";
import { MERGE_PLAN_PATH } from "./paths.mjs";

export const MERGE_PLAN_HEADERS = [
	"action",
	"from_tag_id",
	"from_slug",
	"from_identifier",
	"to_tag_id",
	"to_slug",
	"to_identifier",
	"sketch_count",
	"status",
	"batch_id",
	"notes",
];

export const loadMergePlan = () => {
	if (!fs.existsSync(MERGE_PLAN_PATH)) {
		return { headers: MERGE_PLAN_HEADERS, rows: [] };
	}
	const content = fs.readFileSync(MERGE_PLAN_PATH, "utf8").trim();
	if (!content) {
		return { headers: MERGE_PLAN_HEADERS, rows: [] };
	}
	return parseCsv(content);
};

export const saveMergePlan = (rows) => {
	const lines = [
		rowToCsv(MERGE_PLAN_HEADERS),
		...rows.map((row) => rowToCsv(MERGE_PLAN_HEADERS.map((h) => row[h] ?? ""))),
	];
	fs.writeFileSync(MERGE_PLAN_PATH, `${lines.join("\n")}\n`);
};

export const getPendingMergeRows = (rows) =>
	rows.filter((r) => r.action === "merge" && r.status === "pending");

export const getPendingRemoveRows = (rows) =>
	rows.filter((r) => r.action === "remove" && r.status === "pending");

export const getPendingChangeRows = (rows) =>
	rows.filter(
		(r) =>
			(r.action === "merge" || r.action === "remove") && r.status === "pending",
	);

export const buildMergeMapFromPlan = (rows) => {
	const map = new Map();
	for (const row of rows) {
		if (row.action !== "merge" || !row.from_tag_id || !row.to_tag_id) continue;
		map.set(row.from_tag_id, row.to_tag_id);
	}
	return map;
};

export const buildRemoveSetFromPlan = (rows) => {
	const ids = new Set();
	for (const row of rows) {
		if (row.action === "remove" && row.from_tag_id) {
			ids.add(row.from_tag_id);
		}
	}
	return ids;
};
