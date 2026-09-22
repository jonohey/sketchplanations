#!/usr/bin/env bash
# Comment @dependabot rebase on open Dependabot PRs that conflict with main.
# Re-nudges when still conflicted after a previous nudge (Dependabot may not rebase immediately).
set -euo pipefail

NUDGE_MARKER='dependabot-rebase-nudge'
MIN_HOURS_BETWEEN_NUDGES="${MIN_HOURS_BETWEEN_NUDGES:-6}"

nudge_pr() {
  local pr="$1"
  local mergeable merge_state

  for _ in 1 2 3 4 5 6; do
    merge_state="$(gh pr view "$pr" --json mergeStateStatus --jq '.mergeStateStatus')"
    mergeable="$(gh pr view "$pr" --json mergeable --jq '.mergeable')"
    if [ "$merge_state" != "UNKNOWN" ]; then
      break
    fi
    sleep 10
  done

  if [ "$merge_state" != "DIRTY" ] && [ "$mergeable" != "CONFLICTING" ]; then
    echo "PR #$pr is mergeable (state=$merge_state, mergeable=$mergeable); skipping"
    return 0
  fi

  local last_nudge_at
  last_nudge_at="$(
    gh api "repos/${GH_REPO}/issues/${pr}/comments" --paginate \
      --jq "[.[] | select(.body | contains(\"${NUDGE_MARKER}\"))] | last | .created_at // empty"
  )"

  if [ -n "$last_nudge_at" ]; then
    local now last_epoch now_epoch hours_since
    now="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
    last_epoch="$(date -d "$last_nudge_at" +%s)"
    now_epoch="$(date -d "$now" +%s)"
    hours_since=$(( (now_epoch - last_epoch) / 3600 ))
    if [ "$hours_since" -lt "$MIN_HOURS_BETWEEN_NUDGES" ]; then
      echo "PR #$pr nudged ${hours_since}h ago; skipping"
      return 0
    fi
  fi

  gh pr comment "$pr" --body $'@dependabot rebase\n\n<!-- dependabot-rebase-nudge -->'
  echo "Nudged PR #$pr to rebase"
}

if [ "${1:-}" = "--single" ]; then
  nudge_pr "${2:?PR number required after --single}"
  exit 0
fi

gh pr list --author "app/dependabot" --state open --json number --jq '.[].number' | while read -r pr; do
  [ -n "$pr" ] || continue
  nudge_pr "$pr"
done
