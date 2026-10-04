# Setup & maintenance guide

Operational handbook for this repository. Read the section you need — the
[routine update checklist](#1-routine-update-checklist) covers 90% of the work.

- **Project:** Adnan Mansha — personal portfolio
- **Stack:** AngularJS 1.8.3 · hand-written CSS · static hosting (no backend, no build step)
- **Repository:** <https://github.com/AdnanMansha64/Portfolio-Website>
- **Live (GitHub Pages):** <https://adnanmansha64.github.io/Portfolio-Website/>

---

## 0. How this project is wired

A static AngularJS single-page app. **Four files, no build step, no server.**

```
index.html          ← the AngularJS template (markup + SVG icon sprite)
css/portfolio.css   ← all styling, both themes
js/app.js           ← the AngularJS app: ALL page content + behaviour
favicon.ico
.nojekyll           ← tells Pages to serve the files as-is
     │
     ├── locally:  open index.html in a browser (no server needed)
     └── live:     GitHub Pages, branch master, folder / (root)
```

**Content lives in `js/app.js`, not in the markup.** Every list on the page —
skills, jobs, projects, education, certifications — is an array in the `CONTENT`
constant, rendered by `ng-repeat`. The markup describes *one* card of each kind;
AngularJS repeats it.

That is why `index.html` is ~28 KB instead of ~69 KB, and why the detail popups
no longer duplicate anything: a popup reads the same object as the card that
opened it.

**There is exactly one HTML file.** No Razor view, no generated copy, nothing to
keep in sync. The previous ASP.NET Core project was removed.

> **Caveat worth knowing:** AngularJS 1.x reached end-of-life in **January 2022**
> and receives no security patches. It is loaded from cdnjs. For a static
> portfolio with no user input and no authentication the practical risk is low,
> but it is a dead framework — see §7 if you later want to move off it.

---

## 1. Routine update checklist

```bash
# 1. Change content  →  js/app.js   (the CONTENT constant)
#    Change styling  →  css/portfolio.css
#    Change layout   →  index.html

# 2. Check it — just open the file, no server required
open index.html

# 3. Commit and push — Pages republishes automatically
git add -A
git commit -m "Describe the change"
git push
```

No build, no export, no regeneration. What you edit is what goes live.

---

## 2. Local development

There are no prerequisites — no .NET, no Node, no npm.

| Task | How |
|---|---|
| View the site | `open index.html` |
| View over HTTP (closer to production) | `python3 -m http.server 8000` → <http://localhost:8000> |
| Debug AngularJS | Browser devtools console; the app logs nothing by design |

Use the HTTP server rather than `file://` if you are testing anything
URL-related; `file://` has stricter rules for some browser APIs.

---

## 3. Where to change what

| I want to change… | File | Where exactly |
|---|---|---|
| Name, role titles, summary, email, phone, profile links | `js/app.js` | `CONTENT.profile` |
| The four "What I do" cards | `js/app.js` | `CONTENT.about` |
| Proficiency bars and percentages | `js/app.js` | `CONTENT.proficiencies` |
| Skill group cards and their tags | `js/app.js` | `CONTENT.skillGroups` |
| Jobs, their bullet points and popup detail | `js/app.js` | `CONTENT.jobs` |
| Projects, their descriptions and popup detail | `js/app.js` | `CONTENT.projects` |
| Degrees, certifications, languages | `js/app.js` | `CONTENT.education`, `.certifications`, `.languages` |
| Stat tiles (4+ years, 50+ tests…) | `js/app.js` | `CONTENT.stats` |
| Colours, fonts, spacing | `css/portfolio.css` | the `:root` block at the top |
| Light-theme colours | `css/portfolio.css` | the `[data-theme='light']` block |
| Slider / popup / theme behaviour | `js/app.js` | the directives at the bottom |
| Page title, meta, SEO, social preview | `index.html` | `<head>` |
| Section order or overall layout | `index.html` | the `<section>` blocks |
| Favicon | `favicon.ico` | replace the file |

### Adding a project

Append an object to `CONTENT.projects` in `js/app.js`:

```js
{
  icon: 'i-code',                       // any symbol id from the sprite
  title: 'My new project',
  context: 'Where it happened · year',
  desc: 'One or two sentences for the card.',
  tags: ['C#', 'Thing'],                // first tag is highlighted
  sections: [                           // rendered in the popup
    { heading: 'What I did', items: [
      { text: 'A sentence.' },
      { lead: 'Bold lead-in:', text: 'followed by detail.' }
    ]}
  ],
  stack: ['C#', 'Thing', 'Another']
}
```

No HTML to touch — the slider recounts slides and rebuilds its dots
automatically, and the popup is generated from the same object.

### Adding a job

Same idea, in `CONTENT.jobs`. Use `details: [...]` (a flat list) instead of
`sections`, and set `current: true` on the present role to get the amber dot.

### Adding an icon

Icons are an inline SVG sprite — no icon font, no extra request. Add a symbol in
`index.html`:

```html
<symbol id="i-yourname" viewBox="0 0 24 24"><path d="…"/></symbol>
```

Then reference it by id from data (`icon: 'i-yourname'`) or directly in markup:

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
4. The live URL appears in that panel:
   `https://adnanmansha64.github.io/Portfolio-Website/`

`.nojekyll` at the repository root stops Pages running the files through Jekyll.

### Every deploy after that

Automatic on every push to `master`. No manual step.

### Verifying a deploy

```bash
curl -s https://adnanmansha64.github.io/Portfolio-Website/ | grep -o '<title>[^<]*</title>'
```

Expect `Adnan Mansha — Software Developer | C# / .NET`. If you get
`Portfolio-Website`, Pages is rendering the README instead — check `index.html`
is at the root of `master` and the folder setting is `/ (root)`.

Note: `curl` only sees the un-rendered template, because AngularJS fills the
page in the browser. To check the *content* is live, open the URL in a browser.

Hard-refresh (<kbd>Cmd/Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>R</kbd>) if you still
see an old version — Pages caches aggressively.

---

## 5. Troubleshooting

| Symptom | Cause / fix |
|---|---|
| Page is blank, or shows raw `{{ }}` | AngularJS failed to load or the app threw. Open devtools → Console. A typo in `js/app.js` stops the whole app. |
| Blank page offline | AngularJS is loaded from cdnjs, so the page needs a network connection on first load. |
| One section is empty | Its array in `CONTENT` is empty or misnamed — the rest of the page keeps working. |
| A new card does not appear | Check for a missing comma between objects in the array; the console will name the line. |
| Icons render as blank boxes | The `icon:` value has no matching `<symbol id="…">` in the sprite. |
| Live site shows the repo file list / README | No `index.html` at the root of `master`, or the Pages folder is not `/ (root)` (§4). |
| Slider shows one card on desktop | Breakpoints live in `measure()` in `js/app.js` (1000px → 3 cards, 680px → 2). |
| Changed CSS, browser shows old | Hard-refresh. Nothing is fingerprinted, so this is browser cache. |
| Content missing from Google results | The page renders client-side; crawlers see the template. The `<head>` meta and the `<noscript>` block carry the key text. See §7. |

---

## 6. Pre-publish checklist

- [ ] Opened the page and seen every section render (no blank areas, no `{{ }}`)
- [ ] Browser console clean — no AngularJS errors
- [ ] Reviewed at desktop **and** phone width (~390px)
- [ ] Light **and** dark theme both checked (toggle in the nav)
- [ ] Every popup opens and closes (Esc, backdrop click, × button)
- [ ] Slider arrows, dots, swipe and arrow keys all work
- [ ] All external links open the right profile
- [ ] Pushed to `master`; live URL opened in a browser

---

## 7. Known trade-offs

Recorded so they are a choice rather than a surprise:

1. **AngularJS 1.x is end-of-life** (January 2022, no security patches). Fine for
   a static page with no inputs; not something to build new work on. Moving off it
   means either plain JavaScript (the page needs no framework) or a rewrite in
   modern Angular, which requires Node and a build step.
2. **Client-side rendering costs SEO.** The HTML a crawler downloads is a
   template; the content arrives via JavaScript. Google executes JS but indexes
   it less reliably. Mitigated by the static `<title>`/`<meta>`/Open Graph tags
   and the `<noscript>` summary, both of which are in the raw HTML.
3. **No backend.** A working contact form, an API or a database would need a host
   that runs code — Azure, Render, Fly.io or a VPS. Pages serves static files only.

---

## 8. Not to be confused with

There is an unrelated `~/HelloWorldMvcAngular/` folder on this machine: a stock
`dotnet new mvc` scaffold plus a toy AngularJS controller. It is **not** this
project — it is not a git repository, has no remote, and renders a
`{{ hello.message }}` page with a **Home / Privacy** navbar.

This project no longer uses .NET at all, so there is nothing here to `dotnet
run`. If you are running `dotnet`, you are in the wrong folder.

---

## 9. Related repository

The GitHub **profile README** (the "Hi 👋 I'm Adnan Mansha" page on
<https://github.com/AdnanMansha64>) lives in a separate special repository:
<https://github.com/AdnanMansha64/AdnanMansha>. It is intentionally **not** part
of this project — editing it here has no effect. Update it in its own repo, and
keep the portfolio link in it pointing at the live Pages URL.

See also: [README.md](README.md) for the project overview and architecture notes.
