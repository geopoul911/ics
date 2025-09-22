#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${1:-/opt/ics/frontend}"
NEW_BASE="${2:-https://ultima.icsgr.com}"

cd "$APP_DIR"

# Replace only in source files; skip node_modules and build
find src -type f \( -name '*.js' -o -name '*.jsx' -o -name '*.ts' -o -name '*.tsx' \) \
  ! -path '*/node_modules/*' ! -path '*/build/*' | while read -r f; do
  sed -i -e "s#http://localhost:8000#${NEW_BASE}#g" \
         -e "s#http://127\.0\.0\.1:8000#${NEW_BASE}#g" \
         -e "s#https://localhost:8000#${NEW_BASE}#g" "$f"
done

echo "Leftovers (should be empty):"
grep -RInE 'localhost:8000|127\.0\.0\.1:8000' src || true
