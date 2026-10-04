#!/usr/bin/env bash
#
# Regenerates the root index.html that GitHub Pages serves.
#
# Views/Home/Index.cshtml is the single source of truth. GitHub Pages cannot run
# ASP.NET Core, so this script renders the view once through the real app and
# saves the resulting HTML as a static page, rewriting the asset URLs to the
# repo-relative paths Pages can actually serve.
#
# Run it after any change to the view, the CSS or the JS:
#     ./export-static.sh
#
set -euo pipefail

cd "$(dirname "$0")"

PORT="${PORT:-5399}"
OUT="index.html"
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
ASPNETCORE_ENVIRONMENT=Production dotnet run --no-build --urls "http://localhost:$PORT" >/tmp/export-static.log 2>&1 &
APP_PID=$!

echo -n "==> Waiting for app"
for _ in $(seq 1 40); do
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

echo "==> Rewriting asset paths for GitHub Pages"
python3 - "$RAW" "$OUT" <<'PY'
import re, sys

raw_path, out_path = sys.argv[1], sys.argv[2]
html = open(raw_path, encoding="utf-8").read()

# MapStaticAssets serves /css/x.css?v=<hash>; on Pages the real file is at
# wwwroot/css/x.css, so point at that and drop the cache-busting query.
html = re.sub(r'(?:href|src)="/((?:css|js)/[^"?]+)(?:\?[^"]*)?"',
              lambda m: m.group(0).split('=')[0] + '="wwwroot/' + m.group(1) + '"',
              html)
html = re.sub(r'(href|src)="/favicon\.ico(?:\?[^"]*)?"',
              r'\1="wwwroot/favicon.ico"', html)

banner = ("<!--\n"
          "  GENERATED FILE — do not edit by hand.\n"
          "  Source: Views/Home/Index.cshtml  ·  Regenerate: ./export-static.sh\n"
          "  This static copy exists only so GitHub Pages can serve the site;\n"
          "  GitHub Pages cannot execute the ASP.NET Core MVC app itself.\n"
          "-->\n")
html = html.replace("<!DOCTYPE html>", "<!DOCTYPE html>\n" + banner, 1)

open(out_path, "w", encoding="utf-8").write(html)

leftover = re.findall(r'(?:href|src)="/(?!/)[^"]*"', html)
print(f"    wrote {out_path} ({len(html):,} bytes)")
if leftover:
    print("    WARNING: absolute paths that Pages cannot serve:", set(leftover))
PY

echo "==> Done. Commit index.html together with the view/CSS/JS changes."
