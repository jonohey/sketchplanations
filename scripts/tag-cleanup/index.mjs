#!/usr/bin/env node
/**
 * Prismic tag/category consolidation toolkit.
 *
 * Subcommands: audit | migrate | changelog | redirects
 * Run with --help on any subcommand for details.
 */
import { runAudit } from "./lib/audit.mjs";
import { runChangelog } from "./lib/changelog.mjs";
import { runMigrate } from "./lib/migrate.mjs";
import { runRedirects } from "./lib/redirects.mjs";
import { runSketchEdits } from "./lib/sketch-edits.mjs";
import { BATCH_ID as BATCH_12_ID, SKETCH_EDITS as BATCH_12_EDITS } from "./batch-12-edits.mjs";

const HELP = `Prismic tag/category consolidation toolkit

Usage:
  node scripts/tag-cleanup/index.mjs audit
  node scripts/tag-cleanup/index.mjs migrate [--dry-run] [--pair <from-slug>] [--limit N] [--batch-id N]
  node scripts/tag-cleanup/index.mjs migrate-edits [--dry-run] [--batch-id 12]
  node scripts/tag-cleanup/index.mjs changelog [--stdout newsletter]
  node scripts/tag-cleanup/index.mjs redirects

See scripts/tag-cleanup/README.md for the full workflow.
`;

const parseArgs = (argv) => {
	const args = { dryRun: false, pair: null, limit: 0, batchId: null, stdoutNewsletter: false };
	const positional = [];

	for (let i = 0; i < argv.length; i++) {
		const arg = argv[i];
		if (arg === "--dry-run") args.dryRun = true;
		else if (arg === "--pair") args.pair = argv[++i];
		else if (arg === "--limit") args.limit = Number.parseInt(argv[++i], 10) || 0;
		else if (arg === "--batch-id") args.batchId = argv[++i];
		else if (arg === "--stdout" && argv[i + 1] === "newsletter") {
			args.stdoutNewsletter = true;
			i++;
		} else if (arg === "--help" || arg === "-h") args.help = true;
		else if (!arg.startsWith("-")) positional.push(arg);
	}

	args.command = positional[0];
	return args;
};

const main = async () => {
	const args = parseArgs(process.argv.slice(2));

	if (args.help || !args.command) {
		console.log(HELP);
		process.exit(args.command ? 0 : 1);
	}

	try {
		switch (args.command) {
			case "audit":
				await runAudit();
				break;
			case "migrate":
				await runMigrate({
					dryRun: args.dryRun,
					pairSlug: args.pair,
					limit: args.limit,
					batchId: args.batchId,
				});
				break;
			case "migrate-edits":
				if (args.batchId && args.batchId !== BATCH_12_ID) {
					throw new Error(`No sketch edits defined for batch ${args.batchId}`);
				}
				await runSketchEdits({
					edits: BATCH_12_EDITS,
					batchId: BATCH_12_ID,
					dryRun: args.dryRun,
				});
				break;
			case "changelog":
				await runChangelog({ stdoutNewsletter: args.stdoutNewsletter });
				break;
			case "redirects":
				await runRedirects();
				break;
			default:
				console.error(`Unknown command: ${args.command}\n`);
				console.log(HELP);
				process.exit(1);
		}
	} catch (error) {
		console.error(`[tag-cleanup] Error: ${error.message}`);
		process.exit(1);
	}
};

main();
