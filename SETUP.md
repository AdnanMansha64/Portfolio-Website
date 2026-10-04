# Setup & maintenance guide

Operational handbook for this repository. Read the section you need — the
[routine update checklist](#1-routine-update-checklist) covers 90% of the work.

- **Project:** Adnan Mansha — personal portfolio
- **Stack:** ASP.NET Core (.NET 10), no client-side framework
- **Repository:** <https://github.com/AdnanMansha64/Portfolio-Website>
- **Live (GitHub Pages):** <https://adnanmansha64.github.io/Portfolio-Website/>

---

## 0. How this project is wired

**There is exactly one copy of the page: `docs/index.html`.** Both the app and
GitHub Pages serve that same file.

```
docs/
├── index.html          ← THE page (edit this)
├── css/portfolio.css   ← all styling (edit this)
├── js/portfolio.js     ← all behaviour (edit this)
└── favicon.ico
     │
     ├── locally:  dotnet run  → web root = docs/  → http://localhost:5277
     └── live:     GitHub Pages, publishing folder = /docs
```

**Why `docs/` and not `wwwroot/`.** GitHub Pages can only publish from a
branch's root or from a folder named exactly `/docs`. Pointing the ASP.NET app's
web root at `docs/` therefore makes one directory serve both purposes — the file
you edit is byte-for-byte the file that goes live. Asset URLs inside the page are
relative (`css/portfolio.css`), so they resolve identically whether the page is
served at `/` by the app or at `/Portfolio-Website/` by Pages.

**No build step, no generated files, nothing to keep in sync.** Earlier versions
of this project rendered a Razor view into a second static copy; that copy and
the script which produced it are gone.

---

## 1. Routine update checklist

```bash
# 1. Edit the page, the styles or the behaviour
#    docs/index.html · docs/css/portfolio.css · docs/js/portfolio.js

# 2. Check it locally
dotnet run
#    → http://localhost:5277

# 3. Commit and push — Pages republishes automatically
git add -A
git commit -m "Describe the change"
git push
```

Nothing to regenerate. The file you edited is the file that goes live.

---

## 2. Local development

### Prerequisites
- [.NET SDK 10.0+](https://dotnet.microsoft.com/download) — verify with `dotnet --version`

### Commands

| Task | Command |
|---|---|
| Run | `dotnet run` |
| Run on a different port | `dotnet run --urls http://localhost:5301` |
| Build | `dotnet build` |
| Release build (for a .NET host) | `dotnet publish -c Release -o ./publish` |

You can also open `docs/index.html` directly in a browser — it is a plain static
page and needs no server. Running the app is only necessary to exercise the
ASP.NET routing.

---

## 3. Where to change what

| I want to change… | File | Notes |
|---|---|---|
| Any text, section, job, project | `docs/index.html` | One file, top to bottom |
| Email / phone / profile URLs | `docs/index.html` | Search for `mailto:`, `linkedin`, `xing`, `github` |
| Colours, fonts, spacing | `docs/css/portfolio.css` | Design tokens are in the `:root` block at the top |
| Light-theme colours | `docs/css/portfolio.css` | The `[data-theme='light']` block |
| Slider / modal / theme behaviour | `docs/js/portfolio.js` | One `init*()` function per feature |
| Page title, meta, SEO, social preview | `docs/index.html` | `<head>` section |
| Favicon | `docs/favicon.ico` | Replace the file |
| Routing / startup | `Program.cs`, `Controllers/HomeController.cs` | |
| CI checks | `.github/workflows/verify-static.yml` | Build + asset-reference check |

### Adding a new project card

1. Copy an existing `<div class="slide">…</div>` block in the Projects section.
2. Give its button a unique `data-modal="proj-yourname"`.
3. Add a matching `<div id="proj-yourname">` in the **modal content sources**
   block near the bottom of the file.
4. Done — the slider recounts slides and rebuilds its dots automatically.

### Adding an icon

Icons are an inline SVG sprite (no icon font, no CDN). Add a `<symbol
id="i-yourname" viewBox="0 0 24 24">` to the sprite at the top of the page, then
use it anywhere:

```html
<svg class="icon"><use href="#i-yourname"></use></svg>
```

Use `class="icon icon--solid"` for filled (brand) icons.

---

## 4. Publishing to GitHub Pages

### One-time setup

1. Open **Settings → Pages**: <https://github.com/AdnanMansha64/Portfolio-Website/settings/pages>
2. **Source:** `Deploy from a branch`
3. **Branch:** `master` · **Folder:** **`/docs`** → **Save**
   *(`/docs`, **not** `/ (root)` — the page lives in `docs/`)*
4. Wait ~1 minute. The live URL appears in that panel:
   `https://adnanmansha64.github.io/Portfolio-Website/`

`docs/.nojekyll` tells Pages to serve the files as-is instead of running them
through Jekyll.

### Every deploy after that

Automatic on every push to `master`. No manual step.

### Verifying a deploy

```bash
curl -s https://adnanmansha64.github.io/Portfolio-Website/ | grep -o '<title>[^<]*</title>'
```

Expect `Adnan Mansha — Software Developer | C# / .NET`. If you get
`Portfolio-Website`, Pages is rendering the README instead of the page — the
publishing folder is still `/ (root)` and needs to be `/docs` (step 3).

Hard-refresh (<kbd>Cmd/Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>R</kbd>) if you still
see the old page — Pages caches aggressively.

---

## 5. Hosting the real ASP.NET app (optional)

Pages serves the page as a static file. To run the actual ASP.NET Core app —
which is what you would need to add a working contact form, an API or a
database — deploy it to a .NET host:

| Option | Cost | Notes |
|---|---|---|
| Azure App Service | Free F1 tier available | `az webapp up --runtime "DOTNET:10"` — tightest .NET integration |
| Render / Railway | Free tier | Point at the repo, build `dotnet publish -c Release` |
| Fly.io | Free allowance | Needs a `Dockerfile` |
| Any VPS | ~€4/mo | `dotnet publish` + nginx reverse proxy + systemd |

Both setups can run side by side — they serve the same `docs/` directory.

---

## 6. Troubleshooting

| Symptom | Cause / fix |
|---|---|
| Live site shows the repo file list / README | Pages publishing folder is `/ (root)`; it must be **`/docs`** (§4, step 3). |
| Live site shows old content | Pages caches — hard-refresh. Check the [Actions](https://github.com/AdnanMansha64/Portfolio-Website/actions) run went green. |
| Live site unstyled (plain text) | An asset path is wrong. The CI job lists every reference and fails on a miss; run `dotnet run` locally and check the browser console. |
| `Failed to bind to address ... 5277: address already in use` | Another instance is running. `pkill -f "dotnet run"`, or `dotnet run --urls http://localhost:5301`. |
| Run shows a "Hello World"/AngularJS page, or a **Home / Privacy** navbar | You are running a *different project*. See §8. |
| Icons render as blank boxes | `<use href="#i-x">` has no matching `<symbol id="i-x">` in the sprite. |
| Slider shows one card on desktop | Breakpoints live in `initSliders()` → `measure()` in `docs/js/portfolio.js`. |
| Changed CSS, browser shows old | Hard-refresh. Static files are served without fingerprinting, so this is browser cache. |
| `404` on `/css/portfolio.css` locally | The app's web root is `docs/` (set in `Program.cs`). The file must be at `docs/css/portfolio.css`. |

---

## 7. Pre-publish checklist

- [ ] `dotnet build` → 0 warnings, 0 errors
- [ ] Page reviewed at desktop **and** phone width (~390px)
- [ ] Light **and** dark theme both checked (toggle in the nav)
- [ ] Every modal opens and closes (Esc, backdrop click, × button)
- [ ] Slider arrows, dots, swipe and arrow keys all work
- [ ] All external links open the right profile
- [ ] Pushed to `master`; "Build & verify" green; live URL spot-checked

---

## 8. Not to be confused with

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
cd ~/Documents/A/Adnan/Git/Portfolio\ Website && dotnet run
```

---

## 9. Related repository

The GitHub **profile README** (the "Hi 👋 I'm Adnan Mansha" page on
<https://github.com/AdnanMansha64>) lives in a separate special repository:
<https://github.com/AdnanMansha64/AdnanMansha>. It is intentionally **not**
part of this project — editing it here has no effect. Update it in its own
repo, and keep the portfolio link in it pointing at the live Pages URL.

See also: [README.md](README.md) for the project overview and architecture notes.
