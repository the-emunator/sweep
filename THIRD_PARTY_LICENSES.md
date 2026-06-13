# Third-party licenses & credits

Sweep stands on the shoulders of excellent open-source work. This file lists
everything Sweep uses, who made it, and under which license. Credit where
credit is due. 🙏

If you redistribute Sweep (source or the built installer), keep this file and
the notices below intact.

---

## Bundled libraries (shipped inside the app)

### Electron
- **What it does:** the desktop app runtime (Chromium + Node.js).
- **Author:** GitHub / the Electron contributors
- **License:** MIT
- **Project:** https://github.com/electron/electron

### Mammoth.js
- **What it does:** renders `.docx` previews by converting them to HTML.
- **Author:** Michael Williamson
- **License:** BSD-2-Clause
- **Project:** https://github.com/mwilliamson/mammoth.js

### SheetJS Community Edition (`xlsx`)
- **What it does:** reads `.xlsx` / `.xls` spreadsheets for previews.
- **Author:** SheetJS LLC
- **License:** Apache-2.0
- **Project:** https://github.com/SheetJS/sheetjs

### PDF.js (`pdfjs-dist`)
- **What it does:** renders the first page of a PDF as a preview.
- **Author:** Mozilla and contributors
- **License:** Apache-2.0
- **Project:** https://github.com/mozilla/pdf.js

> The Apache-2.0 licensed libraries above ship their own `LICENSE` and `NOTICE`
> files inside `node_modules`, and those files are bundled into the built
> installer by electron-builder. A copy of the Apache License 2.0 is available
> at https://www.apache.org/licenses/LICENSE-2.0

---

## Build tooling (not shipped, used to create the installer)

### electron-builder
- **Author:** Vladimir Krivosheev and contributors
- **License:** MIT
- **Project:** https://github.com/electron-userland/electron-builder

---

## Fonts (loaded from Google Fonts at runtime)

All three are licensed under the **SIL Open Font License 1.1**
(https://scripts.sil.org/OFL):

- **Inter** — Rasmus Andersson — https://github.com/rsms/inter
- **Space Grotesk** — Florian Karsten — https://github.com/floriankarsten/space-grotesk
- **JetBrains Mono** — JetBrains — https://github.com/JetBrains/JetBrainsMono

---

## Icons

The small stroke-style UI icons (gear, search, arrows, folder, etc.) are based
on the **Lucide** icon set, a community fork of **Feather Icons**.

- **Lucide** — License: ISC — https://github.com/lucide-icons/lucide
- **Feather Icons** — Cole Bemis — License: MIT — https://github.com/feathericons/feather

The Sweep logo and the broom mark are original artwork created for this project.

---

## License texts

### MIT (Electron, electron-builder, Feather Icons)

```
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### ISC (Lucide)

```
Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND
FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
```

### BSD-2-Clause (Mammoth.js)

```
Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.
2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES ARE DISCLAIMED. IN NO EVENT SHALL THE
COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES ARISING IN ANY WAY OUT
OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
```

For the full **Apache-2.0** text (SheetJS, PDF.js) see
https://www.apache.org/licenses/LICENSE-2.0 and for the full **SIL OFL-1.1**
(fonts) see https://scripts.sil.org/OFL.
