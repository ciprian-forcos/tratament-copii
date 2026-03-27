#!/bin/bash
# Ralph loop for tratament-copii
# Usage:
#   ./loop.sh           — build mode (infinite)
#   ./loop.sh 20        — build mode, max 20 iterations
#   ./loop.sh plan      — planning mode (runs once)
#   ./loop.sh plan 5    — planning mode, max 5 iterations

set -e

MODE="build"
MAX_ITER=0
ITER=0

if [[ "$1" == "plan" ]]; then
  MODE="plan"
  MAX_ITER="${2:-1}"
  shift
elif [[ "$1" =~ ^[0-9]+$ ]]; then
  MAX_ITER="$1"
fi

PROMPT_FILE="PROMPT_${MODE}.md"

if [[ ! -f "$PROMPT_FILE" ]]; then
  echo "Error: $PROMPT_FILE not found"
  exit 1
fi

echo "Starting Ralph in $MODE mode (max iterations: ${MAX_ITER:-unlimited})"
echo "Press Ctrl+C to stop"
echo ""

while :; do
  ITER=$((ITER + 1))
  echo "=== Iteration $ITER ($(date '+%H:%M:%S')) ==="

  cat "$PROMPT_FILE" | claude --dangerously-skip-permissions --model claude-sonnet-4-6

  if [[ "$MAX_ITER" -gt 0 && "$ITER" -ge "$MAX_ITER" ]]; then
    echo "Reached max iterations ($MAX_ITER). Stopping."
    break
  fi

  if [[ "$MODE" == "plan" ]]; then
    echo "Planning complete."
    break
  fi
done
