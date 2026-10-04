<div align="center">

# Adnan Mansha — Portfolio

**A single-page developer portfolio served by ASP.NET Core — no client-side framework, no CSS framework, no icon font, no build step.**

[![.NET](https://img.shields.io/badge/.NET-10.0-512BD4?logo=dotnet&logoColor=white)](https://dotnet.microsoft.com/)
[![ASP.NET Core MVC](https://img.shields.io/badge/ASP.NET%20Core-MVC-5C2D91?logo=dotnet&logoColor=white)](https://learn.microsoft.com/aspnet/core/mvc/overview)
[![C#](https://img.shields.io/badge/C%23-12-239120?logo=csharp&logoColor=white)](https://learn.microsoft.com/dotnet/csharp/)
[![Vanilla JS](https://img.shields.io/badge/JavaScript-vanilla-F7DF1E?logo=javascript&logoColor=black)](#)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-live-222222?logo=githubpages&logoColor=white)](https://adnanmansha64.github.io/Portfolio-Website/)

[**View live site**](https://adnanmansha64.github.io/Portfolio-Website/) ·
[Setup & maintenance guide](SETUP.md) ·
[LinkedIn](https://www.linkedin.com/in/adnan-mansha-278a46108/) ·
[Xing](https://www.xing.com/profile/Adnan_Mansha/web_profiles)

</div>

---

## About

The personal portfolio of **Adnan Mansha** — a software developer with 4+ years
in C#, .NET, ASP.NET Core and WPF/MVVM, based in Erfurt, Germany.

It is deliberately built the way a backend developer would build it: the entire
page is **one HTML file**, every interaction is ~400 lines of dependency-free
JavaScript, and the icons are an inline SVG sprite. **Zero npm packages, zero
build step, zero runtime CDN dependencies** apart from the web fonts.

## Features

| | |
|---|---|
| **Theme switching** | Light/dark toggle, persisted in `localStorage`, defaults to the OS preference |
| **Project slider** | Responsive carousel (3 → 2 → 1 cards), with arrows, dots, keyboard arrows and touch swipe |
| **Detail popups** | 12 accessible modals — focus trap, `Esc` to close, backdrop click, focus restored on close |
| **Scroll animations** | `IntersectionObserver` reveals, animated skill bars and counting stat tiles |
| **Typewriter hero** | Cycles through role titles with a blinking caret |
| **Scroll spy** | Nav highlights the section you're reading |
| **Copy to clipboard** | One tap copies email or phone, with a toast confirmation |
| **Fully responsive** | Grids stack at 1000px, nav collapses at 860px, slider drops to one card under 680px |
| **Accessible** | Skip link, ARIA labels, keyboard-operable everything, visible focus rings |
| **Respects preferences** | Honours `prefers-reduced-motion` and `prefers-color-scheme` |
| **Print-friendly** | Dedicated print stylesheet — the page prints as a clean CV |
| **SEO ready** | Descriptive meta tags, Open Graph and Twitter card data |

## Tech stack

**Backend** · ASP.NET Core 10 · C# 12 · controller routing over a static web root
**Frontend** · Hand-written CSS (custom properties, grid, flexbox) · Vanilla JavaScript (ES5 syntax, modern browser APIs) · Inline SVG sprite
**Tooling** · .NET CLI only — no bundler, no npm, no generator
**Hosting** · GitHub Pages (`/docs` folder) · any .NET host for the app itself

## Project structure

```
Portfolio-Website/
├── docs/                       # Web root AND the GitHub Pages publishing folder
│   ├── index.html              #   THE page — the only copy (edit this)
│   ├── css/portfolio.css       #   Design system + all components
│   ├── js/portfolio.js         #   Theme, slider, modals, reveals, counters
│   ├── favicon.ico
│   └── .nojekyll               #   Serve files as-is, skip Jekyll
├── Controllers/
│   └── HomeController.cs       # The single controller — returns docs/index.html
├── .github/workflows/
│   └── verify-static.yml       # Build + checks every asset reference resolves
├── Program.cs                  # Minimal startup — web root = docs/, static files
├── PortfolioWebsite.csproj
├── SETUP.md                    # Setup, maintenance and deployment guide
└── README.md
```

**One page, one copy.** `docs/index.html` is served two ways — by this app
(`Program.cs` sets the web root to `docs/`) and by GitHub Pages (whose publishing
folder is `/docs`). The file you edit is byte-for-byte the file that goes live,
so there is nothing to regenerate and nothing that can drift out of sync.

## Quick start

```bash
git clone https://github.com/AdnanMansha64/Portfolio-Website.git
cd Portfolio-Website
dotnet run
```

Then open <http://localhost:5277> (the port is set in
`Properties/launchSettings.json`).

Since the page is plain static HTML, you can also just open `docs/index.html`
in a browser — no server needed.

> **Requires** the [.NET SDK 10.0+](https://dotnet.microsoft.com/download).

## Updating the site

Edit `docs/index.html`, commit, push. Pages republishes automatically:

```bash
git add -A && git commit -m "…" && git push
```

There is no export or build step to remember.

Full details — including where to change what, how to add a project card, and
deployment options — are in **[SETUP.md](SETUP.md)**.

## Architecture notes

A few decisions worth explaining, since they're deliberate rather than accidental:

- **One file, served two ways.** GitHub Pages cannot execute Razor, so a
  server-rendered view would have to be mirrored into a committed static copy —
  two copies of the same page that drift apart. Publishing from `/docs` and
  pointing the app's web root at the same directory removes the duplicate
  entirely. The trade-off is deliberate: no Razor templating, just HTML.
- **Inline SVG sprite over an icon font.** 32 icons in ~6 KB of markup, styled
  with `currentColor` and crisp at any size — versus a ~100 KB external
  stylesheet plus font files and a flash of invisible icons.
- **No CSS/JS framework.** The page needs a design system, a carousel and a
  modal. All three are a few hundred lines each, and writing them keeps the
  payload tiny and the behaviour exactly as intended.
- **Dark theme is the default.** Light theme overrides a single `[data-theme]`
  block, so there is exactly one place to keep the two palettes in sync.
- **ES5 syntax, modern APIs.** The JavaScript avoids transpilation entirely —
  no build step, no bundler — but it does rely on `IntersectionObserver`,
  `navigator.clipboard` and `matchMedia`, so it targets current browsers rather
  than old ones. Each feature is wrapped so one failure can't break the page.

## Contact

**Adnan Mansha** — Software Developer (C# / .NET) · Erfurt, Germany

[![Email](https://img.shields.io/badge/Email-adnanmansha64@gmail.com-D14836?logo=gmail&logoColor=white)](mailto:adnanmansha64@gmail.com)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-adnan--mansha-0A66C2?logo=linkedin&logoColor=white)](https://www.linkedin.com/in/adnan-mansha-278a46108/)
[![Xing](https://img.shields.io/badge/Xing-Adnan__Mansha-026466?logo=xing&logoColor=white)](https://www.xing.com/profile/Adnan_Mansha/web_profiles)
[![GitHub](https://img.shields.io/badge/GitHub-AdnanMansha64-181717?logo=github&logoColor=white)](https://github.com/AdnanMansha64)

Open to C#/.NET backend and full-stack roles in Germany. Permanent residency in
place — no visa sponsorship required.

## License

The source code in this repository is free to reference and learn from. The
personal content — CV text, work history and contact details — belongs to Adnan
Mansha; please don't republish it as your own.
