/**
 * Read-only audit: fetch all tags and sketch tag assignments from Prismic.
 */
import fs from "node:fs";
import path from "node:path";

import { client } from "../../../services/prismic.mjs";
import { rowToCsv } from "./csv.mjs";
import { DATA_DIR, dateStamp } from "./paths.mjs";
import {
	PROTECTED_SLUGS,
	VAGUE_IDENTIFIERS,
	findIdentifierVariants,
	findSingularPluralPairs,
	getTagSlug,
	isBrokenTagLink,
	normalizeIdentifier,
	suggestMergeTarget,
} from "./tag-utils.mjs";

const AUDIT_CSV_HEADERS = [
	"tag_id",
	"identifier",
	"slug",
	"sketch_count",
	"sample_uids",
	"suggested_action",
	"merge_into_slug",
	"merge_into_id",
	"suggestion_reason",
	"notes",
];

const buildUsage = (sketchplanations) => {
	const countByTagId = new Map();
	const sketchesByTagId = new Map();

	for (const sketch of sketchplanations) {
		for (const { tag } of sketch.data?.tags ?? []) {
			if (!tag?.id) continue;
			countByTagId.set(tag.id, (countByTagId.get(tag.id) ?? 0) + 1);
			const uids = sketchesByTagId.get(tag.id) ?? [];
			uids.push(sketch.uid);
			sketchesByTagId.set(tag.id, uids);
		}
	}

	return { countByTagId, sketchesByTagId };
};

const classifyTag = (tag, sketchCount, mergePairs) => {
	const slug = getTagSlug(tag);
	const identifier = tag.data?.identifier ?? slug;

	if (PROTECTED_SLUGS.has(slug)) {
		return {
			suggested_action: "keep",
			merge_into_slug: "",
			merge_into_id: "",
			suggestion_reason: "homepage_carousel",
			notes: "Protected homepage carousel slug",
		};
	}

	if (sketchCount === 0) {
		return {
			suggested_action: "archive_candidate",
			merge_into_slug: "",
			merge_into_id: "",
			suggestion_reason: "zero_usage",
			notes: "No sketches reference this tag",
		};
	}

	if (VAGUE_IDENTIFIERS.has(normalizeIdentifier(identifier))) {
		return {
			suggested_action: "reassign",
			merge_into_slug: "",
			merge_into_id: "",
			suggestion_reason: "vague_identifier",
			notes: "Pick a specific target per sketch or tag in merge plan",
		};
	}

	const mergeSuggestion = suggestMergeTarget(tag, mergePairs);
	if (mergeSuggestion) {
		const winnerSlug = mergeSuggestion.merge_into_slug;
		if (PROTECTED_SLUGS.has(winnerSlug)) {
			return {
				suggested_action: "defer",
				merge_into_slug: "",
				merge_into_id: "",
				suggestion_reason: "protected_winner",
				notes: `Suggested merge into protected slug ${winnerSlug} — review manually`,
			};
		}
		return {
			...mergeSuggestion,
			notes: "",
		};
	}

	if (sketchCount <= 2) {
		return {
			suggested_action: "review",
			merge_into_slug: "",
			merge_into_id: "",
			suggestion_reason: "small_category",
			notes: `${sketchCount} sketch(s) — consider merging if duplicate exists`,
		};
	}

	return {
		suggested_action: "keep",
		merge_into_slug: "",
		merge_into_id: "",
		suggestion_reason: "",
		notes: "",
	};
};

export const runAudit = async () => {
	console.log("[tag-cleanup] Fetching tags and sketchplanations from Prismic…");

	const [tags, sketchplanations] = await Promise.all([
		client.getAllByType("tag", {
			orderings: [{ field: "my.tag.identifier" }],
		}),
		client.getAllByType("sketchplanation", {
			fetch: ["sketchplanation.tags", "sketchplanation.uid"],
		}),
	]);

	const { countByTagId, sketchesByTagId } = buildUsage(sketchplanations);

	const brokenTagLinks = [];
	for (const sketch of sketchplanations) {
		for (const { tag } of sketch.data?.tags ?? []) {
			if (!isBrokenTagLink(tag)) continue;
			brokenTagLinks.push({
				sketch_uid: sketch.uid,
				sketch_id: sketch.id,
				tag_id: tag?.id ?? "",
				tag_slug: tag?.slug ?? "",
				tag_type: tag?.type ?? "",
			});
		}
	}

	const singularPluralPairs = findSingularPluralPairs(tags);
	const identifierPairs = findIdentifierVariants(tags);
	const mergePairs = [...singularPluralPairs, ...identifierPairs];

	const tagRows = tags.map((tag) => {
		const slug = getTagSlug(tag);
		const sketchCount = countByTagId.get(tag.id) ?? 0;
		const sampleUids = (sketchesByTagId.get(tag.id) ?? [])
			.slice(0, 5)
			.join("; ");
		const classification = classifyTag(tag, sketchCount, mergePairs);

		return {
			tag_id: tag.id,
			identifier: tag.data?.identifier ?? "",
			slug,
			sketch_count: sketchCount,
			sample_uids: sampleUids,
			...classification,
		};
	});

	const suggestedMerges = tagRows.filter((r) => r.suggested_action === "merge");

	const snapshot = {
		generated_at: new Date().toISOString(),
		summary: {
			tag_count: tags.length,
			sketch_count: sketchplanations.length,
			broken_tag_link_count: brokenTagLinks.length,
			sketches_with_broken_tags: new Set(
				brokenTagLinks.map((row) => row.sketch_uid),
			).size,
			suggested_merge_count: suggestedMerges.length,
			archive_candidate_count: tagRows.filter(
				(r) => r.suggested_action === "archive_candidate",
			).length,
			protected_count: tagRows.filter(
				(r) => r.suggestion_reason === "homepage_carousel",
			).length,
		},
		broken_tag_links: brokenTagLinks,
		tags: tags.map((tag) => ({
			id: tag.id,
			identifier: tag.data?.identifier ?? "",
			uid: tag.uid,
			slug: getTagSlug(tag),
			last_publication_date: tag.last_publication_date,
		})),
		sketchplanations: sketchplanations.map((sketch) => ({
			id: sketch.id,
			uid: sketch.uid,
			tag_ids: (sketch.data?.tags ?? [])
				.map(({ tag }) => tag?.id)
				.filter(Boolean),
		})),
		audit_rows: tagRows,
		suggested_merge_pairs: suggestedMerges.map((row) => ({
			from_slug: row.slug,
			from_id: row.tag_id,
			to_slug: row.merge_into_slug,
			to_id: row.merge_into_id,
			sketch_count: row.sketch_count,
			reason: row.suggestion_reason,
		})),
	};

	if (!fs.existsSync(DATA_DIR)) {
		fs.mkdirSync(DATA_DIR, { recursive: true });
	}

	const stamp = dateStamp();
	const jsonPath = path.join(DATA_DIR, `tag-audit-${stamp}.json`);
	const csvPath = path.join(DATA_DIR, `tag-audit-${stamp}.csv`);

	fs.writeFileSync(jsonPath, JSON.stringify(snapshot, null, 2));

	const csvLines = [
		rowToCsv(AUDIT_CSV_HEADERS),
		...tagRows.map((row) =>
			rowToCsv(AUDIT_CSV_HEADERS.map((h) => row[h] ?? "")),
		),
	];
	fs.writeFileSync(csvPath, `${csvLines.join("\n")}\n`);

	console.log("\n[tag-cleanup] Audit complete\n");
	console.log(`  Tags:              ${snapshot.summary.tag_count}`);
	console.log(`  Sketches:          ${snapshot.summary.sketch_count}`);
	console.log(
		`  Broken tag links:  ${snapshot.summary.broken_tag_link_count} across ${snapshot.summary.sketches_with_broken_tags} sketch(es)`,
	);
	console.log(`  Suggested merges:  ${snapshot.summary.suggested_merge_count}`);
	console.log(`  Archive candidates: ${snapshot.summary.archive_candidate_count}`);
	console.log(`\n  JSON: ${jsonPath}`);
	console.log(`  CSV:  ${csvPath}`);

	if (brokenTagLinks.length > 0) {
		console.log(
			"\n  ⚠ Broken tag links (deleted/archived documents still linked on sketches):",
		);
		for (const row of brokenTagLinks) {
			console.log(
				`    ${row.sketch_uid} → tag id ${row.tag_id || "(none)"} (slug "${row.tag_slug || "-"}")`,
			);
		}
		console.log(
			"  Fix in the Prismic UI: remove or re-link the broken tag(s) on each sketch.",
		);
	}

	if (suggestedMerges.length > 0) {
		console.log("\n  Top suggested merges (review audit CSV before acting):");
		for (const row of suggestedMerges.slice(0, 15)) {
			console.log(
				`    ${row.slug} → ${row.merge_into_slug} (${row.sketch_count} sketches, ${row.suggestion_reason})`,
			);
		}
		if (suggestedMerges.length > 15) {
			console.log(`    … and ${suggestedMerges.length - 15} more in CSV`);
		}
	}

	return { jsonPath, csvPath, snapshot };
};
