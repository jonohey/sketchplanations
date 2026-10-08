# Agent notes

Context for Cloud Agents and other automated assistants working in this repo.

## Dependabot PRs — do not duplicate

**Before** running `./scripts/start-work.sh` or opening a new PR, check whether an open Dependabot PR already covers the dependency update (user link, PR number, or `dependabot/` branch).

When one exists:

- **Do not** cherry-pick the Dependabot bump onto a new issue branch.
- **Do not** open a parallel PR with the same version change.
- **Do** check out the Dependabot branch (`git fetch origin <dependabot-branch> && git checkout <dependabot-branch>`) and push fixes there if tests or config need changes beyond the bump.
- **Do** recommend merging the Dependabot PR when CI and preview deploy are green and no extra code changes are required (including major bumps blocked only by manual-review policy).

Only run `start-work.sh` when the task needs work **beyond** the Dependabot diff (failing tests, migrations, lockfile fix-ups the automation did not apply, etc.).

## Dependabot major version bumps — review before merge

CI auto-merge **skips** semver-major Dependabot PRs (see `dependabot-auto-merge` in `.github/workflows/ci.yml`). Cloud Agents and maintainers should still treat them as first-class work: review the bump, fix small breakages on the Dependabot branch, and leave a PR comment the maintainer can use before merging.

**Do not** open a replacement PR for the same version. Check out the Dependabot branch and push commits there if code changes are needed.

### Workflow

1. **Identify** open Dependabot PRs with the `breaking-change` label or `version-update:semver-major` (Dependabot PR body / `dependabot/fetch-metadata`).
2. **Changelog** — Read the release notes in the PR and the upstream changelog. Focus on sections that match **how this repo uses** the package (grep imports and API usage), not the whole library.
3. **Risk** — State likelihood of problems: none / low / medium / high, with one or two sentences on why (e.g. “we only use `motion.create` and `AnimatePresence`; v14 removed internal shims we never imported”).
4. **Code** — Run `pnpm install --frozen-lockfile`, `pnpm test`, and `pnpm build` on the Dependabot branch. If something fails, apply the **smallest** fix on that branch and push.
5. **Preview** — Use the Vercel preview URL from the PR. List **concrete URLs and interactions** to spot-check (not “click around the site”).
6. **Comment** — Post a single checklist comment on the PR via `gh pr comment`, including the marker `<!-- dependabot-major-review-checklist -->` so it is distinct from CI’s stub `<!-- dependabot-major-review -->`. Structure:

   - **Summary** — version jump and one-line verdict (e.g. “Low risk; no code changes”).
   - **Changelog (relevant)** — bullet points tied to this codebase.
   - **Changes on this branch** — “None” or list commits you pushed.
   - **Automated checks** — test/build result on the branch.
   - **Please verify on preview** — numbered list: URL path, device (desktop/mobile if it matters), action (open lightbox, dismiss modal, etc.).
   - **Merge** — remind that auto-merge will not run; maintainer merges when checks + preview look good.

Do not merge the PR unless the user explicitly asks you to.

### Example areas (framer-motion)

Motion is used in `Modal`, `SketchplanationLightboxDesktop`, `ImageGallery`, and `SketchTooltip` (`motion.create`, `AnimatePresence`, `useReducedMotion`). Major bumps: exercise modal/lightbox open-close, gallery swipe, tooltip show/hide, and “Reduce motion” / prefers-reduced-motion if animations changed.

## Dependabot and pnpm lockfiles

Weekly Dependabot PRs can fail CI and Vercel with:

```text
ERR_PNPM_LOCKFILE_CONFIG_MISMATCH
The current "overrides" configuration doesn't match the value found in the lockfile
```

### Cause

This project uses `pnpm.overrides` in `package.json` for security and compatibility pins (axios, minimatch, path-to-regexp, etc.). Those overrides must also appear in the `overrides:` block at the top of `pnpm-lock.yaml`.

Dependabot’s npm ecosystem updater regenerates `pnpm-lock.yaml` **without** that block. `pnpm install --frozen-lockfile` then fails on CI and Vercel even though `package.json` is unchanged.

Pinning pnpm via `"packageManager": "pnpm@9.15.9"` keeps versions consistent across environments, but does **not** stop Dependabot from stripping overrides.

### Automation already in place

- **`.github/workflows/dependabot-lockfile-sync.yml`** — on Dependabot PRs, runs `pnpm install --no-frozen-lockfile` and commits the lockfile if overrides were stripped.
- **`.github/workflows/dependabot-rebase-nudge.yml`** — when `main` moves or a Dependabot PR opens with lockfile merge conflicts, comments `@dependabot rebase` once per PR so CI and auto-merge can run.
- **`.github/workflows/ci.yml`** — `dependabot-auto-merge` merges patch/minor Dependabot PRs after CI passes. It keys off `github.event.pull_request.user.login == 'dependabot[bot]'`, not `github.actor`, so it still runs after the lockfile-sync workflow pushes a fix.

### If a Dependabot PR fails to deploy

1. Check whether **Sync Dependabot lockfile** ran and pushed a “Sync pnpm lockfile overrides” commit.
2. If not, fix locally on the Dependabot branch:
   ```bash
   corepack prepare pnpm@9.15.9 --activate
   pnpm install --no-frozen-lockfile
   git add pnpm-lock.yaml
   git commit -m "Sync pnpm lockfile overrides"
   git push
   ```
3. Confirm `pnpm-lock.yaml` starts with an `overrides:` block matching `package.json` → `pnpm.overrides`.
4. Prefer fixing the existing Dependabot PR rather than opening a replacement branch.

### Do not remove overrides casually

The overrides are deliberate pins. If removing or changing them, verify why each was added and run `pnpm install` to refresh the lockfile on `main`, not only on a Dependabot branch.

## Before committing or opening a PR — pre-commit review

**Always** run the pre-commit review before committing, pushing or opening a PR for any change to the site. The checklist lives in `.cursor/rules/github-workflow.mdc` under **"Pre-commit review (required)"**: read it from there at the time (it is the single source of truth; do not work from memory) and go through every item — necessity, simplicity, dependencies, performance, build, SEO, broken tags, tests, removals, best practice, and CSS/dark mode/mobile.

Then run the same checks CI runs (`.github/workflows/ci.yml`): `pnpm test`, `pnpm build`, `pnpm run check:books-duplicates` and `pnpm run check:broken-tags`.

Finish by summarising to the user what was checked, what was fixed, and anything flagged. Do not skip the review because the change looks small.

Practical notes:

- **Do not run `pnpm build` while a dev server is running in the same folder.** It corrupts the dev server's `.next` cache (every page then returns 500). Stop the server first, build, then `rm -rf .next` and restart the dev server.
- Mid-session, while the user is still iterating on a page, leave changes uncommitted and unpushed (each push to a PR branch triggers a deploy). Commit and push once, when the user says the work is finished or asks for the PR.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
