# Setup & maintenance guide

Operational handbook for this repository. Read the section you need — the
[routine update checklist](#1-routine-update-checklist) covers 90% of the work.

- **Project:** Adnan Mansha — personal portfolio
- **Stack:** ASP.NET Core MVC (.NET 10), no client-side framework
- **Repository:** <https://github.com/AdnanMansha64/Portfolio-Website>
- **Live (GitHub Pages):** <https://adnanmansha64.github.io/Portfolio-Website/>

---

## 0. How this project is wired

There is exactly **one** copy of the page, and it is the Razor view:

```
Views/Home/Index.cshtml     ← THE page (edit this)
wwwroot/css/portfolio.css   ← all styling (edit this)
wwwroot/js/portfolio.js     ← all behaviour (edit this)
        │
        │   ./export-static.sh — renders the view through the real app,
        │   rewrites asset URLs, copies wwwroot
        ▼
_site/                      ← build output: gitignored, never committed
        │
        │   .github/workflows/deploy-pages.yml (runs on every push to master)
        ▼
GitHub Pages                ← the live site
```

**Why a build step.** GitHub Pages only serves static files — it cannot execute
ASP.NET Core. Rather than keep a second hand-maintained HTML copy in the repo
(which drifts out of sync the moment you forget to update it), CI renders the
view and publishes the result. The repository stays single-source.

---

## 1. Routine update checklist

```bash
# 1. Edit content/styles/behaviour
#    Views/Home/Index.cshtml · wwwroot/css/portfolio.css · wwwroot/js/portfolio.js

# 2. Check it locally
dotnet watch
#    → opens http://localhost:5277 with hot reload

# 3. Commit and push — CI renders and deploys to Pages automatically
git add -A
git commit -m "Describe the change"
git push
```

That's it. There is no static file to regenerate by hand and nothing extra to
remember. Watch the deploy at
[Actions](https://github.com/AdnanMansha64/Portfolio-Website/actions); it takes
about a minute.

> Want to see exactly what Pages will serve before pushing?
> `./export-static.sh && open _site/index.html`

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
| Preview the static build | `./export-static.sh` → `_site/index.html` |
| Release build (for a .NET host) | `dotnet publish -c Release -o ./publish` |

`export-static.sh` uses port 5399; override with `PORT=1234 ./export-static.sh`.
It fails loudly if any asset reference in the generated page doesn't resolve, so
a green run means Pages will not 404.

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
| Deployment steps | `.github/workflows/deploy-pages.yml` | |

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
2. Under **Build and deployment → Source**, select **GitHub Actions**
   *(not "Deploy from a branch" — the site is built by the workflow)*
3. Push to `master`, or trigger **Deploy to GitHub Pages** manually from the
   Actions tab.
4. The live URL appears in the workflow run and in the Pages settings panel:
   `https://adnanmansha64.github.io/Portfolio-Website/`

### Every deploy after that

Automatic on every push to `master`. No manual step.

### Verifying a deploy

```bash
curl -sI https://adnanmansha64.github.io/Portfolio-Website/ | head -1   # expect 200
```

Hard-refresh (<kbd>Cmd/Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>R</kbd>) if you still
see the old page — Pages caches aggressively.

---

## 5. Hosting the real MVC app (optional)

Pages serves a static render. To put the actual ASP.NET Core app online —
server-rendered, able to grow a contact form, an API or a CMS — deploy it to a
.NET host:

| Option | Cost | Notes |
|---|---|---|
| Azure App Service | Free F1 tier available | `az webapp up --runtime "DOTNET:10"` — tightest .NET integration |
| Render / Railway | Free tier | Point at the repo, build `dotnet publish -c Release` |
| Fly.io | Free allowance | Needs a `Dockerfile` |
| Any VPS | ~€4/mo | `dotnet publish` + nginx reverse proxy + systemd |

Nothing in the repo is Pages-specific except `export-static.sh` and the
workflow, so both setups can run side by side.

---

## 6. Troubleshooting

| Symptom | Cause / fix |
|---|---|
| Live site shows old content | Check the [Actions](https://github.com/AdnanMansha64/Portfolio-Website/actions) run — a failed deploy leaves the previous version up. Then hard-refresh. |
| Deploy fails: "Pages site not found" | Pages **Source** isn't set to **GitHub Actions** (§4). |
| Live site unstyled (plain text) | An asset path didn't resolve. `./export-static.sh` locally — it lists every reference and exits non-zero on a miss. |
| `export-static.sh` hangs on "Waiting for app" | Port busy. `PORT=5400 ./export-static.sh`, or read `/tmp/export-static.log`. |
| `./export-static.sh: Permission denied` | `chmod +x export-static.sh` |
| Razor error around `@` | Literal `@` must be escaped as `@@` in `.cshtml` (e.g. email addresses). |
| Icons render as blank boxes | `<use href="#i-x">` has no matching `<symbol id="i-x">` in the sprite. |
| Slider shows one card on desktop | Breakpoints live in `initSliders()` → `measure()` in `portfolio.js`. |
| Changed CSS, browser shows old | Dev: hard-refresh. The MVC app fingerprints assets, so this is browser cache only. |
| Edited `_site/` and nothing persisted | `_site/` is a build output and is wiped on every export. Edit the view instead. |

---

## 7. Pre-publish checklist

- [ ] `dotnet build` → 0 warnings, 0 errors
- [ ] Page reviewed at desktop **and** phone width (~390px)
- [ ] Light **and** dark theme both checked (toggle in the nav)
- [ ] Every modal opens and closes (Esc, backdrop click, × button)
- [ ] Slider arrows, dots, swipe and arrow keys all work
- [ ] All external links open the right profile
- [ ] `./export-static.sh` passes (its reference check is green)
- [ ] Pushed to `master`; Actions run green; live URL spot-checked

---

## 8. Related repository

The GitHub **profile README** (the "Hi 👋 I'm Adnan Mansha" page on
<https://github.com/AdnanMansha64>) lives in a separate special repository:
<https://github.com/AdnanMansha64/AdnanMansha>. It is intentionally **not**
part of this project — editing it here has no effect. Update it in its own
repo, and keep the portfolio link in it pointing at the live Pages URL.
