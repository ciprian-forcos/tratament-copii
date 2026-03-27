#!/bin/bash
# Ralph loop — Docker mode for tratament-copii
# Usage:
#   ./loop-docker.sh --build-image   — build the Docker image first
#   ./loop-docker.sh                 — build mode (infinite)
#   ./loop-docker.sh 20              — build mode, max 20 iterations
#   ./loop-docker.sh plan            — planning mode (runs once)

set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
IMAGE_NAME="ralph-tratament-copii"

# Get OAuth token
OAUTH_TOKEN="${CLAUDE_CODE_OAUTH_TOKEN:-$(cat ~/.claude-oauth-token 2>/dev/null || echo '')}"
if [[ -z "$OAUTH_TOKEN" ]]; then
  echo "Error: Claude OAuth token not found."
  echo "Run: claude setup-token"
  echo "Then save the token to ~/.claude-oauth-token"
  exit 1
fi

# Build image if requested
if [[ "$1" == "--build-image" ]]; then
  echo "Building Docker image..."
  docker build -t "$IMAGE_NAME" "$PROJECT_DIR"
  echo "Image built: $IMAGE_NAME"
  shift
fi

# Pass remaining args to loop.sh inside container
LOOP_ARGS="$*"

echo "Starting Ralph in Docker (args: ${LOOP_ARGS:-default build mode})"
echo "Project: $PROJECT_DIR"
echo ""

docker run --rm \
  -v "$PROJECT_DIR:/project" \
  -v "$HOME/.gitconfig:/root/.gitconfig:ro" \
  -e CLAUDE_CODE_OAUTH_TOKEN="$OAUTH_TOKEN" \
  -e HOME=/root \
  --workdir /project \
  "$IMAGE_NAME" \
  bash loop.sh $LOOP_ARGS
