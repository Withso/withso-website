#!/usr/bin/env bash
set -euo pipefail

WITHSO_PROJECT_ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$WITHSO_PROJECT_ROOT"

python3 scripts/generate_site.py
python3 scripts/validate_site.py
node --check dist/assets/site.js

python3 - <<'PY'
from pathlib import Path
from shutil import copytree, rmtree

root = Path.cwd()
output = root / 'out'
if output.exists():
    rmtree(output)
copytree(root / 'dist', output)
print('Static deployment output ready in out/.')
PY
