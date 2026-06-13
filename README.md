<div align="center">

<img src="build/icon-256.png" alt="Sweep logo" width="128" height="128">

# Sweep

**Tidy up your files like a card game — swipe to keep, delete, or sort.
Nothing happens until you confirm.**

[![License: MIT](https://img.shields.io/badge/License-MIT-6C5CE7.svg)](LICENSE)
[![Platform: Windows](https://img.shields.io/badge/Platform-Windows-6C5CE7.svg)](#installation)
[![Built with Electron](https://img.shields.io/badge/Built%20with-Electron-6C5CE7.svg)](https://electronjs.org)

[Download](#installation) · [Website](https://sweep.emunator.com) · [Support](https://ko-fi.com/the_emunator)

</div>

---

## Why Sweep exists

My Desktop and Downloads folder were a graveyard: hundreds of old screenshots,
dead shortcuts, random installers, half-forgotten files. Every "clean-up" felt
like a chore, so it never happened.

Sweep turns that chore into something closer to a game. It shows each file as a
card with a real preview, and you make one quick decision at a time — **swipe
left to delete, right to keep, or drop it onto a folder to sort it.** The trick
that makes it safe: **nothing actually moves or gets deleted until you confirm
everything at the end.** Until then you can undo, restore, and rethink as much
as you want.

It started as a personal tool to declutter my own machine, and I'm releasing it
free and open-source in case it helps someone else dig out of the same mess.

### Vibe-coded with Claude 🤖

Full transparency: I'm not a hardcore developer — I'm a "vibe coder." Sweep was
built collaboratively with **Claude (Anthropic)** through a long back-and-forth
of describing what I wanted, testing it, and iterating. The code, the previews,
the logo, and this very README came out of that process. I think that's a cool
story rather than something to hide, so it's right here in the open.

---

## Features

- 🃏 **Card-style sweeping** — one file, one decision. Swipe or use the buttons.
- 👀 **Real previews** — images, PDFs (first page), Word (`.docx`), Excel,
  text/CSV, ZIP contents, 3D `.stl` models, video thumbnails, and the real
  Windows icons of programs and shortcuts.
- 🗂️ **Sort into folders** — drag a card onto a folder. Pin existing folders or
  create new ones; nothing is created on disk until you apply.
- 🧹 **Modes** — go through everything, largest first (whole folders count, great
  for reclaiming space), duplicates only, oldest, newest, or a daily 10-file
  habit with a streak.
- ↩️ **Safe by design** — a review screen before anything happens, deletions go
  to the Recycle Bin (restorable), and you can undo moves afterwards.
- 🕓 **History** — every applied move and deletion is logged, with one click to
  find a file at its new location.
- 🌍 **English & German**, follows your system language and light/dark theme.
- ⌨️ **Remappable keyboard shortcuts.**

---

## Installation

### The easy way (recommended)

1. Go to the [**Releases**](https://github.com/the-emunator/sweep/releases) page.
2. Download the latest **`Sweep-Setup-x.x.x.exe`** (installer) — or the
   **`Sweep-x.x.x-portable.exe`** if you'd rather not install anything.
3. Run it. Windows SmartScreen may warn about an "unknown publisher" because the
   app isn't code-signed (signing costs money); click **More info → Run anyway**.

That's it. Sweep is a normal Windows app from there.

### From source (for developers)

Requires [Node.js](https://nodejs.org) 18 or newer.

```bash
git clone https://github.com/the-emunator/sweep.git
cd sweep
npm install
npm start            # run the app
```

To build the Windows installer yourself:

```bash
npm run dist:win     # output lands in dist/
```

---

## How it works

| Gesture / key        | Action                                  |
|----------------------|-----------------------------------------|
| Swipe **left**       | Delete (to Recycle Bin)                 |
| Swipe **right**      | Keep                                    |
| Drag onto a folder   | Sort into that folder                   |
| **Space**            | Decide later                            |
| **Z**                | Undo last decision                      |

All keys are remappable in **Settings**. The first time you launch Sweep, a
short interactive intro walks you through it (you can replay it any time).

> **Your files stay yours.** Sweep is fully offline. It never uploads anything,
> has no telemetry, and only touches files when you press **"Yes, apply."**
> Deletions go to the Windows Recycle Bin, so they're recoverable.

---

## Tech stack

- [**Electron**](https://electronjs.org) — desktop runtime
- Vanilla JavaScript, HTML and CSS for the UI (no framework)
- [**PDF.js**](https://github.com/mozilla/pdf.js), [**Mammoth.js**](https://github.com/mwilliamson/mammoth.js)
  and [**SheetJS**](https://github.com/SheetJS/sheetjs) for document previews
- [**electron-builder**](https://github.com/electron-userland/electron-builder) for packaging

The architecture keeps the UI sandboxed: it never touches the file system
directly. All file operations go through a small, explicit bridge
(`preload.js`) to the main process (`main.js`).

---

## Credits & licenses

Sweep is built on great open-source work. Every library, font, and icon set it
uses — with authors and licenses — is listed in
[**THIRD_PARTY_LICENSES.md**](THIRD_PARTY_LICENSES.md). Thank you to all those
projects. 🙏

Sweep itself is released under the **MIT License** — see [LICENSE](LICENSE).
You're free to use, modify, and redistribute it.

---

## Contributing

Issues and pull requests are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for
a quick start. Sweep is a hobby project, so please be kind and patient. 🙂

---

## Support

Sweep is free and ad-free. If it saved you some time and you'd like to say
thanks, you can [**buy me a coffee on Ko-fi**](https://ko-fi.com/the_emunator).
Totally optional — a ⭐ on the repo helps just as much.

---

<div align="center">
Made with ☕ and a lot of swiping by <a href="https://emunator.com">Emunator</a>,
vibe-coded with Claude.
</div>
