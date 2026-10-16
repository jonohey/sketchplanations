#!/usr/bin/env bash
# Create a GitHub issue, add it to the project board, and check out a linked branch.
# Usage: ./scripts/start-work.sh "Issue title" ["Optional body markdown"]

set -euo pipefail

REPO="jonohey/sketchplanations"
PROJECT_NUMBER=3
PROJECT_OWNER="jonohey"
DEFAULT_BRANCH="main"

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 \"Issue title\" [\"Optional body\"]" >&2
  exit 1
fi

TITLE="$1"
BODY="${2:-_Started from Cursor. Details to be expanded as work progresses._}"

if ! gh auth status >/dev/null 2>&1; then
  echo "GitHub CLI is not authenticated. Run: gh auth login" >&2
  exit 1
fi

if ! gh auth status 2>&1 | grep -q "read:project\|project"; then
  echo "Note: GitHub token may lack project scopes. If project board add fails, run:" >&2
  echo "  gh auth refresh -s project,read:project" >&2
fi

slugify() {
  local slug max=40
  slug=$(echo "$1" \
    | tr '[:upper:]' '[:lower:]' \
    | sed -E 's/[^a-z0-9]+/-/g; s/^-+|-+$//g')

  if ((${#slug} <= max)); then
    echo "$slug"
    return
  fi

  # Truncate at a word boundary within the limit so the slug is a complete phrase.
  local truncated="${slug:0:max}"
  truncated="${truncated%-}" # drop trailing hyphen when the cut landed mid-segment
  echo "${truncated%-*}"
}

# Only fetch: never check out the default branch. It may already be checked out in
# another worktree (e.g. the main checkout), where git refuses a second checkout.
echo "Fetching latest $DEFAULT_BRANCH..."
git fetch origin "$DEFAULT_BRANCH"

SLUG="$(slugify "$TITLE")"
ISSUE_URL="$(gh issue create --repo "$REPO" --title "$TITLE" --body "$BODY")"
ISSUE_NUMBER="$(echo "$ISSUE_URL" | grep -oE '[0-9]+$')"
BRANCH_NAME="${ISSUE_NUMBER}-${SLUG}"

if ! gh project item-add "$PROJECT_NUMBER" --owner "$PROJECT_OWNER" --url "$ISSUE_URL" >/dev/null 2>&1; then
  echo "Warning: issue created but not added to project board. Run:" >&2
  echo "  gh auth refresh -s project,read:project" >&2
  echo "  gh project item-add $PROJECT_NUMBER --owner $PROJECT_OWNER --url $ISSUE_URL" >&2
fi

# Create the linked branch on GitHub (from the default branch), then check it out here.
gh issue develop "$ISSUE_NUMBER" --repo "$REPO" --name "$BRANCH_NAME" >/dev/null
git fetch origin "$BRANCH_NAME"
git checkout -b "$BRANCH_NAME" --track "origin/$BRANCH_NAME"

echo "Issue: #$ISSUE_NUMBER"
echo "URL: $ISSUE_URL"
echo "Branch: $BRANCH_NAME"
