#!/usr/bin/env bash
# Refuses a PR whose changed source files don't also change their paired test files.
#
# Convention enforced (matches CLAUDE.md "Every fix ships with a test"):
#   src/foo/bar.ts(x)  ⇄  src/foo/bar.test.ts(x)
#
# Skips: scripts/, .github/, generated api-types.ts, CSS modules, JSON, markdown, .d.ts, test files.

set -e

BASE_REF="${1:-origin/main}"

git fetch --quiet --depth=200 origin main 2>/dev/null || true

CHANGED=$(git diff --name-only --diff-filter=ACMR "${BASE_REF}"...HEAD)
if [ -z "$CHANGED" ]; then
    echo "[test-pair] no changes vs ${BASE_REF}"
    exit 0
fi

MISSING_PAIRS=()
while IFS= read -r f; do
    [ -z "$f" ] && continue
    case "$f" in
        scripts/*|.github/*|docs/*|messages/*) continue ;;
        src/lib/api-types.ts) continue ;;
        *.test.ts|*.test.tsx|*.d.ts) continue ;;
        *.css|*.json|*.md) continue ;;
        src/*.ts|src/*.tsx) ;;
        *) continue ;;
    esac

    dir=$(dirname "$f")
    case "$f" in
        *.tsx) base=$(basename "$f" .tsx); ext=tsx ;;
        *)     base=$(basename "$f" .ts);  ext=ts  ;;
    esac
    pair="${dir}/${base}.test.${ext}"

    # Accept either the strict per-file pair OR any other test file in the same directory that was also changed in this PR. Some test files cover multiple sibling sources (e.g. a `<feature>.test.ts` that exercises several helpers in the same dir).
    # `grep -F` is critical here: Next.js catch-all routes contain `[[` in paths (e.g. `[[...sign-in]]`), which grep -x without -F treats as an open character class and bails with "invalid collating element". For the directory-sibling check we run -F on a literal anchor prefix instead of a regex.
    has_same_dir_test=0
    while IFS= read -r candidate; do
        case "$candidate" in
            "${dir}/"*".test.ts" | "${dir}/"*".test.tsx")
                # Ensure only files directly under $dir (no further subdirs) qualify, mirroring the original regex intent.
                rel=${candidate#"${dir}/"}
                [[ "$rel" == */* ]] || has_same_dir_test=1
                ;;
        esac
    done <<< "$CHANGED"
    if ! printf '%s\n' "$CHANGED" | grep -Fxq "$pair" \
        && [ "$has_same_dir_test" -eq 0 ]; then
        if [ -f "$pair" ]; then
            MISSING_PAIRS+=("  ${f}  (modified)  →  ${pair}  (unchanged in PR)")
        else
            MISSING_PAIRS+=("  ${f}  (modified)  →  ${pair}  (does not exist; create it)")
        fi
    fi
done <<< "$CHANGED"

if [ "${#MISSING_PAIRS[@]}" -gt 0 ]; then
    echo "::error::Source files changed without their paired test files:"
    printf '%s\n' "${MISSING_PAIRS[@]}"
    echo
    echo "Per CLAUDE.md: 'Every fix ships with a test that fails before the fix and passes after.'"
    echo "Fix: add or update src/.../foo.test.ts(x) alongside src/.../foo.ts(x) and include it in this PR."
    exit 1
fi

echo "[test-pair] OK"
