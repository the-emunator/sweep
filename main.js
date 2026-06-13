// =====================================================================
// main.js – Electron's "main process".
// This is where Node.js runs with full file-system access.
// The UI (renderer/) must NOT touch files directly – it sends
// requests over IPC ("ipcMain.handle") and we answer here.
// That separation is Electron's security model.
// =====================================================================

const { app, BrowserWindow, ipcMain, dialog, shell, nativeTheme } = require('electron');
const path = require('path');
const fs = require('fs/promises');
const crypto = require('crypto');
const { pathToFileURL } = require('url');

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 1180,
    height: 860,
    minWidth: 700,
    minHeight: 640,
    backgroundColor: '#0C0C11',
    autoHideMenuBar: true,
    icon: path.join(__dirname, 'build', process.platform === 'win32' ? 'icon.ico' : 'icon-256.png'),
    webPreferences: {
      // Security defaults: the UI runs isolated, without Node access.
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  win.loadFile(path.join(__dirname, 'renderer', 'index.html'));
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });

// =====================================================================
// Helpers
// =====================================================================

const TYPE_MAP = {
  shortcut: ['lnk', 'url'],   // Windows shortcuts / internet shortcuts
  app:      ['exe', 'msi', 'bat', 'cmd', 'com', 'appx', 'msix'],  // installers / executables
  video:    ['mp4', 'mkv', 'avi', 'mov', 'webm', 'wmv', 'flv', 'm4v', 'mpg', 'mpeg'],
  audio:    ['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a', 'wma'],
  image:    ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg', 'heic'],
  pdf:      ['pdf'],
  doc:      ['doc', 'docx', 'odt', 'rtf'],
  sheet:    ['xls', 'xlsx', 'ods', 'csv'],
  text:     ['txt', 'md', 'log', 'json', 'ini'],
  model:    ['stl', 'obj', '3mf'],
  archive:  ['zip', 'rar', '7z', 'tar', 'gz'],
};

function typeOf(ext) {
  for (const [t, exts] of Object.entries(TYPE_MAP)) {
    if (exts.includes(ext)) return t;
  }
  return 'other';
}

// Files we skip during a scan – system clutter that has no place
// in a tidy-up app.
const SKIP_FILES = new Set(['desktop.ini', 'thumbs.db', 'ntuser.dat']);

// MD5 hash of a file (for duplicate detection). Only for files up to
// 100 MB so the scan stays fast.
async function hashFile(filePath) {
  const buf = await fs.readFile(filePath);
  return crypto.createHash('md5').update(buf).digest('hex');
}

// On a name collision in the target folder, append " (1)", " (2)", …
// exactly like Windows does.
async function uniqueTarget(dir, fileName) {
  const ext = path.extname(fileName);
  const base = path.basename(fileName, ext);
  let candidate = path.join(dir, fileName);
  let i = 1;
  while (true) {
    try {
      await fs.access(candidate);          // already exists → keep counting
      candidate = path.join(dir, `${base} (${i})${ext}`);
      i++;
    } catch {
      return candidate;                    // does not exist → use it
    }
  }
}

// Move a file OR a folder. fs.rename is instant but fails across drive
// boundaries (C: → D:). The fallback copies, then deletes the original –
// and for a folder we need a RECURSIVE copy (fs.copyFile only does files).
async function moveFile(src, targetDir, fileName) {
  await fs.mkdir(targetDir, { recursive: true });
  const target = await uniqueTarget(targetDir, fileName);
  try {
    await fs.rename(src, target);
  } catch (err) {
    if (err.code === 'EXDEV') {
      const st = await fs.stat(src);
      if (st.isDirectory()) {
        await fs.cp(src, target, { recursive: true });
        await fs.rm(src, { recursive: true, force: true });
      } else {
        await fs.copyFile(src, target);
        await fs.unlink(src);
      }
    } else {
      throw err;
    }
  }
  return target;
}

// =====================================================================
// IPC handlers – the "API" exposed to the UI
// =====================================================================

// --- Folder picker dialog (for "Custom folder" etc.) ---
ipcMain.handle('pick-folder', async () => {
  const res = await dialog.showOpenDialog(win, { properties: ['openDirectory'] });
  return res.canceled ? null : res.filePaths[0];
});

// --- Well-known Windows folders for scan scopes + the folder dock ---
ipcMain.handle('get-known-folders', () => {
  return {
    desktop:   app.getPath('desktop'),
    downloads: app.getPath('downloads'),
    documents: app.getPath('documents'),
    pictures:  app.getPath('pictures'),
    music:     app.getPath('music'),
    videos:    app.getPath('videos'),
  };
});

// --- Scan a folder (top level only for now, max. 500 files) ---
ipcMain.handle('scan-folder', async (_e, folderPath) => {
  const entries = await fs.readdir(folderPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (!entry.isFile()) continue;                          // subfolders: see scan-largest
    if (entry.name.startsWith('.')) continue;               // hidden files
    if (SKIP_FILES.has(entry.name.toLowerCase())) continue;
    // NOTE: .lnk shortcuts are deliberately INCLUDED now – decluttering
    // a Desktop is mostly about old shortcuts.

    const full = path.join(folderPath, entry.name);
    try {
      const st = await fs.stat(full);
      const ext = path.extname(entry.name).slice(1).toLowerCase();
      files.push({
        path: full,
        name: entry.name,
        ext: ext.toUpperCase(),
        type: typeOf(ext),
        sizeKB: Math.max(1, Math.round(st.size / 1024)),
        sizeBytes: st.size,
        mtimeMs: st.mtimeMs,
        dup: false,
      });
    } catch { /* file locked etc. → skip */ }

    if (files.length >= 500) break; // safety limit for v1
  }

  // ---- Duplicate detection ----
  // Step 1: group files with the exact same size (cheap).
  // Step 2: only hash those groups (expensive, but rare).
  const bySize = new Map();
  for (const f of files) {
    if (!bySize.has(f.sizeBytes)) bySize.set(f.sizeBytes, []);
    bySize.get(f.sizeBytes).push(f);
  }
  for (const group of bySize.values()) {
    if (group.length < 2 || group[0].sizeBytes > 100 * 1024 * 1024) continue;
    const byHash = new Map();
    for (const f of group) {
      try {
        const h = await hashFile(f.path);
        if (!byHash.has(h)) byHash.set(h, []);
        byHash.get(h).push(f);
      } catch { /* ignore */ }
    }
    for (const same of byHash.values()) {
      if (same.length > 1) {
        // The oldest file counts as the "original", the rest as duplicates.
        same.sort((a, b) => a.mtimeMs - b.mtimeMs);
        for (let i = 1; i < same.length; i++) same[i].dup = true;
      }
    }
  }

  return files;
});

// --- Scan for the LARGEST items ("what's eating my space here?") ---
// Top-level entries are returned, each with its TOTAL size: a folder is
// one item whose size is the recursive sum of everything inside it. This
// is what makes a 60 GB Steam game show up as a single deletable card,
// instead of thousands of tiny files.
const SKIP_DIRS = new Set([
  '$recycle.bin', 'system volume information', 'node_modules',
  '.git', 'windows', 'program files', 'program files (x86)',
]);
ipcMain.handle('scan-largest', async (_e, folderPath) => {
  let walked = 0;
  const MAX_WALK = 400000;   // hard ceiling so a giant tree can't hang the app

  // Recursive size + file count of a directory.
  async function dirSize(dir) {
    let total = 0, count = 0;
    let entries;
    try { entries = await fs.readdir(dir, { withFileTypes: true }); }
    catch { return { total, count }; }     // permission denied etc.
    for (const e of entries) {
      if (walked > MAX_WALK) break;
      walked++;
      if (e.isSymbolicLink()) continue;      // never follow links (avoids loops)
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        const sub = await dirSize(full);
        total += sub.total; count += sub.count;
      } else if (e.isFile()) {
        try { const st = await fs.stat(full); total += st.size; count++; } catch {}
      }
    }
    return { total, count };
  }

  let entries;
  try { entries = await fs.readdir(folderPath, { withFileTypes: true }); }
  catch { return []; }
  const items = [];

  for (const e of entries) {
    if (e.name.startsWith('.')) continue;
    if (SKIP_FILES.has(e.name.toLowerCase())) continue;
    if (SKIP_DIRS.has(e.name.toLowerCase())) continue;
    if (e.isSymbolicLink()) continue;
    const full = path.join(folderPath, e.name);
    try {
      const st = await fs.stat(full);
      if (e.isDirectory()) {
        const { total, count } = await dirSize(full);
        items.push({
          path: full, name: e.name, ext: 'DIR', type: 'folder', isDir: true,
          sizeBytes: total, sizeKB: Math.max(1, Math.round(total / 1024)),
          mtimeMs: st.mtimeMs, count, dup: false,
        });
      } else if (e.isFile()) {
        const ext = path.extname(e.name).slice(1).toLowerCase();
        items.push({
          path: full, name: e.name, ext: ext.toUpperCase(), type: typeOf(ext), isDir: false,
          sizeBytes: st.size, sizeKB: Math.max(1, Math.round(st.size / 1024)),
          mtimeMs: st.mtimeMs, dup: false,
        });
      }
    } catch { /* skip unreadable entries */ }
    if (walked > MAX_WALK) break;
  }

  items.sort((a, b) => b.sizeBytes - a.sizeBytes);   // biggest first
  return items.slice(0, 80);
});
// (Images, PDFs, Word, Excel, STL are rendered by the UI from the
//  raw bytes – see read-file-bytes. Electron's nativeImage can only
//  decode PNG/JPEG, while Chromium in the UI also handles webp etc.)
ipcMain.handle('get-preview', async (_e, filePath, fileType) => {
  try {
    if (fileType === 'text') {
      const buf = await fs.readFile(filePath, 'utf-8');
      return { kind: 'text', text: buf.slice(0, 600) };
    }
    return null;
  } catch {
    return null;
  }
});

// --- List a ZIP's table of contents (WITHOUT extracting anything!) ---
// Every ZIP ends with a "central directory" listing all entries.
// We only read that list – no code runs, nothing touches the disk.
function listZipEntries(buf) {
  // Find the "end of central directory" record from the back
  // (signature 0x06054b50; a ZIP comment can push it up to 64 KB
  //  before the end of the file).
  const start = Math.max(0, buf.length - 22 - 65535);
  for (let i = buf.length - 22; i >= start; i--) {
    if (buf.readUInt32LE(i) !== 0x06054b50) continue;
    const total = buf.readUInt16LE(i + 10);   // number of entries
    let p = buf.readUInt32LE(i + 16);         // central directory offset
    const entries = [];
    while (entries.length < total && p + 46 <= buf.length) {
      if (buf.readUInt32LE(p) !== 0x02014b50) break; // entry signature
      const uncompSize = buf.readUInt32LE(p + 24);
      const nameLen  = buf.readUInt16LE(p + 28);
      const extraLen = buf.readUInt16LE(p + 30);
      const comLen   = buf.readUInt16LE(p + 32);
      entries.push({ name: buf.toString('utf8', p + 46, p + 46 + nameLen), size: uncompSize });
      p += 46 + nameLen + extraLen + comLen;
      if (entries.length >= 40) break;        // the preview needs no more
    }
    return { total, entries };
  }
  return null;
}
ipcMain.handle('list-zip', async (_e, filePath) => {
  try {
    const st = await fs.stat(filePath);
    if (st.size > 200 * 1024 * 1024) return null;
    return listZipEntries(await fs.readFile(filePath));
  } catch {
    return null;
  }
});

// --- Raw file bytes for previews (PDF, Word, Excel, images, STL) ---
// The UI must not access files itself, so we hand over the bytes
// here – with a size cap so a 2 GB file can't blow up memory.
ipcMain.handle('read-file-bytes', async (_e, filePath, maxBytes) => {
  try {
    const st = await fs.stat(filePath);
    if (st.size > (maxBytes || 30 * 1024 * 1024)) return null; // too big → no preview
    return await fs.readFile(filePath); // Buffer → arrives as Uint8Array in the UI
  } catch {
    return null;
  }
});

// --- Reveal in Explorer / open with the default app ---
// (shell.openPath on a directory opens it in Explorer.)
ipcMain.handle('show-in-folder', (_e, filePath) => shell.showItemInFolder(filePath));
ipcMain.handle('open-file', (_e, filePath) => shell.openPath(filePath));

// --- Open the Windows recycle bin in Explorer ---
// (e.g. to restore an accidentally deleted file)
// We address it via its well-known CLSID – "shell:RecycleBin" is NOT a
// valid token (Explorer would silently fall back to the default folder,
// e.g. Documents), whereas "shell:RecycleBinFolder" and the CLSID work.
ipcMain.handle('open-recycle-bin', () => {
  if (process.platform === 'win32') {
    require('child_process').spawn(
      'explorer.exe',
      ['shell:::{645FF040-5081-101B-9F08-00AA002F954E}'],
      { detached: true }
    );
  }
});

// --- Resolve a .lnk shortcut to show where it points ---
// readShortcutLink only exists on Windows and only for .lnk files.
ipcMain.handle('read-shortcut', (_e, filePath) => {
  try {
    if (process.platform !== 'win32') return null;
    if (!filePath.toLowerCase().endsWith('.lnk')) return null;
    const info = shell.readShortcutLink(filePath);
    return { target: info.target || '', args: info.args || '' };
  } catch {
    return null;
  }
});

// --- List a folder's top-level contents (for the folder preview card) ---
// Like the ZIP preview: just a peek inside, nothing is opened or copied.
ipcMain.handle('list-folder', async (_e, folderPath) => {
  try {
    const entries = await fs.readdir(folderPath, { withFileTypes: true });
    const items = [];
    let total = entries.length;
    for (const e of entries) {
      if (items.length >= 12) break;
      if (e.name.startsWith('.')) { total--; continue; }
      let size = 0;
      if (e.isFile()) { try { size = (await fs.stat(path.join(folderPath, e.name))).size; } catch {} }
      items.push({ name: e.name, isDir: e.isDirectory(), size });
    }
    // directories first, then by size desc – the interesting stuff on top
    items.sort((a, b) => (b.isDir - a.isDir) || (b.size - a.size));
    return { total, items };
  } catch {
    return null;
  }
});

// --- A file:// URL for a path (used to load a video into a <video> tag) ---
ipcMain.handle('get-file-url', (_e, filePath) => {
  try { return pathToFileURL(filePath).href; } catch { return null; }
});

// --- The real Windows icon of a file (exe, lnk, etc.) as a data URL ---
// app.getFileIcon asks the OS for the associated icon – exactly what
// Explorer shows. Works for any file type.
ipcMain.handle('get-file-icon', async (_e, filePath) => {
  try {
    const img = await app.getFileIcon(filePath, { size: 'large' });
    if (!img || img.isEmpty()) return null;
    return img.toDataURL();
  } catch {
    return null;
  }
});

// --- Open an external link in the user's browser ---
ipcMain.handle('open-external', (_e, url) => {
  if (/^https?:\/\//i.test(url)) shell.openExternal(url);   // only http(s), no surprises
});

// --- System locale + dark-mode (used by the first-run intro) ---
ipcMain.handle('get-system-info', () => {
  // getLocale() returns Chromium's UI locale, which often falls back to
  // "en-US". The real OS language comes from getPreferredSystemLanguages()
  // (e.g. ["de-DE", "en-US"]) → getSystemLocale() → getLocale() as a last
  // resort.
  let locale = '';
  try {
    const langs = app.getPreferredSystemLanguages ? app.getPreferredSystemLanguages() : [];
    locale = (langs && langs[0]) ||
             (app.getSystemLocale ? app.getSystemLocale() : '') ||
             app.getLocale();
  } catch {
    try { locale = app.getLocale(); } catch {}
  }
  return {
    locale,                                        // e.g. "de-DE", "en-US"
    darkMode: nativeTheme.shouldUseDarkColors,     // follows the OS theme
  };
});

// --- THE important step: apply everything ---
// ops = [{ src, name, action: 'trash' }                  → recycle bin
//        { src, name, action: 'move', targetDir }]       → move
// Returns success/error per operation so the UI can report honestly.
ipcMain.handle('apply-actions', async (_e, ops) => {
  const results = [];
  for (const op of ops) {
    try {
      if (op.action === 'trash') {
        await shell.trashItem(op.src);   // Windows recycle bin – restorable!
        results.push({ src: op.src, ok: true });
      } else if (op.action === 'move') {
        const target = await moveFile(op.src, op.targetDir, op.name);
        results.push({ src: op.src, ok: true, target });
      }
    } catch (err) {
      results.push({ src: op.src, ok: false, error: err.message });
    }
  }
  return results;
});
