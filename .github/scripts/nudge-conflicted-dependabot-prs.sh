#!/usr/bin/env bash
# Comment @dependabot rebase on open Dependabot PRs that conflict with main.
# Bounded retries during the weekly batch: 15-minute dedupe and a cap per PR per week.
# Further nudges come from sibling Dependabot merges (workflow re-runs this script).
set -euo pipefail

NUDGE_MARKER='dependabot-rebase-nudge'
MIN_MINUTES_BETWEEN_NUDGES="${MIN_MINUTES_BETWEEN_NUDGES:-15}"
MAX_NUDGES_PER_WEEK="${MAX_NUDGES_PER_WEEK:-5}"

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

  local week_ago nudges_this_week last_nudge_at
  week_ago="$(date -u -d '7 days ago' +%Y-%m-%dT%H:%M:%SZ)"

  nudges_this_week="$(
    gh api "repos/${GH_REPO}/issues/${pr}/comments" --paginate \
      --jq "[.[] | select(.body | contains(\"${NUDGE_MARKER}\")) | select(.created_at >= \"${week_ago}\")] | length"
  )"

  if [ "$nudges_this_week" -ge "$MAX_NUDGES_PER_WEEK" ]; then
    echo "PR #$pr already has ${nudges_this_week} nudges this week (max ${MAX_NUDGES_PER_WEEK}); skipping"
    return 0
  fi

  last_nudge_at="$(
    gh api "repos/${GH_REPO}/issues/${pr}/comments" --paginate \
      --jq "[.[] | select(.body | contains(\"${NUDGE_MARKER}\"))] | last | .created_at // empty"
  )"

  if [ -n "$last_nudge_at" ]; then
    local now last_epoch now_epoch minutes_since
    now="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
    last_epoch="$(date -d "$last_nudge_at" +%s)"
    now_epoch="$(date -d "$now" +%s)"
    minutes_since=$(( (now_epoch - last_epoch) / 60 ))
    if [ "$minutes_since" -lt "$MIN_MINUTES_BETWEEN_NUDGES" ]; then
      echo "PR #$pr nudged ${minutes_since}m ago (min ${MIN_MINUTES_BETWEEN_NUDGES}m); skipping"
      return 0
    fi
  fi

  gh pr comment "$pr" --body $'@dependabot rebase\n\n<!-- dependabot-rebase-nudge -->'
  echo "Nudged PR #$pr to rebase (${nudges_this_week} prior nudges this week)"
}

if [ "${1:-}" = "--single" ]; then
  nudge_pr "${2:?PR number required after --single}"
  exit 0
fi

gh pr list --author "app/dependabot" --state open --json number --jq '.[].number' | while read -r pr; do
  [ -n "$pr" ] || continue
  nudge_pr "$pr"
done
