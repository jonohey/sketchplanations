#!/usr/bin/env bash
# Merge main into open Dependabot PRs whose only conflict is pnpm-lock.yaml.
#
# pull_request workflows do not run while a PR is conflicted, and Dependabot
# rejects "@dependabot rebase" from github-actions (the commenter is not a
# collaborator). Keep the PR lockfile so pinned versions do not float, then
# pnpm install so package.json changes from main are reflected. The push lets
# CI and auto-merge run.
#
# Usage:
#   resolve-dependabot-lockfile-conflicts.sh
#       Resolve every open Dependabot PR and push any commits.
#   resolve-dependabot-lockfile-conflicts.sh --current [base-ref]
#       Resolve the checkout in the working directory. Does not fetch or push.
set -euo pipefail

SCRIPT_PATH="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/$(basename "${BASH_SOURCE[0]}")"

git_commit() {
	git -c user.name="github-actions[bot]" \
		-c user.email="41898282+github-actions[bot]@users.noreply.github.com" \
		commit "$@"
}

lockfile_keeps_overrides() {
	node --input-type=module -e '
		import { readFileSync } from "node:fs";
		const pkg = JSON.parse(readFileSync("package.json", "utf8"));
		const overrides = pkg.pnpm && pkg.pnpm.overrides;
		if (!overrides || Object.keys(overrides).length === 0) process.exit(0);
		const header = readFileSync("pnpm-lock.yaml", "utf8").split("\nimporters:")[0];
		if (!/^overrides:/m.test(header)) process.exit(1);
	'
}

# Resolve the current branch against base_ref.
# Prints a "resolved:" or "skipped:" line. Exits 1 when a resolution fails.
resolve_current_branch() {
	local base_ref="$1"

	if git merge-base --is-ancestor "$base_ref" HEAD; then
		echo "skipped: already contains $base_ref"
		return 0
	fi

	if git merge --no-commit "$base_ref"; then
		if git rev-parse -q --verify MERGE_HEAD >/dev/null; then
			git merge --abort
		fi
		echo "skipped: merge with $base_ref has no conflicts"
		return 0
	fi

	local conflicts
	conflicts="$(git diff --name-only --diff-filter=U)"
	if [ "$conflicts" != "pnpm-lock.yaml" ]; then
		echo "skipped: conflicts are not lockfile-only"
		if [ -n "$conflicts" ]; then
			echo "$conflicts"
		fi
		git merge --abort
		return 0
	fi

	# Ours is the Dependabot branch. Its lockfile has the pinned versions.
	# pnpm install then updates only specs that no longer satisfy package.json.
	git checkout --ours -- pnpm-lock.yaml
	git add pnpm-lock.yaml

	if ! pnpm install --no-frozen-lockfile; then
		echo "pnpm install failed"
		git merge --abort
		return 1
	fi

	local dirty
	dirty="$(git diff --name-only)"
	if [ -n "$dirty" ] && [ "$dirty" != "pnpm-lock.yaml" ]; then
		echo "pnpm install changed unexpected files:"
		echo "$dirty"
		git merge --abort
		return 1
	fi

	if grep -q -E '^(<<<<<<<|>>>>>>>)' pnpm-lock.yaml package.json; then
		echo "conflict markers remain"
		git merge --abort
		return 1
	fi

	if ! lockfile_keeps_overrides; then
		echo "lockfile is missing the pnpm overrides block"
		git merge --abort
		return 1
	fi

	if ! pnpm install --frozen-lockfile; then
		echo "lockfile does not match package.json after install"
		git merge --abort
		return 1
	fi

	dirty="$(git diff --name-only)"
	if [ -n "$dirty" ] && [ "$dirty" != "pnpm-lock.yaml" ]; then
		echo "frozen install changed unexpected files:"
		echo "$dirty"
		git merge --abort
		return 1
	fi

	git add pnpm-lock.yaml
	git_commit -m "Resolve pnpm lockfile conflict with main"
	echo "resolved: merged $base_ref and refreshed pnpm-lock.yaml"
}

resolve_and_push() {
	local branch="$1"
	local worktree before after

	worktree="$(mktemp -d "${TMPDIR:-/tmp}/dependabot-lockfile.XXXXXX")"
	rmdir "$worktree"

	git fetch origin main "$branch"
	git worktree add --detach "$worktree" "origin/$branch"

	cleanup_worktree() {
		git worktree remove --force "$worktree" || true
	}

	if ! (
		cd "$worktree"
		bash "$SCRIPT_PATH" --current origin/main
	); then
		cleanup_worktree
		return 1
	fi

	before="$(git rev-parse "origin/$branch")"
	after="$(git -C "$worktree" rev-parse HEAD)"
	if [ "$before" != "$after" ]; then
		if ! git -C "$worktree" push origin "HEAD:$branch"; then
			cleanup_worktree
			return 1
		fi
		echo "Pushed lockfile resolution to $branch"
	fi

	cleanup_worktree
}

if [ "${1:-}" = "--current" ]; then
	resolve_current_branch "${2:-origin/main}"
	exit 0
fi

failed=0
prs_tsv="$(
	gh pr list --author "app/dependabot" --state open --json number,headRefName \
		--jq '.[] | [.number, .headRefName] | @tsv'
)"
if [ -z "$prs_tsv" ]; then
	echo "No open Dependabot pull requests"
	exit 0
fi

while IFS=$'\t' read -r pr branch; do
	[ -n "${branch:-}" ] || continue
	echo "Checking PR #$pr ($branch)"
	if ! resolve_and_push "$branch"; then
		echo "Failed to resolve PR #$pr ($branch)"
		failed=1
	fi
done <<< "$prs_tsv"

exit "$failed"
