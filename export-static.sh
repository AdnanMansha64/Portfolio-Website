#!/usr/bin/env bash
#
# Builds the static site that GitHub Pages serves, into ./_site
#
# Views/Home/Index.cshtml is the ONLY copy of the page. GitHub Pages cannot run
# ASP.NET Core, so this renders the view through the real app once and writes the
# resulting HTML — plus the wwwroot assets — into _site/.
#
# _site/ is a build output: gitignored, never committed, never edited by hand.
# CI (.github/workflows/deploy-pages.yml) runs this and publishes the result.
#
# Local use:
#     ./export-static.sh && open _site/index.html
#
set -euo pipefail

cd "$(dirname "$0")"

PORT="${PORT:-5399}"
OUT="_site"
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

echo "==> Assembling $OUT/"
rm -rf "$OUT"
mkdir -p "$OUT"

# Static assets keep their wwwroot-relative layout (css/, js/, favicon.ico),
# so the rewritten URLs below work from any base path Pages serves us on.
cp -R wwwroot/. "$OUT/"

# Pages would otherwise hand the directory to Jekyll.
touch "$OUT/.nojekyll"

python3 - "$RAW" "$OUT/index.html" <<'PY'
import re, sys

raw_path, out_path = sys.argv[1], sys.argv[2]
html = open(raw_path, encoding="utf-8").read()

# The app serves "/css/x.css?v=<hash>"; in _site the file sits at "css/x.css".
# Relative (no leading slash) so a project-pages sub-path works unchanged.
html = re.sub(
    r'(href|src)="/((?:css|js)/[^"?]+)(?:\?[^"]*)?"',
    r'\1="\2"',
    html,
)
html = re.sub(r'(href|src)="/favicon\.ico(?:\?[^"]*)?"', r'\1="favicon.ico"', html)

html = html.replace(
    "<!DOCTYPE html>",
    "<!DOCTYPE html>\n"
    "<!--\n"
    "  GENERATED — do not edit.\n"
    "  Source: Views/Home/Index.cshtml   Build: ./export-static.sh\n"
    "-->\n",
    1,
)

open(out_path, "w", encoding="utf-8").write(html)
print(f"    index.html ({len(html):,} bytes)")

stray = sorted(set(re.findall(r'(?:href|src)="/(?!/)[^"]*"', html)))
if stray:
    print("    ERROR: absolute paths Pages cannot serve:", stray)
    sys.exit(1)
PY

echo "==> Verifying local references resolve"
python3 - "$OUT" <<'PY'
import os, re, sys

site = sys.argv[1]
html = open(os.path.join(site, "index.html"), encoding="utf-8").read()
refs = sorted(set(re.findall(r'(?:href|src)="((?!https?:|mailto:|tel:|#|data:)[^"]+)"', html)))

missing = [r for r in refs if not os.path.isfile(os.path.join(site, r.split("?")[0]))]
for r in refs:
    print(f"    {'ok  ' if r not in missing else 'MISS'} {r}")
if missing:
    sys.exit(1)
PY

echo "==> Done — $OUT/ ready ($(find "$OUT" -type f | wc -l | tr -d ' ') files)"
