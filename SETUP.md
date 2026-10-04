# Setup & maintenance guide

Operational handbook for this repository. Read the section you need — the
[routine update checklist](#1-routine-update-checklist) covers 90% of the work.

- **Project:** Adnan Mansha — personal portfolio
- **Stack:** ASP.NET Core MVC (.NET 10), no client-side framework
- **Repository:** <https://github.com/AdnanMansha64/Portfolio-Website>
- **Live (GitHub Pages):** <https://adnanmansha64.github.io/Portfolio-Website/>

---

## 0. How this project is wired

There is **one** source of truth for the page and **one** generated copy of it:

```
Views/Home/Index.cshtml   ← the page (edit this)
wwwroot/css/portfolio.css ← all styling (edit this)
wwwroot/js/portfolio.js   ← all behaviour (edit this)
        │
        │  ./export-static.sh  (renders the view, rewrites asset URLs)
        ▼
index.html                ← GENERATED. Never edit by hand.
```

**Why both exist.** GitHub Pages only serves static files — it cannot execute
ASP.NET Core. So the MVC app is the real project, and `index.html` is a
rendered snapshot of it that Pages can serve. Editing `index.html` directly
means your change is silently thrown away on the next export.

---

## 1. Routine update checklist

Run through this every time you change the site:

```bash
# 1. Edit content/styles/behaviour
#    Views/Home/Index.cshtml · wwwroot/css/portfolio.css · wwwroot/js/portfolio.js

# 2. Check it locally
dotnet run
#    → open the printed http://localhost:#### URL

# 3. Regenerate the static copy GitHub Pages serves
./export-static.sh

# 4. Commit BOTH the source change and the regenerated index.html
git add -A
git commit -m "Describe the change"
git push
```

> **Step 3 is not optional.** Skip it and the live Pages site keeps showing the
> old content while the repo shows the new content.

---

## 2. Local development

### Prerequisites
- [.NET SDK 10.0+](https://dotnet.microsoft.com/download) — verify with `dotnet --version`
- Python 3 (ships with macOS/most Linux) — only used by `export-static.sh`

### Commands

| Task | Command |
|---|---|
| Run with hot reload | `dotnet watch` |
| Run once | `dotnet run` |
| Run on a fixed port | `dotnet run --urls http://localhost:5301` |
| Build only | `dotnet build` |
| Release build | `dotnet publish -c Release -o ./publish` |
| Regenerate `index.html` | `./export-static.sh` |

The static export defaults to port 5399; override with `PORT=1234 ./export-static.sh`.

---

## 3. Where to change what

| I want to change… | File | Notes |
|---|---|---|
| Any text, section, job, project | `Views/Home/Index.cshtml` | Single view, top to bottom |
| Email / phone / profile URLs | `Views/Home/Index.cshtml` | The `const string` block at the very top — change once, used everywhere |
| Colours, fonts, spacing | `wwwroot/css/portfolio.css` | Design tokens are in the `:root` block (§1) |
| Light-theme colours | `wwwroot/css/portfolio.css` | The `[data-theme='light']` block |
| Slider / modal / theme behaviour | `wwwroot/js/portfolio.js` | One `init*()` function per feature |
| Page title, meta, SEO, social preview | `Views/Home/Index.cshtml` | `<head>` section |
| Favicon | `wwwroot/favicon.ico` | Replace the file |

### Adding a new project card

1. Copy an existing `<div class="slide">…</div>` block in the Projects section.
2. Give its button a unique `data-modal="proj-yourname"`.
3. Add a matching `<div id="proj-yourname">` in the **modal content sources**
   block near the bottom of the view.
4. Done — the slider recounts slides and rebuilds its dots automatically.

### Adding an icon

Icons are an inline SVG sprite (no icon font, no CDN). Add a `<symbol
id="i-yourname" viewBox="0 0 24 24">` to the sprite at the top of the view,
then use it anywhere:

```html
<svg class="icon"><use href="#i-yourname"></use></svg>
```

Use `class="icon icon--solid"` for filled (brand) icons.

---

## 4. Publishing to GitHub Pages

### One-time setup

1. Open **Settings → Pages**: <https://github.com/AdnanMansha64/Portfolio-Website/settings/pages>
2. **Source:** `Deploy from a branch`
3. **Branch:** `master` · **Folder:** `/ (root)` → **Save**
4. Wait ~1 minute. The live URL appears in that same settings panel:
   `https://adnanmansha64.github.io/Portfolio-Website/`

### Every deploy after that

Pages republishes automatically on every push to `master`. Just make sure
`index.html` was regenerated (§1, step 3) before you pushed.

### Verifying a deploy

```bash
curl -sI https://adnanmansha64.github.io/Portfolio-Website/ | head -1   # expect 200
```

Hard-refresh (<kbd>Cmd/Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>R</kbd>) if you still
see the old page — Pages caches aggressively.

---

## 5. Hosting the real MVC app (optional)

GitHub Pages serves only the static snapshot. To put the actual ASP.NET Core
app online — server-rendered, able to grow a contact form, an API or a CMS —
deploy it to a .NET host:

| Option | Cost | Notes |
|---|---|---|
| Azure App Service | Free F1 tier available | `az webapp up --runtime "DOTNET:10"` — tightest .NET integration |
| Render / Railway | Free tier | Point at the repo, set build `dotnet publish -c Release` |
| Fly.io | Free allowance | Needs a `Dockerfile` |
| Any VPS | ~€4/mo | `dotnet publish` + nginx reverse proxy + systemd |

The repo stays the same either way; only `index.html` is Pages-specific.

---

## 6. Troubleshooting

| Symptom | Cause / fix |
|---|---|
| Live site shows old content | `index.html` wasn't regenerated. Run `./export-static.sh`, commit, push. |
| Live site unstyled (plain text) | Asset paths broken. Re-run `./export-static.sh` — it warns about any absolute paths Pages can't serve. |
| `export-static.sh` hangs on "Waiting for app" | Port busy. `PORT=5400 ./export-static.sh`, or check `/tmp/export-static.log`. |
| `./export-static.sh: Permission denied` | `chmod +x export-static.sh` |
| Razor error: `@` in content | Literal `@` must be escaped as `@@` in `.cshtml` (e.g. email addresses). |
| Icons render as blank boxes | `<use href="#i-x">` has no matching `<symbol id="i-x">` in the sprite. |
| Slider shows one card on desktop | Breakpoints live in `initSliders()` → `measure()` in `portfolio.js`. |
| Changed CSS, browser shows old | Dev: hard-refresh. Live: confirm you re-exported and pushed. |
| 404 on Pages after first setup | Pages needs ~1 min on first publish; confirm branch is `master`, folder `/ (root)`. |

---

## 7. Pre-publish checklist

- [ ] `dotnet build` → 0 warnings, 0 errors
- [ ] Page reviewed at desktop **and** phone width (~390px)
- [ ] Light **and** dark theme both checked (toggle in the nav)
- [ ] Every modal opens and closes (Esc, backdrop click, × button)
- [ ] Slider arrows, dots, swipe and arrow keys all work
- [ ] All external links open the right profile
- [ ] `./export-static.sh` run, `index.html` committed
- [ ] Pushed to `master`, live URL spot-checked

---

## 8. Related repository

The GitHub **profile README** (the "Hi 👋 I'm Adnan Mansha" page on
<https://github.com/AdnanMansha64>) lives in a separate special repository:
<https://github.com/AdnanMansha64/AdnanMansha>. It is intentionally **not**
part of this project — editing it here has no effect. Update it in its own
repo, and keep the portfolio link in it pointing at the live Pages URL.
