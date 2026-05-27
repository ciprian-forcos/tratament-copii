#!/usr/bin/env bash
# verify-plan.sh — mechanical verification of a plan's branch state.
#
# Used by the Agent-Reviewer per .planning/PROCESS.md "Implementer ↔
# Agent-Reviewer Loop". Captures the literal output of the gate commands
# and remote verification, so the reviewer doesn't have to trust an
# Implementer's summary.
#
# Exit codes:
#   0  → SIGNOFF candidate (mechanical checks all pass)
#   1  → FINDINGS (one or more mechanical checks failed)
#   2  → usage / setup error
#
# Note: exit 0 from this script is NECESSARY but NOT SUFFICIENT for the
# Agent-Reviewer to emit SIGNOFF. The reviewer must additionally verify
# the per-blocker resolution table (judgment, not just mechanics).
#
# Usage:
#   ./scripts/verify-plan.sh                    # uses current branch
#   ./scripts/verify-plan.sh <branch>           # checks specific branch
#
# Output: a structured report to stdout, suitable for pasting into a
# status report or PR body verbatim.

set -u
trap 'echo; echo "[verify-plan] interrupted." >&2; exit 130' INT TERM

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null)"
if [ -z "$REPO_ROOT" ]; then
  echo "FATAL: not inside a git repository" >&2
  exit 2
fi
cd "$REPO_ROOT" || exit 2

BRANCH="${1:-$(git rev-parse --abbrev-ref HEAD)}"
if [ "$BRANCH" = "HEAD" ]; then
  echo "FATAL: detached HEAD — pass a branch name explicitly" >&2
  exit 2
fi

FINDINGS=()

print_section() {
  printf '\n=== %s ===\n' "$1"
}

last_n_lines() {
  # POSIX-portable "last N lines" — avoids GNU-specific tail flags.
  local n="$1"; shift
  awk -v n="$n" '{
    buf[NR % n] = $0
  } END {
    start = (NR > n) ? NR - n + 1 : 1
    for (i = start; i <= NR; i++) print buf[i % n]
  }'
}

# Captures more lines for `npm run test` so the vitest summary line
# ("Tests N passed (N)") always lands in the report.
LINES_PER_STEP="${LINES_PER_STEP:-6}"

run_gate_step() {
  local label="$1"; shift
  local logfile
  logfile="$(mktemp)" || { echo "FATAL: mktemp failed" >&2; exit 2; }

  print_section "$label"
  printf '$ %s\n' "$*"
  if "$@" >"$logfile" 2>&1; then
    local code=0
  else
    local code=$?
  fi
  last_n_lines "$LINES_PER_STEP" <"$logfile"
  printf 'exit: %s\n' "$code"

  if [ "$code" -ne 0 ]; then
    FINDINGS+=("$label exited with code $code")
  fi
  rm -f "$logfile"
}

#
# 1. Header
#
print_section "Plan verification"
printf 'branch:  %s\n' "$BRANCH"
printf 'when:    %s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)"

#
# 2. Remote verification
#
print_section "Remote verification"
LOCAL_HEAD="$(git rev-parse "$BRANCH" 2>/dev/null || echo MISSING)"
if [ "$LOCAL_HEAD" = "MISSING" ]; then
  printf 'local branch %s: NOT FOUND locally\n' "$BRANCH"
  FINDINGS+=("local branch $BRANCH not found")
else
  printf '$ git rev-parse %s\n%s\n' "$BRANCH" "$LOCAL_HEAD"
fi

# fetch quietly so the remote ref is fresh
git fetch origin "$BRANCH" --quiet 2>/dev/null || true

REMOTE_LINE="$(git ls-remote origin "refs/heads/$BRANCH" 2>/dev/null | head -1)"
if [ -z "$REMOTE_LINE" ]; then
  printf '\n$ git ls-remote origin refs/heads/%s\n(empty — branch not on origin)\n' "$BRANCH"
  FINDINGS+=("branch $BRANCH not pushed to origin")
else
  printf '\n$ git ls-remote origin refs/heads/%s\n%s\n' "$BRANCH" "$REMOTE_LINE"
  REMOTE_HEAD="${REMOTE_LINE%%[[:space:]]*}"
  if [ "$LOCAL_HEAD" != "MISSING" ] && [ "$LOCAL_HEAD" != "$REMOTE_HEAD" ]; then
    FINDINGS+=("local HEAD ($LOCAL_HEAD) != remote tip ($REMOTE_HEAD)")
  fi
fi

#
# 3. Gate commands
#
run_gate_step "npm run type-check" npm run type-check
run_gate_step "npm run test"       npm run test
run_gate_step "npm run build"      npm run build

#
# 4. TDD rhythm check (best-effort, not authoritative)
#
print_section "TDD rhythm (advisory)"
COMMITS_ON_BRANCH="$(git log --format='%h %s' main..HEAD 2>/dev/null || true)"
if [ -z "$COMMITS_ON_BRANCH" ]; then
  printf '(no commits ahead of main, or main not reachable)\n'
else
  printf '%s\n' "$COMMITS_ON_BRANCH"
  if printf '%s\n' "$COMMITS_ON_BRANCH" | grep -qE '\[test\]'; then
    printf '\nfound [test] commit on branch: OK\n'
  else
    printf '\nNOTE: no [test]-prefixed commit on branch. Acceptable when no\n'
    printf 'new units were created in this plan. Reviewer must judge.\n'
  fi
fi

#
# 5. Summary
#
print_section "Summary"
if [ "${#FINDINGS[@]}" -eq 0 ]; then
  printf 'MECHANICAL CHECKS: pass\n'
  printf '\nNext: Agent-Reviewer verifies per-blocker resolution table by\n'
  printf 'reading the most recent feedback message + the diff. If that\n'
  printf 'also passes, emit SIGNOFF.\n'
  exit 0
else
  printf 'MECHANICAL CHECKS: %d finding(s)\n\n' "${#FINDINGS[@]}"
  i=1
  for f in "${FINDINGS[@]}"; do
    printf '  %d. %s\n' "$i" "$f"
    i=$((i + 1))
  done
  printf '\nDo not request Human Review until these are resolved.\n'
  exit 1
fi
