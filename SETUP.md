# Setup guide

Two files here, both built from your CV:

- `index.html` — your portfolio website (single self-contained file: HTML, CSS and JS all in one).
- `github-profile-README.md` — your GitHub profile introduction page.

## 1. Before you publish — replace these placeholders

In **`index.html`**, search for and update:
- `href="#"` on the LinkedIn and Xing buttons/links (two places: hero links, contact list) → your real profile URLs.
- `https://github.com/yourusername` → your real GitHub profile URL.

In **`github-profile-README.md`**, replace:
- `yourusername` (appears in the profile repo link and portfolio URL)
- `yourprofile` in the LinkedIn/Xing links

If you'd rather not list your phone number publicly, remove the
`<a class="btn btn-ghost" href="tel:...">` line in the hero and the phone
`<li>` in the contact list.

## 2. Host the portfolio on GitHub Pages

1. Create a new repository, e.g. `portfolio` (or `adnan-mansha-portfolio`).
2. Upload `index.html` to the root of that repository (rename it to
   `index.html` if it isn't already — it already is).
3. Go to **Settings → Pages** in the repo.
4. Under **Source**, select the `main` branch and `/ (root)` folder, then
   save.
5. GitHub gives you a live URL shortly after, typically:
   `https://yourusername.github.io/portfolio/`
   (or `https://yourusername.github.io/` if the repo is named
   `yourusername.github.io`).

## 3. Set up the GitHub profile README

This is a special repository GitHub recognizes automatically:

1. Create a **new repository named exactly like your username** — e.g. if
   your username is `adnanmansha`, the repo must be named `adnanmansha`.
2. Make it **public**, and check "Add a README file" when creating it (or add
   one after).
3. Replace the generated `README.md` content with the contents of
   `github-profile-README.md` from this folder.
4. Commit — it now renders automatically at the top of your GitHub profile
   page (github.com/yourusername).

## 4. Optional next steps

- Add a custom domain in the Pages settings if you have one.
- Add real screenshots/GIFs of the KLA feature work (range slider, firmware
  checker) to the portfolio if you're able to share non-confidential visuals.
- Link the portfolio's "Selected work" cards to real repos once you have
  public ones to point to.
