#!/usr/bin/env bash
# scripts/docs-backup.sh
#
# Commit and push the private branded-docs repo. `branded-docs/` lives inside
# this checkout but is a SEPARATE git repo (its own history + private remote
# ericmaster/branded-docs) and is .gitignore'd by ericmaster-ninja, so it never
# lands in the public site. This is the backup: it versions the confidential
# document sources to their private GitHub remote.
#
# Usage:  npm run docs:backup ["optional commit message"]
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DOCS_DIR="$REPO_ROOT/branded-docs"

if [ ! -d "$DOCS_DIR/.git" ]; then
  echo "docs-backup: $DOCS_DIR is not a git repo — clone ericmaster/branded-docs there first." >&2
  exit 1
fi

msg="${1:-docs: backup $(date +%Y-%m-%dT%H:%M:%S%z)}"

git -C "$DOCS_DIR" add -A
if git -C "$DOCS_DIR" diff --cached --quiet; then
  echo "docs-backup: nothing to commit."
else
  git -C "$DOCS_DIR" commit -m "$msg"
fi

# Push (sets upstream on first run). Refuses gracefully if no remote configured.
if git -C "$DOCS_DIR" remote get-url origin >/dev/null 2>&1; then
  branch="$(git -C "$DOCS_DIR" symbolic-ref --short HEAD)"
  git -C "$DOCS_DIR" push -u origin "$branch"
  echo "docs-backup: pushed $branch to $(git -C "$DOCS_DIR" remote get-url origin)"
else
  echo "docs-backup: no 'origin' remote configured — committed locally only." >&2
fi
