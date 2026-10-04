# Setup & maintenance guide

Operational handbook for this repository. Read the section you need — the
[routine update checklist](#1-routine-update-checklist) covers 90% of the work.

- **Project:** Adnan Mansha — personal portfolio
- **Stack:** ASP.NET Core MVC (.NET 10), no client-side framework
- **Repository:** <https://github.com/AdnanMansha64/Portfolio-Website>
- **Live (GitHub Pages):** <https://adnanmansha64.github.io/Portfolio-Website/>

---

## 0. How this project is wired

The Razor view is the **source** of the page. The `index.html` at the repository
root is **generated** from it — two files, one of which you never edit by hand:

```
Views/Home/Index.cshtml     ← THE page (edit this)
wwwroot/css/portfolio.css   ← all styling (edit this)
wwwroot/js/portfolio.js     ← all behaviour (edit this)
        │
        │   ./export-static.sh — renders the view through the real app and
        │   points its asset URLs at the existing wwwroot/ files
        ▼
index.html                  ← GENERATED. Commit it; never edit it.
        │
        ▼
GitHub Pages (master / root)  ← the live site
```

**Why a generated file.** GitHub Pages only serves static files — it cannot
execute ASP.NET Core. So the Razor view is the source and `index.html` is a
rendered snapshot of it, committed because Pages serves the repository directly.

The snapshot references `wwwroot/css/portfolio.css` and `wwwroot/js/portfolio.js`
rather than carrying its own copies, so the CSS and JS exist once.

> **`index.html` goes stale if you edit the view and don't re-run the export.**
> That is the one hazard of this layout, so CI guards it: the
> [Verify static export](https://github.com/AdnanMansha64/Portfolio-Website/actions)
> job re-renders the view and fails if the committed file differs.

---

## 1. Routine update checklist

```bash
# 1. Edit content/styles/behaviour
#    Views/Home/Index.cshtml · wwwroot/css/portfolio.css · wwwroot/js/portfolio.js

# 2. Check it locally
dotnet watch
#    → opens http://localhost:5277 with hot reload

# 3. Regenerate the file GitHub Pages serves
./export-static.sh

# 4. Commit BOTH the source change and the regenerated index.html
git add -A
git commit -m "Describe the change"
git push
```

> **Step 3 is not optional.** Skip it and the live site keeps showing the old
> page while the repo shows the new one. The CI check will go red on the next
> push to tell you, but it is quicker to just run the script.

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
| Regenerate `index.html` | `./export-static.sh` |
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
| Colours, fonts, spacing | `wwwroot/css/portfolio.css` | Design tokens are in the `:root` block at the top of that file |
| Light-theme colours | `wwwroot/css/portfolio.css` | The `[data-theme='light']` block |
| Slider / modal / theme behaviour | `wwwroot/js/portfolio.js` | One `init*()` function per feature |
| Page title, meta, SEO, social preview | `Views/Home/Index.cshtml` | `<head>` section |
| Favicon | `wwwroot/favicon.ico` | Replace the file |
| CI / staleness check | `.github/workflows/verify-static.yml` | There is no deploy job — Pages serves `master` / `(root)` directly |

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
4. Wait ~1 minute. The live URL appears in that panel:
   `https://adnanmansha64.github.io/Portfolio-Website/`

`.nojekyll` at the repository root tells Pages to serve the files as-is instead
of running them through Jekyll.

### Every deploy after that

Pages republishes automatically on every push to `master`. Just make sure
`index.html` was regenerated first (§1, step 3).

### Verifying a deploy

```bash
curl -s https://adnanmansha64.github.io/Portfolio-Website/ | grep -o '<title>[^<]*</title>'
```

Expect `Adnan Mansha — Software Developer | C# / .NET`. If you get
`Portfolio-Website`, Pages is rendering the README instead of the page — check
that `index.html` exists at the root of `master`.

Hard-refresh (<kbd>Cmd/Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>R</kbd>) if you still
see the old page — Pages caches aggressively.

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

Nothing in the repo is Pages-specific except `export-static.sh`, `index.html`
and `.nojekyll`, so both setups can run side by side.

---

## 6. Troubleshooting

| Symptom | Cause / fix |
|---|---|
| Live site shows old content | `index.html` was not regenerated before the push (§1, step 3), or Pages is still serving a cached copy — hard-refresh. |
| Live site shows the repo file list / README | No `index.html` at the root of `master`, so Pages fell back to Jekyll. Run `./export-static.sh` and commit it. |
| CI fails: "index.html is stale" | You changed the view/CSS/JS without re-exporting. Run `./export-static.sh`, commit, push. |
| Live site unstyled (plain text) | An asset path didn't resolve. `./export-static.sh` locally — it lists every reference and exits non-zero on a miss. |
| `export-static.sh` hangs on "Waiting for app" | Port busy. `PORT=5400 ./export-static.sh`, or read `/tmp/export-static.log`. |
| `./export-static.sh: Permission denied` | `chmod +x export-static.sh` |
| Razor error around `@` | Literal `@` must be escaped as `@@` in `.cshtml` (e.g. email addresses). |
| Icons render as blank boxes | `<use href="#i-x">` has no matching `<symbol id="i-x">` in the sprite. |
| Slider shows one card on desktop | Breakpoints live in `initSliders()` → `measure()` in `wwwroot/js/portfolio.js`. |
| Changed CSS, browser shows old | Dev: hard-refresh. The MVC app fingerprints assets, so this is browser cache only. |
| `Failed to bind to address ... 5277: address already in use` | Another instance is already running. `pkill -f "dotnet run"`, or use a different port: `dotnet run --urls http://localhost:5301`. |
| Run shows a "Hello World"/AngularJS page, or a **Home / Privacy** navbar | You are running a *different project*. Check the first line of `dotnet run` output: it must say `launch settings from …/Portfolio Website/Properties/launchSettings.json`. See §9. |
| Edited `index.html` and the change vanished | It is generated and overwritten on every export. Edit `Views/Home/Index.cshtml` instead. |

---

## 7. Pre-publish checklist

- [ ] `dotnet build` → 0 warnings, 0 errors
- [ ] Page reviewed at desktop **and** phone width (~390px)
- [ ] Light **and** dark theme both checked (toggle in the nav)
- [ ] Every modal opens and closes (Esc, backdrop click, × button)
- [ ] Slider arrows, dots, swipe and arrow keys all work
- [ ] All external links open the right profile
- [ ] `./export-static.sh` run and `index.html` committed
- [ ] Pushed to `master`; "Verify static export" green; live URL spot-checked

---

## 8. Related repository

The GitHub **profile README** (the "Hi 👋 I'm Adnan Mansha" page on
<https://github.com/AdnanMansha64>) lives in a separate special repository:
<https://github.com/AdnanMansha64/AdnanMansha>. It is intentionally **not**
part of this project — editing it here has no effect. Update it in its own
repo, and keep the portfolio link in it pointing at the live Pages URL.

---

## 9. Not to be confused with

There is an unrelated `~/HelloWorldMvcAngular/` folder on this machine: the stock
`dotnet new mvc` scaffold plus a toy AngularJS controller. It is **not** this
project — it is not a git repository, has no remote, and renders a
`{{ hello.message }}` page with a **Home / Privacy** navbar.

Both projects default to **port 5277**, so only one can run at a time, and
running the wrong one looks like the portfolio "not working".

Always confirm the first line of `dotnet run`:

```
Using launch settings from /…/Portfolio Website/Properties/launchSettings.json
```

If it says `HelloWorldMvcAngular`, you are in the wrong directory:

```bash
cd ~/Documents/A/Adnan/Git/Portfolio\ Website && dotnet watch
```

See also: [README.md](README.md) for the project overview and architecture notes.
