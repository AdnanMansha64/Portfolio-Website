#!/usr/bin/env bash
#
# Regenerates the root index.html that GitHub Pages serves.
#
# Views/Home/Index.cshtml is the source of truth. GitHub Pages cannot run
# ASP.NET Core, so this renders the view through the real app once and writes the
# result to ./index.html, pointing its asset URLs at the existing wwwroot/ files
# (Pages serves every file in the repository, so they need no second copy).
#
# Run it after ANY change to the view, the CSS or the JS, and commit the result
# alongside that change:
#
#     ./export-static.sh && git add -A && git commit
#
# CI (.github/workflows/verify-static.yml) fails the build if the committed
# index.html does not match what this script produces.
#
set -euo pipefail

cd "$(dirname "$0")"

PORT="${PORT:-5399}"
OUT="${OUT:-index.html}"
APP_PID=""

cleanup() {
  if [[ -n "$APP_PID" ]] && kill -0 "$APP_PID" 2>/dev/null; then
    kill "$APP_PID" 2>/dev/null || true
    wait "$APP_PID" 2>/dev/null || true
  fi
}
trap cleanup EXIT

echo "==> Building"
dotnet build --nologo --verbosity quiet

echo "==> Starting app on port $PORT"
# --no-launch-profile: ignore Properties/launchSettings.json, which is a
# developer convenience and would otherwise override the environment and URL.
ASPNETCORE_ENVIRONMENT=Production dotnet run --no-build --no-launch-profile \
  --urls "http://localhost:$PORT" >/tmp/export-static.log 2>&1 &
APP_PID=$!

echo -n "==> Waiting for app"
for _ in $(seq 1 60); do
  if curl -fsS -o /dev/null "http://localhost:$PORT/" 2>/dev/null; then
    echo " — up"
    break
  fi
  if ! kill -0 "$APP_PID" 2>/dev/null; then
    echo " — app exited early:"
    cat /tmp/export-static.log
    exit 1
  fi
  echo -n "."
  sleep 0.5
done

RAW="$(mktemp)"
if ! curl -fsS "http://localhost:$PORT/" -o "$RAW"; then
  echo "ERROR: could not fetch the rendered page" >&2
  cat /tmp/export-static.log >&2
  exit 1
fi

echo "==> Writing $OUT"
python3 - "$RAW" "$OUT" <<'PY'
import os, re, sys

raw_path, out_path = sys.argv[1], sys.argv[2]
html = open(raw_path, encoding="utf-8").read()

# The app serves "/css/x.css?v=<hash>" from wwwroot; Pages serves the repository
# tree, so the same file is reachable at "wwwroot/css/x.css". Relative (no
# leading slash) so the /Portfolio-Website/ project sub-path works unchanged.
html = re.sub(
    r'(href|src)="/((?:css|js)/[^"?]+)(?:\?[^"]*)?"',
    r'\1="wwwroot/\2"',
    html,
)
html = re.sub(r'(href|src)="/favicon\.ico(?:\?[^"]*)?"', r'\1="wwwroot/favicon.ico"', html)

html = html.replace(
    "<!DOCTYPE html>",
    "<!DOCTYPE html>\n"
    "<!--\n"
    "  GENERATED — do not edit.\n"
    "  Source: Views/Home/Index.cshtml   Regenerate: ./export-static.sh\n"
    "-->\n",
    1,
)

open(out_path, "w", encoding="utf-8").write(html)
print(f"    {out_path} ({os.path.getsize(out_path):,} bytes)")

stray = sorted(set(re.findall(r'(?:href|src)="/(?!/)[^"]*"', html)))
if stray:
    print("    ERROR: absolute paths Pages cannot serve:", stray)
    sys.exit(1)
PY

echo "==> Verifying local references resolve"
python3 - "$OUT" <<'PY'
import os, re, sys

html = open(sys.argv[1], encoding="utf-8").read()
refs = sorted(set(re.findall(
    r'(?:href|src)="((?!https?:|mailto:|tel:|#|data:)[^"]+)"', html)))

missing = [r for r in refs if not os.path.isfile(r.split("?")[0])]
for r in refs:
    print(f"    {'ok  ' if r not in missing else 'MISS'} {r}")
if missing:
    sys.exit(1)
PY

echo "==> Done. Commit index.html together with the change that caused it."
