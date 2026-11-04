# Agent notes

Context for Cloud Agents and other automated assistants working in this repo.

## Dependabot PRs — do not duplicate

**Before** branching or opening a new PR, check whether an open Dependabot PR already covers the dependency update (user link, PR number, or `dependabot/` branch).

When one exists:

- **Do not** cherry-pick the Dependabot bump onto a new branch.
- **Do not** open a parallel PR with the same version change.
- **Do** check out the Dependabot branch (`git fetch origin <dependabot-branch> && git checkout <dependabot-branch>`) and push fixes there if tests or config need changes beyond the bump.
- **Do** recommend merging the Dependabot PR when CI and preview deploy are green and no extra code changes are required (including major bumps blocked only by manual-review policy).

Only start a new branch when the task needs work **beyond** the Dependabot diff (failing tests, migrations, lockfile fix-ups the automation did not apply, etc.).

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
- **`.github/workflows/dependabot-lockfile-conflicts.yml`** — when `main` moves, or on the Monday/Tuesday follow-up, merges `main` into Dependabot PRs whose only conflict is `pnpm-lock.yaml`. It keeps that PR’s lockfile pins, runs `pnpm install`, and pushes so CI and auto-merge can run. `pull_request` workflows do not run while a PR is conflicted, and Dependabot rejects `@dependabot rebase` from GitHub Actions, so this job replaces that nudge.
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

## Start work

When the user wants to start new work (e.g. "Start work on …", "Let's do …"), branch before coding — **except** for Dependabot PRs covered above. There is no GitHub issue per piece of work; the PR description is the record.

1. `git fetch origin main`, then `git checkout -b <slug> origin/main --no-track`. Never branch from a possibly stale local `main`, and never check out `main` itself (it may be checked out in another worktree).
2. Use a short, descriptive, kebab-case slug that reads as a complete phrase (e.g. `improve-header-nav`).
3. Confirm the branch name to the user, then implement on it.

Only create an issue when the user explicitly asks for one (e.g. a bug to track, or work to defer).

## While working

- Stay on the branch unless the user asks otherwise.
- Do not commit until the user asks to complete or finish the work (see below).
- Improvements to this workflow doc (e.g. tooling, conventions) may be committed alongside other work on the same branch when they come up.

## Formatting

Prettier formats this repo. When you change JavaScript, CSS, or any other file Prettier covers, write it with Prettier (`pnpm exec prettier --write <files>`, or `pnpm format` before committing). Do not format those files with Biome. Biome stays as a linter only.

CI runs `pnpm format:check` on pull requests and on pushes to `main`, and the check fails if formatting has drifted.

## Finishing work — "finish", "complete" or "ship it" means open a PR

When the user says to finish, complete, wrap up, ship, commit or create a PR, that **is** the explicit request to open a pull request. Do not stop at the commit, and do not ask whether they want a PR. Steps:

1. Run the pre-commit review (next section) and fix what it finds.
2. Review `git status` and `git diff`, stage relevant files (never `.env` or credentials), commit with a concise sentence-case message matching repo style (e.g. "Improve header mobile nav layout") that says what and why, then `git push -u origin HEAD`.
3. Open a PR with `gh pr create`, with a concise title and a body drawn from the actual diff and conversation, not generic placeholders. The body should explain what and why, how to verify (concrete URLs on the Vercel preview), and any review notes.
4. Return the PR URL, then offer to watch it for CI and review comments.

Until the user says to finish, leave changes uncommitted and unpushed (see the practical notes below). If a hook or tool prompt asks for a commit earlier than that, say so and ask rather than committing.

Cloud sessions have no `gh` CLI. Use the GitHub MCP tools to open the PR. There is no issue to create first; any short descriptive branch name is fine.

## Before committing or opening a PR — pre-commit review

**Always** run the pre-commit review before committing, pushing or opening a PR for any change to the site. Review all changes before staging; fix issues found, and do not commit until this passes. Do not work from memory.

- **Necessity**: Every changed line should be needed and used. Remove dead code, unused imports, and leftover debug code.
- **Simplicity**: Refactor where it clearly improves readability, but avoid excessive abstraction — prefer understandable code over clever or over-optimised code.
- **Dependencies**: New imports and packages must be trusted, reliable, and justified. Avoid adding dependencies when a simple existing solution works.
- **Performance**: Consider impact on page load, bundle size, images, fonts, and runtime work — roughly what a Chrome Lighthouse audit would flag. Flag regressions and fix or justify them. For every `next/image` that is not full width, set `sizes` to its real rendered width (e.g. `sizes="(min-width: 640px) 96px, 64px"`); without it Next assumes the `width` prop and serves a larger file than the display needs.
- **Build**: Consider whether build time will increase substantially (`pnpm build` when in doubt). If it does, ensure the trade-off is worthwhile.
- **SEO**: Check titles, meta descriptions, headings, structured data, canonical URLs, and link behaviour. Ensure nothing is negatively affected.
- **Broken tags**: Run `pnpm run check:broken-tags` (also runs in CI). If any fail, fix them in the Prismic UI before opening the PR.
- **Tests**: Add Vitest coverage where appropriate — meaningful cases, not exhaustive edge-case sprawl. Run `pnpm test` (Vitest) and ensure tests pass.
- **Removals**: Confirm deleted code only removes deliberately abandoned functionality. If a feature appears unused and removal wasn't in the brief, ask before removing it.
- **Formatting**: Run `pnpm format` (Prettier) before committing; CI runs `pnpm format:check`.
- **Best practice**: Check accessibility, error handling, security, and consistency with surrounding code.
- **CSS & styling**: New or changed CSS should be mobile-first, with behaviour checked on small viewports. Consider dark mode (`prefers-color-scheme`) for any colours, borders, or backgrounds. Typography should meet accessible contrast (WCAG AA) unless a deliberate subdued treatment is intended.

Briefly summarise the review outcome to the user (what you checked, what you fixed, anything flagged).

### Local checks — run what the change can affect

CI (`.github/workflows/ci.yml`) runs every check on each PR, so local runs are for fast feedback before a push triggers a deploy. Run the ones the change could plausibly break; CI is the backstop for the rest.

- **Always:** `pnpm run format:check` (fast), for every change.
- **`pnpm test`:** skip only when every changed file is docs or workflow config (`*.md`, `.cursor/`, `.github/`). Otherwise run it; it is fast.
- **`pnpm build`:** run it unless **every** changed file is on this skip list: `*.md`, `.cursor/`, `.github/`, `tests/`, `scripts/` (nothing the build imports lives there; `setup.mjs` and `next.config.mjs` import only from `utils/`). Anything else (`pages/`, `components/`, `hooks/`, `helpers/`, `utils/`, `services/`, `styles/`, `data/`, `public/`, `images/`, root config and `.mjs`/`.js`/`.ts` files, `package.json`, the lockfile) needs a build. This is an allowlist of what is safe to skip, so a new or unlisted folder defaults to building. It is slow and cannot run alongside a dev server in the same folder.
- **`pnpm run check:books-duplicates`:** books data, overrides, or `utils/bookLinks.mjs`.
- **`pnpm run check:broken-tags`:** only when sketch or tag data changed, or when unsure. It depends on Prismic content, not just the diff.

**When unsure, run the check.** A skipped check must be one you can justify from the diff alone; if the change touches anything you can't classify, or mixes docs with code, run the full set.

Finish by summarising to the user what was checked, what was fixed, anything flagged, **and which checks you skipped and why** (e.g. "build skipped: docs-only change; CI will run it"). Never skip the review itself because the change looks small; only the local command runs are scoped.

Practical notes:

- **Do not run `pnpm build` while a dev server is running in the same folder.** It corrupts the dev server's `.next` cache (every page then returns 500). Stop the server first, build, then `rm -rf .next` and restart the dev server.
- Mid-session, while the user is still iterating on a page, leave changes uncommitted and unpushed (each push to a PR branch triggers a deploy). Commit and push once, when the user says the work is finished or asks for the PR.

## UI patterns

- **Back to top links:** Match the existing pattern on `/books`, `/list`, and sketch pages — a `Link` (or `<a>`) to `#top` with `onClick` calling `preventDefault()` then `fastScrollToTop()` from `helpers`. Do not use a bare `#top` anchor without the scroll helper.

- **Back/Forward scroll restoration:** `experimental.scrollRestoration` is on, but it only lands in the right place if the page already has its full height. Anything that changes the page after load needs handling: reserve space for late or lazy content (e.g. image aspect ratio, skeleton rows sized like real rows), and remember per-visit state per history entry with `helpers/historyEntryCache` (e.g. "Load more" results, inner carousel scroll). Focus inputs with `focus({ preventScroll: true })`, not the `autoFocus` attribute.

## Project config

- Repo: `jonohey/sketchplanations`
- Default branch: `main`
- Branch pattern: short descriptive kebab-case slug (e.g. `improve-header-nav`), cut from `origin/main`.
- Tests: `pnpm test` (Vitest)
- Build: `pnpm build`

## Sentry (error monitoring)

Production errors are captured with `@sentry/nextjs` (client, server, edge via `instrumentation*.js` / `sentry.*.config.js`, and `pages/_error.js`). Config is in `next.config.mjs` via `withSentryConfig`.

**Plan:** Developer (free) — roughly 5k errors/month, 1 user, **email** alerts. Third-party alert integrations (e.g. Slack) and Seer require a paid plan; don’t assume they’re available.

**Env (Vercel Production only — never hardcode):**

- `NEXT_PUBLIC_SENTRY_DSN` — required for reporting
- `SENTRY_ORG` / `SENTRY_PROJECT` / `SENTRY_AUTH_TOKEN` — optional; auth token is for source-map upload (mark sensitive in Vercel)

SDK is production-only and uses a low `tracesSampleRate` to stay within free-plan limits. Do not enable Session Replay unless the plan and quota allow it.

**When debugging production bugs:** Check [Sentry Issues](https://sketchplanations.sentry.io/issues/) first. Browser/DOM noise (e.g. `removeChild` with no frames in `pages/` or `components/`) is often safe to archive or ignore.

**Resolving via GitHub (optional):** Include `Fixes SKETCHPLANATIONS-XX` in a commit or PR body (issue short ID from Sentry) so Sentry can mark it resolved after the fix ships. Don’t strip Sentry wiring without intent.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
