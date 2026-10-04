<div align="center">

# Adnan Mansha — Portfolio

**A data-driven single-page developer portfolio built with AngularJS — no build step, no backend, no CSS framework, no icon font.**

[![AngularJS](https://img.shields.io/badge/AngularJS-1.8.3-B52E31?logo=angularjs&logoColor=white)](https://angularjs.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES5-F7DF1E?logo=javascript&logoColor=black)](#)
[![CSS](https://img.shields.io/badge/CSS-hand--written-1572B6?logo=css3&logoColor=white)](#)
[![No build step](https://img.shields.io/badge/build%20step-none-4FB3E8)](#)
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

The whole site is **four files and no toolchain**: an AngularJS template, one
stylesheet, one app file, and a favicon. Clone it and double-click
`index.html` — there is nothing to install, compile or serve.

## How it works

Every list on the page is **data, not markup**. Skills, jobs, projects,
education and certifications are arrays in the `CONTENT` constant in
[`js/app.js`](js/app.js), rendered with `ng-repeat`:

```js
CONTENT.projects = [
  { icon: 'i-branch', title: 'TCP/IP communication layer refactor',
    context: 'KLA Co. · production system',
    desc: '…', tags: ['C#', 'TCP/IP'], sections: [ … ], stack: [ … ] },
  …
];
```

The markup describes **one** card of each kind and AngularJS repeats it. Two
things fall out of that:

- `index.html` is **28 KB instead of 69 KB** — the repetition is gone.
- The detail popups duplicate **nothing**. A popup renders the same object as
  the card that opened it, so a card and its popup can never disagree.

Adding a project means appending one object to an array. No HTML to copy, no
second place to update.

## Features

| | |
|---|---|
| **Data-driven content** | Every section renders from arrays in `js/app.js` via `ng-repeat` |
| **Theme switching** | Light/dark toggle, persisted in `localStorage`, defaults to the OS preference |
| **Project slider** | Responsive carousel (3 → 2 → 1 cards) with arrows, dots, keyboard arrows and touch swipe |
| **Detail popups** | Driven from the same data as the cards — focus trap, `Esc` to close, backdrop click, focus restored |
| **Scroll animations** | `IntersectionObserver` reveals, animated proficiency bars, counting stat tiles |
| **Typewriter hero** | Cycles through role titles with a blinking caret |
| **Scroll spy** | Nav highlights the section you're reading |
| **Copy to clipboard** | One tap copies email or phone, with a toast confirmation |
| **Fully responsive** | Grids stack at 1000px, nav collapses at 860px, slider drops to one card under 680px |
| **Accessible** | Skip link, ARIA labels, keyboard-operable everything, visible focus rings |
| **Respects preferences** | Honours `prefers-reduced-motion` and `prefers-color-scheme` |
| **Print-friendly** | Dedicated print stylesheet — the page prints as a clean CV |
| **SEO / sharing** | Static `<title>`, description, canonical and Open Graph tags, plus a `<noscript>` summary |

## Tech stack

**Framework** · AngularJS 1.8.3 (from cdnjs) — module, controller, constant, factory, 7 custom directives
**Styling** · Hand-written CSS: custom properties, grid, flexbox, two themes
**Icons** · Inline SVG sprite, 32 symbols in ~6 KB, styled with `currentColor`
**Tooling** · None. No npm, no bundler, no transpiler, no generator.
**Hosting** · GitHub Pages (branch `master`, folder `/ (root)`)

## Project structure

```
Portfolio-Website/
├── index.html              # AngularJS template + SVG icon sprite (~28 KB)
├── css/
│   └── portfolio.css       # Design system, components, both themes, print
├── js/
│   └── app.js              # The app: ALL page content + 7 directives
├── favicon.ico
├── .nojekyll               # Serve files as-is, skip Jekyll
├── .github/workflows/
│   └── verify-static.yml   # Checks every asset reference resolves
├── SETUP.md                # Setup, maintenance and deployment guide
└── README.md
```

One HTML file. One stylesheet. One script. Nothing generated, nothing to sync.

## Quick start

```bash
git clone https://github.com/AdnanMansha64/Portfolio-Website.git
cd Portfolio-Website
open index.html
```

That's it — no dependencies to install. To serve it over HTTP instead
(closer to production):

```bash
python3 -m http.server 8000   # → http://localhost:8000
```

## Updating the site

Edit the content array, commit, push. Pages republishes automatically:

```bash
# content → js/app.js   ·   styling → css/portfolio.css   ·   layout → index.html
git add -A && git commit -m "…" && git push
```

Where to change what, how to add a project or an icon, and the deployment
details are all in **[SETUP.md](SETUP.md)**.

## Architecture notes

Decisions that are deliberate rather than accidental:

- **Content as data, markup as template.** The earlier version of this page
  repeated the same card markup dozens of times and kept a second hidden copy of
  every detail block for the popups. Moving content into `CONTENT` and looping
  with `ng-repeat` deleted both kinds of duplication and more than halved the HTML.
- **One directive per concern.** Reveal-on-scroll, typewriter, count-up,
  proficiency bar, scroll-spy, swipe and focus-trap are seven small directives
  rather than one controller doing DOM work. Each is independently testable and
  independently removable.
- **Inline SVG sprite over an icon font.** 32 icons in ~6 KB of markup, crisp at
  any size and themeable via `currentColor` — versus a ~100 KB external
  stylesheet plus font files and a flash of invisible icons.
- **No build step, on purpose.** The site has no transpiler, bundler or package
  manager, so it cannot break from a dependency update and needs no `node_modules`
  to work on. `git clone` and open the file.
- **Dark theme is the default.** Light theme overrides a single `[data-theme]`
  block, so there is exactly one place to keep the two palettes in sync.
- **ES5 syntax, modern APIs.** No transpilation anywhere, but the code does use
  `IntersectionObserver`, `navigator.clipboard` and `matchMedia`, so it targets
  current browsers rather than old ones.

### Trade-offs

Honest about the costs, which are documented in [SETUP.md §7](SETUP.md):

- **AngularJS 1.x is end-of-life** (January 2022, no security patches). Acceptable
  for a static page with no user input or authentication, but a dead framework.
- **Client-side rendering costs SEO.** Crawlers download a template, not the
  content. Mitigated by static meta tags and a `<noscript>` summary.
- **No backend.** A working contact form or API would need a host that runs code.

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
