#!/usr/bin/env bash
set -euo pipefail

WITHSO_PROJECT_ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$WITHSO_PROJECT_ROOT"

if [ ! -d node_modules ]; then
  npm ci --no-audit --no-fund
fi

# Type check, build the static site into out/, then validate the output.
npm run build
