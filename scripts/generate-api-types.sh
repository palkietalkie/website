#!/usr/bin/env bash
# Regenerate src/lib/api-types.ts from the backend's OpenAPI spec.
#
# Sources the schema from a running dev backend (default: http://localhost:8000) so the
# types always reflect the deployed shape. Override the URL with $OPENAPI_URL.
#
# Run manually after changing a router on the backend; the pre-commit hook re-runs this
# and fails the commit if api-types.ts drifts.
set -e
cd "$(git rev-parse --show-toplevel)"

OPENAPI_URL="${OPENAPI_URL:-http://localhost:8000/openapi.json}"
OUT="src/lib/api-types.ts"

if ! curl -fsS "$OPENAPI_URL" >/dev/null 2>&1; then
	echo "[generate-api-types] cannot reach $OPENAPI_URL — is the backend running?" >&2
	echo "[generate-api-types] start with: cd ../backend && uvicorn app.main:app --reload --port 8000" >&2
	exit 1
fi

npx --no-install openapi-typescript "$OPENAPI_URL" -o "$OUT"
npx --no-install prettier --write "$OUT"
echo "[generate-api-types] wrote $OUT from $OPENAPI_URL"
