<div align="center">

# Adnan Mansha — Portfolio

**A single-page developer portfolio built with ASP.NET Core MVC — no client-side framework, no CSS framework, no icon font.**

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

It is deliberately built the way a backend developer would build it: the whole
page is server-rendered from one Razor view, every interaction is ~400 lines of
dependency-free JavaScript, and the icons are an inline SVG sprite. **Zero npm
packages, zero runtime CDN dependencies** apart from the web fonts.

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
| **Fully responsive** | Single-column from 600px down, with a collapsing mobile nav |
| **Accessible** | Skip link, ARIA labels, keyboard-operable everything, visible focus rings |
| **Respects preferences** | Honours `prefers-reduced-motion` and `prefers-color-scheme` |
| **Print-friendly** | Dedicated print stylesheet — the page prints as a clean CV |
| **SEO ready** | Descriptive meta tags, Open Graph and Twitter card data |

## Tech stack

**Backend** · ASP.NET Core MVC 10 · C# 12 · Razor
**Frontend** · Hand-written CSS (custom properties, grid, flexbox) · Vanilla ES5-compatible JavaScript · Inline SVG sprite
**Tooling** · .NET CLI · `MapStaticAssets` (build-time fingerprinting + compression) · Bash/Python static exporter
**Hosting** · GitHub Pages (static snapshot) · any .NET host for the live app

## Project structure

```
Portfolio-Website/
├── Controllers/
│   └── HomeController.cs       # The single controller — one Index action
├── Views/
│   ├── Home/
│   │   └── Index.cshtml        # The single view — entire page + icon sprite + modal content
│   └── _ViewImports.cshtml     # Tag helper registration
├── wwwroot/
│   ├── css/portfolio.css       # Design system + all components
│   ├── js/portfolio.js         # Theme, slider, modals, reveals, counters
│   └── favicon.ico
├── Program.cs                  # Minimal startup — MVC + static assets
├── PortfolioWebsite.csproj
├── export-static.sh            # Renders the view → index.html for GitHub Pages
├── index.html                  # GENERATED static snapshot (do not edit)
├── SETUP.md                    # Setup, maintenance and deployment guide
└── README.md
```

## Quick start

```bash
git clone https://github.com/AdnanMansha64/Portfolio-Website.git
cd Portfolio-Website
dotnet run
```

Then open the `http://localhost:####` URL printed in the terminal.

For hot reload while editing, use `dotnet watch` instead.

> **Requires** the [.NET SDK 10.0+](https://dotnet.microsoft.com/download).

## Updating the site

The MVC view is the source of truth; `index.html` is generated from it. After
any change to the view, CSS or JS:

```bash
./export-static.sh     # re-renders index.html for GitHub Pages
git add -A && git commit -m "…" && git push
```

Full details — including where to change what, how to add a project card, and
deployment options — are in **[SETUP.md](SETUP.md)**.

## Architecture notes

A few decisions worth explaining, since they're deliberate rather than accidental:

- **One view, one controller.** The portfolio is a single page of static
  presentational content. Splitting it into partials or a view-model layer would
  add indirection without removing any duplication.
- **Inline SVG sprite over an icon font.** 32 icons in ~6 KB of markup, styled
  with `currentColor` and crisp at any size — versus a ~100 KB external
  stylesheet plus font files and a flash of invisible icons.
- **No CSS/JS framework.** The page needs a design system, a carousel and a
  modal. All three are a few hundred lines each, and writing them keeps the
  payload tiny and the behaviour exactly as intended.
- **`index.html` is committed, not gitignored.** GitHub Pages serves from the
  repository, so the generated file has to be in version control. The banner at
  the top of it and the `export-static.sh` workflow keep it from being edited by
  mistake.
- **Dark theme is the default.** Light theme overrides a single `[data-theme]`
  block, so there is exactly one place to keep the two palettes in sync.

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
