# Tag category cleanup toolkit

Prismic tag/category consolidation: audit duplicate tags, approve a merge plan, migrate sketch links in batches, then generate redirects and a local summary for your newsletter.

**Start here.** All commands run from the repo root.

## Prerequisites

- Node.js (repo uses ^24)
- Read-only audit: no extra setup (uses [`services/prismic.mjs`](../../services/prismic.mjs))
- Migrate: permanent write token in `.env`:

  ```
  PRISMIC_WRITE_TOKEN=your_token
  ```

  Create in Prismic → Settings → API & Security. Never commit `.env`.

## Commands

```bash
npm run tag-cleanup:audit
npm run tag-cleanup:fix-broken-tags -- --dry-run
npm run tag-cleanup:fix-broken-tags
npm run tag-cleanup:migrate -- --dry-run
npm run tag-cleanup:migrate -- --pair sport --limit 20 --batch-id 1
npm run tag-cleanup:migrate-edits -- --dry-run --batch-id 12
npm run tag-cleanup:changelog
npm run tag-cleanup:changelog -- --stdout newsletter
npm run tag-cleanup:redirects
```

Or directly:

```bash
node scripts/tag-cleanup/index.mjs audit
```

## Workflow

1. **Audit** — `npm run tag-cleanup:audit`  
   Writes `data/tag-audit-YYYY-MM-DD.json` and `.csv` (gitignored). Review the CSV; audit drives all decisions.  
   Also reports **broken tag links** (sketches still pointing at deleted/archived tag documents). CI also runs `npm run check:broken-tags` on every PR. Fix orphans with `fix-broken-tags` (or in Prismic) before treating the catalogue as clean.

2. **Fix broken tags** — `npm run tag-cleanup:fix-broken-tags -- --dry-run` then without `--dry-run`.  
   Strips orphaned tag links from every affected sketch. Optional replacements live in [`broken-tag-repairs.mjs`](broken-tag-repairs.mjs). Publish the Migration Release in Prismic after running.

3. **Approve** — Copy rows you want into [`tag-merge-plan.csv`](tag-merge-plan.csv) (committed).  
   Set `action=merge`, `status=pending`, fill `from_*` and `to_*` IDs/slugs from the audit.

   **Reviewing the audit CSV** (`data/tag-audit-*.csv` — for your eyes only, not read by scripts):

   | `suggested_action` | Meaning | What to do |
   |--------------------|---------|------------|
   | `merge` | Heuristic found a likely duplicate | If you agree, add a row to `tag-merge-plan.csv` using `merge_into_slug` / `merge_into_id` |
   | `keep` | Fine as-is (includes homepage carousels) | Nothing |
   | `archive_candidate` | Zero sketches | Archive in Prismic at the end |
   | `reassign` | Vague tag (`stuff`, `general`, …) | Decide a target per sketch; add `reassign` rows to merge plan when supported |
   | `review` | Very small category (1–2 sketches) | Your call — merge only if a clear duplicate exists |
   | `defer` | Unclear or needs thought | Skip for now |

   You can add notes in the audit CSV `notes` column while reviewing; only **`tag-merge-plan.csv`** drives migration.

   **Merge plan row example** (book → books pilot):

   ```
   merge,<from_tag_id>,book,book,<to_tag_id>,books,books,6,pending,,pilot
   ```

4. **Pilot** — `npm run tag-cleanup:migrate -- --dry-run --pair <from-slug>` then migrate without `--dry-run`.  
   Publish the Migration Release in Prismic UI.

5. **Batch** — `npm run tag-cleanup:migrate -- --dry-run --batch-id N` then migrate with the same `--batch-id`.  
   Re-run until the command reports no remaining sketches (or dry-run count matches).  
   Optional `--limit N` caps how many sketches one run updates.

6. **Mark published** — After you publish each Migration Release in Prismic **and** a dry-run shows zero sketches left for that batch, set matching rows to `status=published` in the merge plan.

7. **Wrap up** — `npm run tag-cleanup:changelog` and `npm run tag-cleanup:redirects`  
   Outputs go to `data/` (local only). Copy newsletter draft out; append redirects to [`redirects.mjs`](../../redirects.mjs).

8. **Archive** — Re-run audit; archive unused tag documents manually in Prismic UI.

## Outputs

| Location | Committed? | Purpose |
|----------|------------|---------|
| `data/tag-audit-*.json` | No | Full backup snapshot |
| `data/tag-audit-*.csv` | No | Human review |
| `data/category-cleanup-*.md` | No | Before/after record |
| `data/category-cleanup-*-newsletter.md` | No | Newsletter draft |
| `data/tag-redirects-*.mjs` | No | Redirect snippets to review |
| `tag-merge-plan.csv` | Yes | Approved actions |

## Safety

- Always run `--dry-run` before the first real migrate
- Migration API creates drafts in a Migration Release — you publish manually
- Per-sketch rollback: Prismic document history
- Protected homepage carousel slugs are never suggested as merge losers

## Removal

If you no longer need this toolkit: delete `scripts/tag-cleanup/`, remove `tag-cleanup:*` scripts from `package.json`. Keep `tag-merge-plan.csv` history in git if merges were done.
