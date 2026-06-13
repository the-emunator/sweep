# Contributing to Sweep

Thanks for your interest! Sweep is a small, friendly hobby project.

## Getting started

```bash
git clone https://github.com/the-emunator/sweep.git
cd sweep
npm install
npm start
```

The code is intentionally simple — vanilla JS, HTML and CSS, no build step for
the UI:

- `main.js` — Electron main process (all file-system access lives here)
- `preload.js` — the small, explicit bridge exposed to the UI as `window.sweep`
- `renderer/` — the UI (`index.html`, `renderer.js`, `style.css`)

## Guidelines

- Keep the UI sandboxed: it must never touch the file system directly. Add a new
  IPC handler in `main.js` and expose it through `preload.js` instead.
- Nothing should ever modify or delete a file before the user confirms.
- Keep code comments in English.
- New user-facing text needs both an English **and** a German entry in the
  `I18N` dictionary in `renderer.js`.
- Be mindful of third-party code: if you add a dependency, add it to
  [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md) with its license.

## Pull requests

Small, focused PRs are easiest to review. Describe what you changed and why, and
mention how you tested it. Thanks! 🙏
