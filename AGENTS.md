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
