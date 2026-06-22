/**
 * Generate local before/after summary and newsletter draft from merge plan.
 */
import fs from "node:fs";
import path from "node:path";

import { loadMergePlan } from "./merge-plan.mjs";
import { DATA_DIR, dateStamp } from "./paths.mjs";

const monthStamp = () => dateStamp().slice(0, 7);

export const runChangelog = async ({ stdoutNewsletter = false } = {}) => {
	const { rows } = loadMergePlan();
	const merges = rows.filter((r) => r.action === "merge");
	const completed = merges.filter(
		(r) => r.status === "migrated" || r.status === "published",
	);
	const pending = merges.filter((r) => r.status === "pending");

	const sketchesUpdated = completed.reduce(
		(sum, r) => sum + (Number.parseInt(r.sketch_count, 10) || 0),
		0,
	);

	const mergeTable = completed
		.map(
			(r) =>
				`| ${r.from_identifier || r.from_slug} | ${r.to_identifier || r.to_slug} | ${r.sketch_count || "—"} |`,
		)
		.join("\n");

	const fullDoc = `# Category cleanup record

Generated: ${new Date().toISOString()}

## Summary

- Merge pairs completed: ${completed.length}
- Merge pairs pending: ${pending.length}
- Sketches updated (from merge plan): ${sketchesUpdated}

## Merges

| Old category | New category | Sketches |
|--------------|--------------|----------|
${mergeTable || "| — | — | — |"}

## What improved

- Duplicate category names consolidated so related sketches appear together
- Browse and search paths are cleaner with fewer near-duplicate tags
- Category pages are stronger where sketch counts were split across duplicates

## Pending

${pending.length === 0 ? "None." : pending.map((r) => `- ${r.from_slug} → ${r.to_slug} (${r.status})`).join("\n")}
`;

	const examples = completed
		.slice(0, 5)
		.map((r) => `${r.from_identifier || r.from_slug} → ${r.to_identifier || r.to_slug}`)
		.join(", ");

	const newsletterDoc = `I've been tidying the categories on Sketchplanations so it's easier to browse related sketches. Duplicate and near-duplicate tags were splitting sketches that belong together — for example ${examples || "sport and sports"}.

**What changed:** ${completed.length} duplicate categor${completed.length === 1 ? "y was" : "ies were"} consolidated, touching about ${sketchesUpdated} sketch${sketchesUpdated === 1 ? "" : "es"}. You should find it easier to explore topics on the [categories page](https://sketchplanations.com/categories) and see more related sketches in one place.

If you have a favourite topic, it's worth a fresh look — some category pages are fuller than before.
`;

	if (!fs.existsSync(DATA_DIR)) {
		fs.mkdirSync(DATA_DIR, { recursive: true });
	}

	const stamp = monthStamp();
	const fullPath = path.resolve(DATA_DIR, `category-cleanup-${stamp}.md`);
	const newsletterPath = path.resolve(
		DATA_DIR,
		`category-cleanup-${stamp}-newsletter.md`,
	);

	fs.writeFileSync(fullPath, fullDoc);
	fs.writeFileSync(newsletterPath, newsletterDoc);

	console.log("\n[tag-cleanup] Changelog written\n");
	console.log(`  Full record:  ${fullPath}`);
	console.log(`  Newsletter:   ${newsletterPath}`);

	if (stdoutNewsletter) {
		console.log("\n--- Newsletter draft ---\n");
		console.log(newsletterDoc);
	}

	return { fullPath, newsletterPath };
};
