/**
 * Emit redirect snippets for completed merges (append to redirects.mjs manually).
 */
import fs from "node:fs";
import path from "node:path";

import { loadMergePlan } from "./merge-plan.mjs";
import { DATA_DIR, dateStamp } from "./paths.mjs";

export const runRedirects = async () => {
	const { rows } = loadMergePlan();
	const completed = rows.filter(
		(r) =>
			r.action === "merge" &&
			(r.status === "migrated" || r.status === "published") &&
			r.from_slug &&
			r.to_slug &&
			r.from_slug !== r.to_slug,
	);

	if (completed.length === 0) {
		console.log(
			"[tag-cleanup] No completed merges with distinct slugs. Nothing to generate.",
		);
		return;
	}

	const snippets = completed.map(
		(r) => `\t{
\t\tsource: "/categories/${r.from_slug}",
\t\tdestination: "/categories/${r.to_slug}",
\t\tpermanent: true,
\t},`,
	);

	const output = `// Category consolidation redirects — review and append to redirects.mjs
// Generated: ${new Date().toISOString()}

${snippets.join("\n\n")}
`;

	if (!fs.existsSync(DATA_DIR)) {
		fs.mkdirSync(DATA_DIR, { recursive: true });
	}

	const outPath = path.join(DATA_DIR, `tag-redirects-${dateStamp()}.mjs`);
	fs.writeFileSync(outPath, output);

	console.log(`\n[tag-cleanup] Redirect snippets written to:\n  ${path.resolve(outPath)}\n`);
	console.log("Review and append worthwhile entries to redirects.mjs\n");
	for (const r of completed) {
		console.log(`  /categories/${r.from_slug} → /categories/${r.to_slug}`);
	}

	return outPath;
};
