// =====================================================================
// renderer.js – the complete UI logic.
// Everything file-related goes through window.sweep.* (see preload.js).
// Until "Yes, apply" is clicked, NO file is ever touched.
// =====================================================================

/* ================= i18n =================
   English is the default; German is fully supported.
   Dictionary values are plain strings or functions (for plurals
   and interpolation). t('key') / t('key', arg) resolves them. */
const I18N = {
  en: {
    title: 'Sweep – tidy up your files',
    hero_h1: 'One file.<br>One decision.<br><em>Done.</em>',
    hero_p: 'Sweep shows your files as cards. Swipe, sort, delete – and review everything before anything actually happens.',
    sec_where: 'What do you want to clean up?',
    sec_how: 'How do you want to go through it?',
    scope_desktop: 'Desktop', scope_downloads: 'Downloads',
    documents: 'Documents', pictures: 'Pictures',
    scope_custom: 'Custom folder', scope_custom_sub: 'Click to choose…',
    soon: 'SOON',
    mode_all: 'Go through everything', mode_all_ds: 'Every file, one after another',
    mode_largest: 'Largest first', mode_largest_ds: 'The biggest items — whole folders count too',
    mode_dupes: 'Duplicates only', mode_dupes_ds: 'Files that exist more than once – free space safely',
    mode_oldest: 'Oldest first', mode_oldest_ds: 'The 50 oldest files – dust collectors first',
    mode_newest: 'Newest first', mode_newest_ds: 'The 50 most recent files – fresh arrivals',
    mode_daily: 'Daily Sweep', mode_daily_ds: '10 files a day – small bites, big impact',
    no_dupes: 'No duplicates found here. ✨',
    streak: n => `🔥 ${n} day${n > 1 ? 's' : ''}`,
    start_scan: 'Start scan', pick_first: 'Please choose a folder first.',
    scanning: p => `Scanning ${p} …`,
    no_files: 'No files found – this folder is already tidy. ✨',
    f_all: 'All', f_folder: 'Folders', f_shortcut: 'Shortcuts', f_app: 'Programs', f_video: 'Videos', f_audio: 'Audio', f_image: 'Images', f_pdf: 'PDFs', f_doc: 'Documents', f_sheet: 'Sheets',
    f_text: 'Text', f_model: '3D', f_archive: 'Archives', f_other: 'Other',
    t_folder: 'Folder', t_shortcut: 'Shortcut', t_app: 'Program', t_video: 'Video', t_audio: 'Audio', t_image: 'Image', t_pdf: 'PDF', t_doc: 'Document', t_sheet: 'Spreadsheet',
    t_text: 'Text', t_model: '3D model', t_archive: 'Archive', t_other: 'Other',
    filter_done: 'Nothing left in this filter. Pick another one above, or “All”.',
    points_to: 'points to', files_inside: n => `${n.toLocaleString('en-US')} file${n !== 1 ? 's' : ''} inside`,
    folder_warn: 'Deletes the entire folder with everything inside.',
    dock_label: 'Sort: drag a card onto a folder',
    empty: 'empty', files_n: n => `${n} file${n !== 1 ? 's' : ''}`,
    new_folder: 'New folder', unpin: 'Remove from Sweep',
    dup: 'Duplicate', show_explorer: 'Show in Explorer', open_file: 'Open',
    act_del: 'Delete', act_keep: 'Keep', act_sort: 'Choose folder', act_skip: 'Later', act_undo: 'Undo',
    space: 'Space', press_key: 'Press a key…',
    settings: 'Settings', kb_title: 'Key bindings', behavior: 'Behavior', language: 'Language',
    tog_trash: 'Move to recycle bin instead of deleting',
    tog_review: 'Show review screen at the end',
    tog_ai: 'Enable local AI preview',
    pin_title: 'Pin a folder', name_ph: 'Name, e.g. Invoices 2026',
    location: 'Location', other_loc: 'Other location…',
    cancel: 'Cancel', pin: 'Pin', or: 'or',
    pin_existing: '📂 Pin an existing folder from your PC…',
    rm_title: 'Remove folder?', remove: 'Remove',
    rm_text: name => `“<b>${name}</b>” is only removed from Sweep – <b>nothing is deleted</b> on your PC.`,
    rm_files: n => `<br><br>⚠️ ${n} file${n > 1 ? 's' : ''} you dragged in during this session will return to the stack.`,
    pick_title: 'Where to?', pick_new: 'New folder…',
    rev_title: 'Quick check – does this look right?',
    rev_sub: 'So far <b>nothing</b> has happened. Files are only moved and deleted once you confirm below.',
    rev_del: 'Delete (recycle bin)', rev_sort: 'Sort into folders', rev_keep: 'Stays where it is',
    none_del: 'Nothing marked for deletion.', none_sort: 'Nothing marked for sorting.', dash: '–',
    created: ' (will be created)', back: 'Back', keep_btn: 'Keep after all', again_btn: 'Rethink',
    show_all: n => `Show all ${n}`, show_less: 'Show less',
    free_del: (n, s) => `Moves <b>${n} file${n > 1 ? 's' : ''}</b> to the recycle bin, freeing <b>${s}</b>.`,
    free_none: 'No deletions – files are only moved.',
    apply: 'Yes, apply', applying: 'Applying…',
    done_title: 'All tidied up!',
    done_ok: 'Done. Deleted files are in the recycle bin and can be restored from there.',
    done_err: n => `Almost done – ${n} file${n > 1 ? 's' : ''} could not be processed (probably open or locked):`,
    done_undone: 'Moved files are back where they were.',
    trash_note: ' Deleted files remain in the recycle bin.',
    s_kept: 'Kept', s_trash: 'In recycle bin', s_moved: 'Moved',
    undo_moves: '↩ Undo moves', undoing: 'Moving back…', undone: '✓ All moved back',
    undo_fail: n => `↩ ${n} file(s) stuck`,
    open_trash: '🗑 Open recycle bin', new_sweep: 'Start a new sweep',
    pdf_page: n => `Page 1 of ${n}`,
    sheets_badge: (n, name) => `${n > 1 ? n + ' sheets · ' : ''}“${name}”`,
    zip_badge: n => `${n} entries · nothing extracted`, zip_more: n => `… and ${n} more`,
    tris: n => `${n.toLocaleString('en-US')} triangles`,
    today: 'today', days_ago: n => `${n} day${n > 1 ? 's' : ''} ago`,
    months_ago: n => `${n} mo. ago`, years_ago: y => `${y} yrs ago`,
    video_badge: 'preview frame', folder_peek_more: n => `… and ${n} more`,
    // --- branding / about ---
    support: 'Support Sweep', website: 'Website', made_by: 'by Emunator',
    about: 'About', version_label: 'Version',
    // --- auto-update ---
    upd_check: 'Check for updates',
    upd_checking: 'Checking for updates…',
    upd_none: "You're up to date.",
    upd_available: v => `Downloading update ${v}…`,
    upd_progress: p => `Downloading update… ${p}%`,
    upd_ready: v => `Update ${v} is ready.`,
    upd_error: 'Update check failed.',
    upd_restart: 'Restart & install',
    upd_dev: 'Updates only work in the installed app.',
    upd_installing: v => `Installing update ${v}…`,
    tog_auto_install: 'Install updates automatically',
    // --- intro / onboarding ---
    tog_intro: 'Show the intro again next start',
    intro_skip: 'Skip', intro_back: 'Back', intro_next: 'Next', intro_start: 'Start sweeping',
    intro_lang: 'Language', intro_theme: 'Appearance', theme_dark: 'Dark', theme_light: 'Light',
    intro_t1: 'Welcome to Sweep', intro_b1: 'Tidy up your files like a card game: one file at a time, one quick decision each. Nothing is touched until you confirm at the end.',
    intro_t2: 'A few settings', intro_b2: 'We picked these from your system – change them if you like.',
    intro_t3: 'Try it out', intro_b3: 'Here are a few demo cards (not real files). Swipe them or use the buttons:',
    intro_t4: 'You are ready', intro_b4: 'Pick a folder and a mode, then start. You can replay this intro any time from Settings.',
    demo_left: 'Swipe LEFT to delete', demo_right: 'Swipe RIGHT to keep',
    demo_up: 'Drag onto a folder to sort', demo_done: 'Nicely done! 🎉',
    demo_card1: 'old_screenshot.png', demo_card2: 'vacation_invoice.pdf', demo_card3: 'mixtape_2009.mp3',
    demo_folder: 'Keepers',
    // --- history / log ---
    history: 'History', history_title: 'History', clear_history: 'Clear',
    history_empty: 'Nothing here yet. Once you apply a sweep, every move and deletion shows up here.',
    hist_trashed: 'to recycle bin', hist_moved_to: 'moved to',
    hist_find: 'Find', hist_open_trash: 'Recycle bin',
    hist_gone: 'File no longer at that location – opening the folder instead.',
    clear_history_confirm: 'Clear the entire history? This does not affect your files.',
  },
  de: {
    title: 'Sweep – Dateien aufräumen',
    hero_h1: 'Eine Datei.<br>Eine Entscheidung.<br><em>Fertig.</em>',
    hero_p: 'Sweep zeigt dir deine Dateien als Karten. Wischen, sortieren, löschen – und am Ende prüfst du alles, bevor irgendwas wirklich passiert.',
    sec_where: 'Wo soll aufgeräumt werden?',
    sec_how: 'Wie willst du vorgehen?',
    scope_desktop: 'Desktop', scope_downloads: 'Downloads',
    documents: 'Dokumente', pictures: 'Bilder',
    scope_custom: 'Eigener Ordner', scope_custom_sub: 'Klicken zum Wählen…',
    soon: 'BALD',
    mode_all: 'Alles durchgehen', mode_all_ds: 'Jede Datei, eine nach der anderen',
    mode_largest: 'Größte zuerst', mode_largest_ds: 'Die größten Brocken — ganze Ordner zählen mit',
    mode_dupes: 'Nur Duplikate', mode_dupes_ds: 'Dateien, die mehrfach existieren – sicher Platz schaffen',
    mode_oldest: 'Älteste zuerst', mode_oldest_ds: 'Die 50 ältesten Dateien – Staubfänger zuerst',
    mode_newest: 'Neueste zuerst', mode_newest_ds: 'Die 50 jüngsten Dateien – frisch angefallen',
    mode_daily: 'Daily Sweep', mode_daily_ds: '10 Dateien pro Tag – kleine Häppchen, große Wirkung',
    no_dupes: 'Keine Duplikate gefunden. ✨',
    streak: n => `🔥 ${n} Tag${n > 1 ? 'e' : ''}`,
    start_scan: 'Scan starten', pick_first: 'Bitte zuerst einen Ordner wählen.',
    scanning: p => `Scanne ${p} …`,
    no_files: 'Keine Dateien gefunden – dieser Ordner ist schon aufgeräumt. ✨',
    f_all: 'Alle', f_folder: 'Ordner', f_shortcut: 'Verknüpfungen', f_app: 'Programme', f_video: 'Videos', f_audio: 'Audio', f_image: 'Bilder', f_pdf: 'PDFs', f_doc: 'Dokumente', f_sheet: 'Tabellen',
    f_text: 'Text', f_model: '3D', f_archive: 'Archive', f_other: 'Sonstige',
    t_folder: 'Ordner', t_shortcut: 'Verknüpfung', t_app: 'Programm', t_video: 'Video', t_audio: 'Audio', t_image: 'Bild', t_pdf: 'PDF', t_doc: 'Dokument', t_sheet: 'Tabelle',
    t_text: 'Text', t_model: '3D-Modell', t_archive: 'Archiv', t_other: 'Sonstige',
    filter_done: 'In diesem Filter ist nichts mehr übrig. Wähl oben einen anderen oder „Alle".',
    points_to: 'zeigt auf', files_inside: n => `${n.toLocaleString('de-DE')} Datei${n !== 1 ? 'en' : ''} enthalten`,
    folder_warn: 'Löscht den kompletten Ordner mit allem darin.',
    dock_label: 'Einsortieren: Karte auf einen Ordner ziehen',
    empty: 'leer', files_n: n => `${n} Datei${n !== 1 ? 'en' : ''}`,
    new_folder: 'Neuer Ordner', unpin: 'Aus Sweep entfernen',
    dup: 'Duplikat', show_explorer: 'Im Explorer zeigen', open_file: 'Öffnen',
    act_del: 'Löschen', act_keep: 'Behalten', act_sort: 'Ordner wählen', act_skip: 'Später', act_undo: 'Rückgängig',
    space: 'Leertaste', press_key: 'Taste drücken…',
    settings: 'Einstellungen', kb_title: 'Tastenbelegung', behavior: 'Verhalten', language: 'Sprache',
    tog_trash: 'In den Papierkorb statt löschen',
    tog_review: 'Review-Screen am Ende zeigen',
    tog_ai: 'Lokale KI-Vorschau aktivieren',
    pin_title: 'Ordner anpinnen', name_ph: 'Name, z.B. Rechnungen 2026',
    location: 'Speicherort', other_loc: 'Anderer Ort…',
    cancel: 'Abbrechen', pin: 'Anpinnen', or: 'oder',
    pin_existing: '📂 Bestehenden Ordner vom PC anpinnen…',
    rm_title: 'Ordner entfernen?', remove: 'Entfernen',
    rm_text: name => `„<b>${name}</b>" wird nur aus Sweep entfernt – auf deinem PC wird <b>nichts gelöscht</b>.`,
    rm_files: n => `<br><br>⚠️ ${n} Datei${n > 1 ? 'en' : ''}, die du in dieser Session hineingezogen hast, ${n > 1 ? 'kommen' : 'kommt'} zurück in den Stapel.`,
    pick_title: 'Wohin damit?', pick_new: 'Neuer Ordner…',
    rev_title: 'Kurz prüfen – passt das so?',
    rev_sub: 'Bis jetzt ist noch <b>nichts</b> passiert. Erst wenn du unten bestätigst, werden Dateien verschoben und gelöscht.',
    rev_del: 'Löschen (Papierkorb)', rev_sort: 'Einsortieren', rev_keep: 'Bleibt wo es ist',
    none_del: 'Nichts zum Löschen markiert.', none_sort: 'Nichts zum Einsortieren markiert.', dash: '–',
    created: ' (wird angelegt)', back: 'Zurück', keep_btn: 'Doch behalten', again_btn: 'Nochmal',
    show_all: n => `Alle ${n} anzeigen`, show_less: 'Weniger anzeigen',
    free_del: (n, s) => `Löscht <b>${n} Datei${n > 1 ? 'en' : ''}</b> in den Papierkorb und macht <b>${s}</b> frei.`,
    free_none: 'Keine Löschungen – es wird nur verschoben.',
    apply: 'Ja, anwenden', applying: 'Wird angewendet…',
    done_title: 'Aufgeräumt!',
    done_ok: 'Alles erledigt. Gelöschte Dateien liegen im Papierkorb und können dort wiederhergestellt werden.',
    done_err: n => `Fast alles erledigt – ${n} Datei${n > 1 ? 'en konnten' : ' konnte'} nicht verarbeitet werden (vermutlich gerade geöffnet oder gesperrt):`,
    done_undone: 'Verschobene Dateien sind zurück an ihrem alten Ort.',
    trash_note: ' Gelöschte Dateien bleiben im Papierkorb.',
    s_kept: 'Behalten', s_trash: 'Im Papierkorb', s_moved: 'Verschoben',
    undo_moves: '↩ Verschieben rückgängig', undoing: 'Wird zurückverschoben…', undone: '✓ Alles zurückverschoben',
    undo_fail: n => `↩ ${n} Datei(en) hängen fest`,
    open_trash: '🗑 Papierkorb öffnen', new_sweep: 'Neuen Sweep starten',
    pdf_page: n => `Seite 1 von ${n}`,
    sheets_badge: (n, name) => `${n > 1 ? n + ' Blätter · ' : ''}„${name}"`,
    zip_badge: n => `${n} Einträge · nichts entpackt`, zip_more: n => `… und ${n} weitere`,
    tris: n => `${n.toLocaleString('de-DE')} Dreiecke`,
    today: 'heute', days_ago: n => `vor ${n} Tag${n > 1 ? 'en' : ''}`,
    months_ago: n => `vor ${n} Mon.`, years_ago: y => `vor ${y} J.`,
    video_badge: 'Standbild', folder_peek_more: n => `… und ${n} weitere`,
    // --- branding / about ---
    support: 'Sweep unterstützen', website: 'Webseite', made_by: 'von Emunator',
    about: 'Über', version_label: 'Version',
    // --- auto-update ---
    upd_check: 'Nach Updates suchen',
    upd_checking: 'Suche nach Updates…',
    upd_none: 'Du bist auf dem neuesten Stand.',
    upd_available: v => `Update ${v} wird geladen…`,
    upd_progress: p => `Update wird geladen… ${p}%`,
    upd_ready: v => `Update ${v} ist bereit.`,
    upd_error: 'Update-Prüfung fehlgeschlagen.',
    upd_restart: 'Neu starten & installieren',
    upd_dev: 'Updates funktionieren nur in der installierten App.',
    upd_installing: v => `Update ${v} wird installiert…`,
    tog_auto_install: 'Updates automatisch installieren',
    // --- intro / onboarding ---
    tog_intro: 'Intro beim nächsten Start erneut zeigen',
    intro_skip: 'Überspringen', intro_back: 'Zurück', intro_next: 'Weiter', intro_start: 'Los geht\'s',
    intro_lang: 'Sprache', intro_theme: 'Darstellung', theme_dark: 'Dunkel', theme_light: 'Hell',
    intro_t1: 'Willkommen bei Sweep', intro_b1: 'Räum deine Dateien auf wie ein Kartenspiel: eine Datei nach der anderen, je eine schnelle Entscheidung. Nichts wird angefasst, bis du am Ende bestätigst.',
    intro_t2: 'Ein paar Einstellungen', intro_b2: 'Die haben wir von deinem System übernommen – ändere sie ruhig.',
    intro_t3: 'Probier es aus', intro_b3: 'Hier ein paar Demo-Karten (keine echten Dateien). Wisch sie weg oder nutz die Buttons:',
    intro_t4: 'Alles bereit', intro_b4: 'Wähl einen Ordner und einen Modus und leg los. Das Intro kannst du jederzeit in den Einstellungen neu starten.',
    demo_left: 'Nach LINKS wischen zum Löschen', demo_right: 'Nach RECHTS wischen zum Behalten',
    demo_up: 'Auf einen Ordner ziehen zum Einsortieren', demo_done: 'Sauber gemacht! 🎉',
    demo_card1: 'altes_screenshot.png', demo_card2: 'urlaub_rechnung.pdf', demo_card3: 'mixtape_2009.mp3',
    demo_folder: 'Behalten',
    // --- history / log ---
    history: 'Verlauf', history_title: 'Verlauf', clear_history: 'Leeren',
    history_empty: 'Hier ist noch nichts. Sobald du einen Sweep anwendest, taucht jede Verschiebung und Löschung hier auf.',
    hist_trashed: 'in den Papierkorb', hist_moved_to: 'verschoben nach',
    hist_find: 'Finden', hist_open_trash: 'Papierkorb',
    hist_gone: 'Datei ist dort nicht mehr – öffne stattdessen den Ordner.',
    clear_history_confirm: 'Den ganzen Verlauf leeren? Deine Dateien sind davon nicht betroffen.',
  },
};
let lang = localStorage.getItem('sweep-lang') || 'en';
function t(key, ...args) {
  const v = (I18N[lang] && I18N[lang][key]) ?? I18N.en[key] ?? key;
  return typeof v === 'function' ? v(...args) : v;
}

// Static texts in index.html, mapped by element id. The third entry
// marks values that contain HTML.
const STATIC_TEXT = [
  ['heroH1', 'hero_h1', true], ['heroP', 'hero_p'],
  ['secWhere', 'sec_where'], ['secHow', 'sec_how'], ['startLabel', 'start_scan'],
  ['dockLabelText', 'dock_label'],
  ['drawerTitle', 'settings'], ['langTitle', 'language'], ['kbTitle', 'kb_title'],
  ['behaviorTitle', 'behavior'], ['togTrash', 'tog_trash'], ['togReview', 'tog_review'], ['togAI', 'tog_ai'],
  ['togAutoUpdate', 'tog_auto_install'],
  ['pinTitle', 'pin_title'], ['locTitle', 'location'], ['folderCancel', 'cancel'],
  ['folderCreate', 'pin'], ['orText', 'or'], ['pinExisting', 'pin_existing'],
  ['rmTitle', 'rm_title'], ['removeCancel', 'cancel'], ['removeConfirm', 'remove'],
  ['pickTitle', 'pick_title'],
  ['revTitle', 'rev_title'], ['revSub', 'rev_sub', true],
  ['doneTitle', 'done_title'],
  ['openTrashBtn', 'open_trash'], ['againBtn', 'new_sweep'],
  // footer + history + intro + about
  ['footHistory', 'history'], ['footSupport', 'support'], ['footWebsite', 'website'], ['footBrand', 'made_by'],
  ['histTitle', 'history_title'], ['histClear', 'clear_history'],
  ['introBack', 'intro_back'], ['introNext', 'intro_next'], ['introSkip', 'intro_skip'],
  ['togIntro', 'tog_intro'], ['drawerHistory', 'history'],
  ['aboutTitle', 'about'], ['aboutVerLabel', 'version_label'],
  ['drawerUpdateTx', 'upd_check'],
  ['drawerSupportTx', 'support'], ['drawerWebsiteTx', 'website'], ['aboutMade', 'made_by'],
];
function applyStatic() {
  document.title = t('title');
  document.documentElement.lang = lang;
  for (const [id, key, html] of STATIC_TEXT) {
    const el = document.getElementById(id);
    if (!el) continue;
    if (html) el.innerHTML = t(key); else el.textContent = t(key);
  }
  $('#folderInput').placeholder = t('name_ph');
  $('#applyBtn').innerHTML = applyBtnHTML();
  $('#undoMoveBtn').textContent = t('undo_moves');
  // version strings (not translated)
  const fv = $('#footVer'); if (fv) fv.textContent = 'v' + APP_VERSION;
  const av = $('#aboutVer'); if (av) av.textContent = APP_VERSION;
}
function applyBtnHTML() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M20 6L9 17l-5-5"/></svg>${t('apply')}`;
}

/* ================= Constants ================= */
// Fallback; the real value comes from the main process at init
// (window.sweep.getAppVersion → package.json "version").
let APP_VERSION = '0.9.0';
const LINKS = { website: 'https://sweep.emunator.com', kofi: 'https://ko-fi.com/the_emunator', emunator: 'https://emunator.com' };
const COLORS = { folder:'#FFB020', shortcut:'#8A93A6', app:'#E8553B', video:'#E84393', audio:'#00B894', image:'#16C079', pdf:'#FF4D6D', doc:'#3D7BFF', sheet:'#16C079', text:'#9A6BFF', model:'#00B8D9', archive:'#C77D2E', other:'#FF9F1C' };
const FILTER_KEYS = ['all','folder','shortcut','app','video','audio','image','pdf','doc','sheet','text','model','archive','other'];
const FOLDER_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>';

const MODES = [
  { key:'all', col:'var(--accent)',
    icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>' },
  { key:'largest', col:'#FFB020',
    icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17l6-6 4 4 8-8"/><path d="M14 7h7v7"/></svg>' },
  { key:'dupes', col:'#E84393',
    icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>' },
  { key:'oldest', col:'#3D7BFF',
    icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>' },
  { key:'newest', col:'var(--keep)',
    icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 3 14h7l-1 8 10-12h-7z"/></svg>' },
  { key:'daily', col:'var(--sort)', streak:true,
    icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>' },
];

/* ================= State ================= */
let knownFolders = null;       // well-known Windows paths from the main process
let scope = 'desktop';
let customPath = null;         // for the "custom folder" scope
let mode = 'all';
let activeFilter = 'all';

let allFiles = [];             // scan result (objects with a real .path)
let session = [];              // file paths in this session's order
let status = {};               // path -> {act:'kept'|'deleted'|'sorted', folder}
let history = [];
let folders = [];              // folder dock: {id,name,path,sys,virtual}
let hiddenSys = [];            // hidden default folders (docs/pics/dl)
let keys = { del:'ArrowLeft', keep:'ArrowRight', sort:'ArrowUp', skip:' ', undo:'z' };
let listeningFor = null;
let keptExpanded = false;      // "stays where it is" expanded in review?
let lastApply = null;          // what really happened on the last apply
const previewCache = new Map();

const $ = s => document.querySelector(s);
const deckEl = document.getElementById('deck');

/* ================= Preferences (keys, folders, language, streak) ================= */
function joinPath(a, b) { const sep = a.includes('\\') ? '\\' : '/'; return a.replace(/[\\/]+$/, '') + sep + b; }

function loadPrefs() {
  try {
    const saved = JSON.parse(localStorage.getItem('sweep-prefs') || '{}');
    if (saved.keys) keys = { ...keys, ...saved.keys };
    if (saved.hiddenSys) hiddenSys = saved.hiddenSys;
    if (saved.customFolders) {
      for (const fo of saved.customFolders) {
        // Migration: older versions stored no path
        if (!fo.path) { fo.path = joinPath(knownFolders.documents, fo.name); fo.virtual = true; }
        folders.push(fo);
      }
    }
    folders = folders.filter(f => !(f.sys && hiddenSys.includes(f.id)));
  } catch {}
}
function savePrefs() {
  localStorage.setItem('sweep-prefs', JSON.stringify({
    keys,
    hiddenSys,
    customFolders: folders.filter(f => !f.sys),
  }));
}
function dailyStreak() {
  try { return JSON.parse(localStorage.getItem('sweep-daily') || '{}').streak || 0; }
  catch { return 0; }
}
function bumpStreak() {
  const today = new Date().toDateString();
  let d = {};
  try { d = JSON.parse(localStorage.getItem('sweep-daily') || '{}'); } catch {}
  if (d.last === today) return;
  const yesterday = new Date(Date.now() - 864e5).toDateString();
  d.streak = (d.last === yesterday) ? (d.streak || 0) + 1 : 1;
  d.last = today;
  localStorage.setItem('sweep-daily', JSON.stringify(d));
}

/* ================= Formatting helpers ================= */
function fmtKB(kb) {
  if (kb < 1024) return kb + ' KB';
  if (kb < 1024 * 1024) {
    const mb = (kb / 1024).toFixed(1);
    return (lang === 'de' ? mb.replace('.', ',') : mb) + ' MB';
  }
  const gb = (kb / 1024 / 1024).toFixed(1);
  return (lang === 'de' ? gb.replace('.', ',') : gb) + ' GB';
}
function fmtAge(mtimeMs) {
  const d = Math.max(0, Math.round((Date.now() - mtimeMs) / 864e5));
  if (d === 0) return t('today');
  if (d < 30) return t('days_ago', d);
  if (d < 365) return t('months_ago', Math.round(d / 30));
  const y = (d / 365).toFixed(1);
  return t('years_ago', lang === 'de' ? y.replace('.', ',') : y);
}
function shortPath(p) { return p.length > 38 ? '…' + p.slice(-37) : p; }
function escHtml(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

/* ================= Background feedback (drag tint + decision flash) ================= */
const BG_FX = {
  del:  'linear-gradient(90deg, rgba(255,77,109,.32), rgba(255,77,109,.10) 45%, transparent 72%)',
  keep: 'linear-gradient(270deg, rgba(22,192,121,.32), rgba(22,192,121,.10) 45%, transparent 72%)',
  sort: 'radial-gradient(900px circle at 82% 55%, rgba(255,159,28,.30), transparent 65%)',
};
// While dragging: intensity follows the drag distance (the further
// toward "delete", the redder the window gets).
function setBgFx(kind, intensity) {
  const el = $('#bgFx');
  el.style.transition = 'none';
  el.style.background = BG_FX[kind];
  el.style.opacity = Math.min(1, intensity);
}
function clearBgFx() {
  const el = $('#bgFx');
  el.style.transition = 'opacity .2s ease';
  el.style.opacity = 0;
}
// On a decision: short, strong flash that fades out.
function flashBgFx(kind) {
  const el = $('#bgFx');
  el.style.transition = 'none';
  el.style.background = BG_FX[kind];
  el.style.opacity = .85;
  requestAnimationFrame(() => requestAnimationFrame(() => {
    el.style.transition = 'opacity .55s ease';
    el.style.opacity = 0;
  }));
}

/* ================= Screens ================= */
function show(id) { document.querySelectorAll('.screen').forEach(s => s.classList.remove('show')); $('#' + id).classList.add('show'); }

/* ================= Start screen ================= */
function scopeList() {
  return [
    { key:'desktop',   name:t('scope_desktop'),   sub: knownFolders ? shortPath(knownFolders.desktop) : '',
      icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>' },
    { key:'downloads', name:t('scope_downloads'), sub: knownFolders ? shortPath(knownFolders.downloads) : '',
      icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>' },
    { key:'custom',    name:t('scope_custom'),    sub: customPath ? shortPath(customPath) : t('scope_custom_sub'),
      icon: FOLDER_ICON },
  ];
}
function renderStart() {
  $('#scopeGrid').innerHTML = scopeList().map(s => `
    <div class="scope-card ${s.key === scope ? 'active' : ''} ${s.soon ? 'disabled' : ''}" data-scope="${s.key}">
      ${s.soon ? `<span class="soon">${t('soon')}</span>` : ''}
      <div class="ic">${s.icon}</div>
      <div class="nm">${s.name}</div>
      <div class="sub">${s.sub}</div>
    </div>`).join('');
  document.querySelectorAll('[data-scope]').forEach(c => c.onclick = async () => {
    const key = c.dataset.scope;
    if (key === 'custom') {
      const p = await window.sweep.pickFolder();   // real Windows dialog
      if (!p) return;
      customPath = p;
    }
    scope = key;
    renderStart();
  });

  $('#modeList').innerHTML = MODES.map(m => `
    <div class="mode-row ${m.key === mode ? 'active' : ''}" data-mode="${m.key}">
      <div class="ic" style="background:${m.col}">${m.icon}</div>
      <div class="tx"><div class="nm">${t('mode_' + m.key)}</div><div class="ds">${t('mode_' + m.key + '_ds')}</div></div>
      ${m.streak && dailyStreak() > 0 ? `<div class="streak">${t('streak', dailyStreak())}</div>` : ''}
    </div>`).join('');
  document.querySelectorAll('[data-mode]').forEach(c => c.onclick = () => { mode = c.dataset.mode; renderStart(); });
}

function scanPath() {
  if (scope === 'desktop')   return knownFolders.desktop;
  if (scope === 'downloads') return knownFolders.downloads;
  if (scope === 'custom')    return customPath;
  return null;
}
function updatePill() {
  const sName = scopeList().find(s => s.key === scope).name;
  $('#scopePill').textContent = `${sName} · ${t('mode_' + mode)}`;
}

$('#startBtn').onclick = async () => {
  const p = scanPath();
  if (!p) { alert(t('pick_first')); return; }

  status = {}; history = []; activeFilter = 'all'; previewCache.clear();
  keptExpanded = false; lastApply = null;
  show('sweep');
  deckEl.innerHTML = `<div class="scanning"><div class="spinner"></div>${escHtml(t('scanning', shortPath(p)))}</div>`;

  // "Largest first" needs the recursive scan (folders count as one item
  // with their total size); the other modes use the fast top-level scan.
  if (mode === 'largest') {
    allFiles = await window.sweep.scanLargest(p);
  } else {
    allFiles = await window.sweep.scanFolder(p);
  }

  let list = [...allFiles];
  if (mode === 'dupes')   list = list.filter(f => f.dup);   // only the detected duplicates
  if (mode === 'largest') list.sort((a, b) => b.sizeBytes - a.sizeBytes).splice(50);
  if (mode === 'oldest')  list.sort((a, b) => a.mtimeMs - b.mtimeMs).splice(50);
  if (mode === 'newest')  list.sort((a, b) => b.mtimeMs - a.mtimeMs).splice(50);
  if (mode === 'daily')   list = list.sort(() => Math.random() - .5).slice(0, 10);
  session = list.map(f => f.path);

  updatePill();

  if (session.length === 0) {
    deckEl.innerHTML = `<div class="scanning">${mode === 'dupes' ? t('no_dupes') : t('no_files')}</div>`;
    return;
  }
  renderFilters(); renderDock(); renderDeck(); renderHint();
};
$('#backBtn').onclick = () => show('start');

/* ================= Sweep core ================= */
function byPath(p) { return allFiles.find(f => f.path === p); }
function pending() { return session.filter(p => !status[p]).map(byPath).filter(f => f && (activeFilter === 'all' || f.type === activeFilter)); }
function pendingAll() { return session.filter(p => !status[p]); }   // undecided, ignoring the filter
function countType(tKey) { return session.map(byPath).filter(f => f && (tKey === 'all' || f.type === tKey)).length; }

function renderFilters() {
  $('#filters').innerHTML = FILTER_KEYS.map(k => {
    const c = countType(k); if (c === 0 && k !== 'all') return '';
    return `<div class="chip ${k === activeFilter ? 'active' : ''}" data-f="${k}">${t('f_' + k)}<span class="ct">${c}</span></div>`;
  }).join('');
  document.querySelectorAll('.chip').forEach(c => c.onclick = () => { activeFilter = c.dataset.f; renderFilters(); renderDeck(); });
}

function renderDock() {
  $('#dock').innerHTML = folders.map(fo => {
    const n = Object.values(status).filter(s => s.act === 'sorted' && s.folder === fo.id).length;
    return `<div class="folder" data-folder="${fo.id}" title="${fo.path}${fo.virtual ? t('created') : ''}">
      <button class="funpin" data-unpin="${fo.id}" title="${t('unpin')}">×</button>
      ${fo.sys ? '<span class="sys">WIN</span>' : ''}
      <div class="badge ${n > 0 ? 'show' : ''}">${n}</div>
      <div class="fic">${FOLDER_ICON}</div>
      <div class="fnm">${fo.name}</div>
      <div class="fct">${n > 0 ? t('files_n', n) : t('empty')}</div>
    </div>`;
  }).join('') + `<div class="folder add" id="addFolder"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg><div class="fnm">${t('new_folder')}</div></div>`;
  document.querySelectorAll('.folder[data-folder]').forEach(el => el.onclick = () => decide('sort', el.dataset.folder));
  document.querySelectorAll('[data-unpin]').forEach(b => b.onclick = e => {
    e.stopPropagation();                 // otherwise the folder click would trigger "sort"
    openRemoveModal(b.dataset.unpin);
  });
  $('#addFolder').onclick = openFolderModal;
}

/* ---------- Previews ---------- */
function placeholderPreview(f) {
  // Folder (from "largest" mode): a big folder tile showing how much
  // space it occupies and how many files it contains. The content peek
  // is filled in lazily (see hydratePreview / list-folder).
  if (f.type === 'folder') {
    return `<div class="folder-preview" style="--c:${COLORS.folder}">
      <div class="folder-head">
        <div class="folder-ico">${FOLDER_ICON}</div>
        <div class="folder-meta"><div class="folder-size">${fmtKB(f.sizeKB)}</div>
        <div class="folder-count">${t('files_inside', f.count || 0)}</div></div>
      </div>
      <div class="folder-peek" data-peek></div>
    </div>`;
  }
  // Shortcut (.lnk/.url): real Windows icon filled in lazily; until then
  // a generic icon with the corner arrow.
  if (f.type === 'shortcut') {
    const targetLine = f.ext === 'LNK' ? '…' : f.ext;   // only .lnk resolves to a real target
    return `<div class="shortcut-preview" style="--c:${COLORS.shortcut}">
      <div class="shortcut-ico" data-icoslot>
        <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>
        <span class="arrow-badge">↗</span>
      </div>
      <div class="shortcut-target" data-target>${targetLine}</div>
    </div>`;
  }
  // Executable / installer: real Windows icon filled in lazily.
  if (f.type === 'app') {
    return `<div class="app-preview" style="--c:${COLORS.app}">
      <div class="app-ico" data-icoslot><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg></div>
      <div class="app-ext">${f.ext}</div>
    </div>`;
  }
  // Video: a film-strip placeholder; the real frame is drawn in lazily.
  if (f.type === 'video') {
    return `<div class="video-preview" style="--c:${COLORS.video}" data-videoslot>
      <div class="generic-ico" style="background:linear-gradient(135deg,${COLORS.video},#ff7bb0)"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M10 9l5 3-5 3z"/></svg></div>
    </div>`;
  }
  if (f.type === 'audio') {
    return `<div class="generic-ico" style="background:linear-gradient(135deg,${COLORS.audio},#55efc4)"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg></div>`;
  }
  if (f.type === 'sheet') {
    let c = ''; for (let i = 0; i < 16; i++) c += `<div class="sheet-cell ${i < 4 ? 'h' : ''}"></div>`;
    return `<div class="doc-preview"><div class="tag" style="background:${COLORS.sheet}">${f.ext}</div><div class="doc-head" style="background:${COLORS.sheet}55"></div><div class="sheet-grid">${c}</div></div>`;
  }
  if (f.type === 'doc' || f.type === 'pdf') {
    const col = COLORS[f.type]; let l = '';
    [100, 92, 96, 70, 100, 88, 94, 60].forEach(w => l += `<div class="doc-line" style="width:${w}%"></div>`);
    return `<div class="doc-preview"><div class="tag" style="background:${col}">${f.ext}</div><div class="doc-head" style="background:${col}55"></div>${l}</div>`;
  }
  if (f.type === 'image') return `<div class="img-preview"><div class="ph" style="background:linear-gradient(135deg,#2a2a36,#3a3a4a)"></div></div>`;
  if (f.type === 'text')  return `<div class="txt-preview"><span class="tag" style="background:${COLORS.text}">${f.ext}</span>…</div>`;
  if (f.type === 'model') return `<div class="generic-ico" style="background:linear-gradient(135deg,${COLORS.model},#6be0f2)"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="M3.3 7 12 12l8.7-5M12 22V12"/></svg></div>`;
  if (f.type === 'archive') return `<div class="generic-ico" style="background:linear-gradient(135deg,${COLORS.archive},#e8aa5e)"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="4" rx="1"/><path d="M5 8v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8M10 12h4"/></svg></div>`;
  return `<div class="generic-ico" style="background:linear-gradient(135deg,${COLORS.other},#ffbe5c)"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg></div>`;
}

// ---------- Images: bytes → Blob → let Chromium render ----------
// (Chromium decodes webp, gif, bmp, svg … – Electron's nativeImage doesn't.)
const IMG_MIME = { jpg:'image/jpeg', jpeg:'image/jpeg', png:'image/png', gif:'image/gif',
                   webp:'image/webp', bmp:'image/bmp', svg:'image/svg+xml', heic:'image/heic' };
async function imagePreview(f) {
  const bytes = await window.sweep.readFileBytes(f.path, 30 * 1024 * 1024);
  if (!bytes) return null;
  const blob = new Blob([bytes], { type: IMG_MIME[f.ext.toLowerCase()] || 'image/png' });
  const url = URL.createObjectURL(blob);
  // Probe-load: yields the real pixel dimensions – and tells us whether
  // Chromium can decode the format at all (heic, for example, fails).
  const dim = await new Promise(res => {
    const im = new Image();
    im.onload  = () => res(`${im.naturalWidth} × ${im.naturalHeight}`);
    im.onerror = () => res(null);
    im.src = url;
  });
  if (dim === null) { URL.revokeObjectURL(url); return null; }
  return { kind: 'image', url, dim };
}

// ---------- Excel (.xlsx/.xls): the first few rows ----------
async function sheetPreview(f) {
  if (!window.XLSX) return null;
  const bytes = await window.sweep.readFileBytes(f.path, 20 * 1024 * 1024);
  if (!bytes) return null;
  const wb = window.XLSX.read(bytes, { type: 'array', sheetRows: 12 }); // parse only the first rows
  const sheetName = wb.SheetNames[0];
  const rows = window.XLSX.utils.sheet_to_json(wb.Sheets[sheetName], { header: 1, defval: '' });
  return { kind: 'sheet', rows: rows.slice(0, 9).map(r => r.slice(0, 6)), sheets: wb.SheetNames.length, sheetName };
}

// ---------- ZIP: show the table of contents only ----------
async function zipPreview(f) {
  const z = await window.sweep.listZip(f.path);
  if (!z) return null;
  return { kind: 'zip', entries: z.entries.slice(0, 9), total: z.total };
}

// ---------- STL (3D printing models): mini 3D view ----------
// An STL is just a long list of triangles. We read them, rotate the
// model into a nice perspective, sort by depth (painter's algorithm)
// and draw them shaded onto a canvas.
function parseSTL(bytes) {
  const tris = [];
  const headText = new TextDecoder().decode(bytes.slice(0, 512));
  if (/^\s*solid/.test(headText) && headText.includes('facet')) {
    // ASCII variant
    const txt = new TextDecoder().decode(bytes);
    const re = /vertex\s+([-\d.eE+]+)\s+([-\d.eE+]+)\s+([-\d.eE+]+)/g;
    const v = []; let m;
    while ((m = re.exec(txt)) && v.length < 3 * 40000) v.push([+m[1], +m[2], +m[3]]);
    for (let i = 0; i + 2 < v.length; i += 3) tris.push([v[i], v[i + 1], v[i + 2]]);
  } else {
    // Binary variant: 80-byte header, uint32 count, then 50 bytes per triangle
    const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    if (bytes.byteLength < 84) return tris;
    const n = dv.getUint32(80, true);
    const limit = 40000;                              // thin out huge models
    const step = n > limit ? Math.ceil(n / limit) : 1;
    for (let i = 0; i < n; i += step) {
      const o = 84 + i * 50 + 12;                     // +12 skips the normal vector
      if (o + 36 > bytes.byteLength) break;
      tris.push([
        [dv.getFloat32(o, true),      dv.getFloat32(o + 4, true),  dv.getFloat32(o + 8, true)],
        [dv.getFloat32(o + 12, true), dv.getFloat32(o + 16, true), dv.getFloat32(o + 20, true)],
        [dv.getFloat32(o + 24, true), dv.getFloat32(o + 28, true), dv.getFloat32(o + 32, true)],
      ]);
    }
  }
  return tris;
}
async function stlPreview(f) {
  const bytes = await window.sweep.readFileBytes(f.path, 60 * 1024 * 1024);
  if (!bytes) return null;
  const tris = parseSTL(bytes);
  if (!tris.length) return null;

  // Center the model and scale it to unit size
  let min = [1e30, 1e30, 1e30], max = [-1e30, -1e30, -1e30];
  for (const tr of tris) for (const p of tr) for (let k = 0; k < 3; k++) {
    if (p[k] < min[k]) min[k] = p[k]; if (p[k] > max[k]) max[k] = p[k];
  }
  const c = [(min[0] + max[0]) / 2, (min[1] + max[1]) / 2, (min[2] + max[2]) / 2];
  const s = 2 / Math.max(max[0] - min[0], max[1] - min[1], max[2] - min[2], 1e-9);

  // Rotate a bit so the model is seen "from above at an angle"
  const a = -1.05, b = 0.65, ca = Math.cos(a), sa = Math.sin(a), cb = Math.cos(b), sb = Math.sin(b);
  const rot = p => {
    let x = (p[0] - c[0]) * s, y = (p[1] - c[1]) * s, z = (p[2] - c[2]) * s;
    [x, y] = [x * cb - y * sb, x * sb + y * cb];      // rotate around Z
    [y, z] = [y * ca - z * sa, y * sa + z * ca];      // tilt around X
    return [x, y, z];
  };
  const L = [0.35, -0.5, 0.8], Ln = Math.hypot(...L); L.forEach((v, i) => L[i] = v / Ln); // light direction

  const W = 380, H = 300, canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');
  const proj = p => [W / 2 + p[0] * H * 0.42, H / 2 - p[2] * H * 0.42];

  const drawList = tris.map(tr => {
    const r = [rot(tr[0]), rot(tr[1]), rot(tr[2])];
    // face normal for lighting (cross product)
    const u = [r[1][0] - r[0][0], r[1][1] - r[0][1], r[1][2] - r[0][2]];
    const v = [r[2][0] - r[0][0], r[2][1] - r[0][1], r[2][2] - r[0][2]];
    let nx = u[1] * v[2] - u[2] * v[1], ny = u[2] * v[0] - u[0] * v[2], nz = u[0] * v[1] - u[1] * v[0];
    const nl = Math.hypot(nx, ny, nz) || 1; nx /= nl; ny /= nl; nz /= nl;
    const light = Math.max(0, nx * L[0] + ny * L[1] + nz * L[2]);
    return { r, depth: (r[0][1] + r[1][1] + r[2][1]) / 3, light };
  }).sort((p, q) => q.depth - p.depth);   // paint back-to-front

  for (const tr of drawList) {
    const g = Math.round(70 + tr.light * 170);
    ctx.fillStyle = `rgb(${Math.round(g * 0.55)},${Math.round(g * 0.78)},${g})`; // bluish sheen
    ctx.beginPath();
    const [x0, y0] = proj(tr.r[0]); ctx.moveTo(x0, y0);
    const [x1, y1] = proj(tr.r[1]); ctx.lineTo(x1, y1);
    const [x2, y2] = proj(tr.r[2]); ctx.lineTo(x2, y2);
    ctx.closePath(); ctx.fill();
  }
  return { kind: 'stl', dataUrl: canvas.toDataURL('image/png'), tris: tris.length };
}

// ---------- PDF: render the first page as an image ----------
async function pdfPreview(f) {
  if (!window.pdfjsLib) await new Promise(r => window.addEventListener('pdfjs-ready', r, { once: true }));
  const bytes = await window.sweep.readFileBytes(f.path, 30 * 1024 * 1024);
  if (!bytes) return null;
  const pdf = await window.pdfjsLib.getDocument({ data: bytes }).promise;
  const page = await pdf.getPage(1);
  const base = page.getViewport({ scale: 1 });
  const scale = Math.min(2, 420 / base.width);      // scale to card width
  const vp = page.getViewport({ scale });
  const canvas = document.createElement('canvas');  // an off-screen canvas is enough
  canvas.width = vp.width; canvas.height = vp.height;
  await page.render({ canvasContext: canvas.getContext('2d'), viewport: vp }).promise;
  return { kind: 'pdf', dataUrl: canvas.toDataURL('image/png'), pages: pdf.numPages };
}

// ---------- Word (.docx): content to HTML, then sanitize ----------
// mammoth produces harmless HTML, but we clean it anyway: never put
// foreign HTML into your own UI unchecked.
function sanitizeHtml(html) {
  const tpl = document.createElement('template');
  tpl.innerHTML = html;
  tpl.content.querySelectorAll('script,iframe,object,embed,link,style,form').forEach(n => n.remove());
  tpl.content.querySelectorAll('*').forEach(el => {
    for (const a of [...el.attributes]) {
      const n = a.name.toLowerCase();
      if (n.startsWith('on')) el.removeAttribute(a.name);                              // onclick & co.
      if (n === 'href') el.removeAttribute(a.name);                                    // no links
      if (n === 'src' && !a.value.startsWith('data:image/')) el.removeAttribute(a.name); // embedded images only
    }
  });
  return tpl.innerHTML;
}
async function docxPreview(f) {
  const bytes = await window.sweep.readFileBytes(f.path, 20 * 1024 * 1024);
  if (!bytes || !window.mammoth) return null;
  const res = await window.mammoth.convertToHtml({
    arrayBuffer: bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)
  });
  const html = sanitizeHtml(res.value).trim();
  return { kind: 'docx', html: html || '<p><i>(empty document)</i></p>' };
}

// ---------- Shortcut (.lnk): real icon + resolve where it points ----------
async function shortcutPreview(f) {
  const icon = await window.sweep.getFileIcon(f.path);   // real Windows icon (with arrow)
  let target = '';
  if (f.ext === 'LNK') {
    const info = await window.sweep.readShortcut(f.path);
    if (info && info.target) target = info.target;
  }
  if (!icon && !target) return null;
  return { kind: 'shortcut', icon, target };
}

// ---------- Executable / installer: real Windows icon ----------
async function appPreview(f) {
  const icon = await window.sweep.getFileIcon(f.path);
  if (!icon) return null;
  return { kind: 'app', icon };
}

// ---------- Folder: peek at the top-level contents (like a ZIP) ----------
async function folderPreview(f) {
  const data = await window.sweep.listFolder(f.path);
  if (!data || !data.items.length) return null;
  return { kind: 'folder', items: data.items, total: data.total };
}

// ---------- Video: grab a single frame as a thumbnail ----------
// We read the bytes into a same-origin Blob (avoids canvas "tainting"),
// load it into an off-screen <video>, seek a little in, and snapshot
// one frame. Only works for codecs Chromium can decode (mp4/webm); for
// anything else or files over the cap we keep the film-strip placeholder.
async function videoPreview(f) {
  const bytes = await window.sweep.readFileBytes(f.path, 150 * 1024 * 1024);
  if (!bytes) return null;
  const url = URL.createObjectURL(new Blob([bytes], { type: 'video/mp4' }));
  const shot = await new Promise(resolve => {
    const v = document.createElement('video');
    v.muted = true; v.preload = 'metadata';
    let done = false;
    const fail = () => { if (!done) { done = true; resolve(null); } };
    const timer = setTimeout(fail, 6000);   // give up if it never decodes
    v.onloadeddata = () => {
      // seek ~1s in (or 10%) so we don't snapshot a black first frame
      try { v.currentTime = Math.min(1, (v.duration || 2) * 0.1); } catch { fail(); }
    };
    v.onseeked = () => {
      if (done) return; done = true; clearTimeout(timer);
      try {
        const W = 420, scale = W / (v.videoWidth || W);
        const c = document.createElement('canvas');
        c.width = W; c.height = Math.round((v.videoHeight || 236) * scale);
        c.getContext('2d').drawImage(v, 0, 0, c.width, c.height);
        resolve({ dataUrl: c.toDataURL('image/jpeg', 0.8), dim: `${v.videoWidth} × ${v.videoHeight}` });
      } catch { resolve(null); }
    };
    v.onerror = fail;
    v.src = url;
  });
  URL.revokeObjectURL(url);
  if (!shot) return null;
  return { kind: 'video', ...shot };
}

// Load the real preview lazily (visible cards only, with cache)
async function hydratePreview(cardEl, f) {
  let pv = previewCache.get(f.path);
  if (pv === undefined) {
    try {
      if      (f.type === 'image')                       pv = await imagePreview(f);
      else if (f.type === 'shortcut')                    pv = await shortcutPreview(f);
      else if (f.type === 'app')                         pv = await appPreview(f);
      else if (f.type === 'folder')                      pv = await folderPreview(f);
      else if (f.type === 'video')                       pv = await videoPreview(f);
      else if (f.type === 'text')                        pv = await window.sweep.getPreview(f.path, f.type);
      else if (f.type === 'pdf')                         pv = await pdfPreview(f);
      else if (f.type === 'doc' && f.ext === 'DOCX')     pv = await docxPreview(f);
      else if (f.type === 'sheet' && f.ext !== 'CSV')    pv = await sheetPreview(f);
      else if (f.type === 'sheet' && f.ext === 'CSV')    pv = await window.sweep.getPreview(f.path, 'text');
      else if (f.type === 'archive' && f.ext === 'ZIP')  pv = await zipPreview(f);
      else if (f.type === 'model' && f.ext === 'STL')    pv = await stlPreview(f);
      else pv = null;
    } catch { pv = null; }
    previewCache.set(f.path, pv);
  }
  if (!pv || !cardEl.isConnected) return;
  const slot = cardEl.querySelector('.preview-slot');
  if (!slot) return;

  if (pv.kind === 'image') {
    slot.innerHTML = `<div class="img-preview"><div class="ph real" style="background-image:url('${pv.url}')"></div><div class="dim">${pv.dim}</div></div>`;
  } else if (pv.kind === 'text') {
    slot.innerHTML = `<div class="txt-preview"><span class="tag" style="background:${COLORS.text}">${f.ext}</span>${escHtml(pv.text)}</div>`;
  } else if (pv.kind === 'pdf') {
    slot.innerHTML = `<div class="pdf-preview"><img src="${pv.dataUrl}" alt="" draggable="false"><div class="pv-badge">${t('pdf_page', pv.pages)}</div></div>`;
  } else if (pv.kind === 'docx') {
    slot.innerHTML = `<div class="doc-html"><span class="tag" style="background:${COLORS.doc}">${f.ext}</span><div class="doc-html-inner">${pv.html}</div></div>`;
  } else if (pv.kind === 'sheet') {
    const rows = pv.rows.map((r, i) => `<tr>${r.map(cell => `<t${i === 0 ? 'h' : 'd'}>${escHtml(cell)}</t${i === 0 ? 'h' : 'd'}>`).join('')}</tr>`).join('');
    slot.innerHTML = `<div class="sheet-real"><span class="tag" style="background:${COLORS.sheet}">${f.ext}</span>
      <table>${rows}</table></div>
      <div class="pv-badge">${t('sheets_badge', pv.sheets, escHtml(pv.sheetName))}</div>`;
  } else if (pv.kind === 'zip') {
    const list = pv.entries.map(e => {
      const isDir = e.name.endsWith('/');
      return `<div class="zip-row">${isDir ? '📁' : '📄'} <span class="zn">${escHtml(e.name)}</span>${isDir ? '' : `<span class="zs">${fmtKB(Math.max(1, Math.round(e.size / 1024)))}</span>`}</div>`;
    }).join('');
    const more = pv.total > pv.entries.length ? `<div class="zip-row more">${t('zip_more', pv.total - pv.entries.length)}</div>` : '';
    slot.innerHTML = `<div class="zip-list"><span class="tag" style="background:${COLORS.archive}">${f.ext}</span>${list}${more}</div>
      <div class="pv-badge">${t('zip_badge', pv.total)}</div>`;
  } else if (pv.kind === 'stl') {
    slot.innerHTML = `<div class="pdf-preview stl"><img src="${pv.dataUrl}" alt="" draggable="false"><div class="pv-badge">${t('tris', pv.tris)}</div></div>`;
  } else if (pv.kind === 'shortcut') {
    // Swap the generic icon for the real one (keep the corner arrow),
    // and fill in the resolved target line.
    const icoSlot = slot.querySelector('[data-icoslot]');
    if (icoSlot && pv.icon) icoSlot.innerHTML = `<img class="real-ico" src="${pv.icon}" alt="" draggable="false"><span class="arrow-badge">↗</span>`;
    const tEl = slot.querySelector('[data-target]');
    if (tEl && pv.target) tEl.innerHTML = `<span class="pt">${t('points_to')}</span> ${escHtml(pv.target)}`;
  } else if (pv.kind === 'app') {
    const icoSlot = slot.querySelector('[data-icoslot]');
    if (icoSlot && pv.icon) icoSlot.innerHTML = `<img class="real-ico" src="${pv.icon}" alt="" draggable="false">`;
  } else if (pv.kind === 'folder') {
    const peek = slot.querySelector('[data-peek]');
    if (peek) {
      const rows = pv.items.map(e =>
        `<div class="zip-row">${e.isDir ? '📁' : '📄'} <span class="zn">${escHtml(e.name)}</span>${e.isDir ? '' : `<span class="zs">${fmtKB(Math.max(1, Math.round(e.size / 1024)))}</span>`}</div>`
      ).join('');
      const more = pv.total > pv.items.length ? `<div class="zip-row more">${t('folder_peek_more', pv.total - pv.items.length)}</div>` : '';
      peek.innerHTML = rows + more;
    }
  } else if (pv.kind === 'video') {
    slot.innerHTML = `<div class="pdf-preview video"><img src="${pv.dataUrl}" alt="" draggable="false">
      <div class="play-glyph">▶</div><div class="pv-badge">${pv.dim} · ${t('video_badge')}</div></div>`;
  }
}

function cardHTML(f, cls) {
  const dup = f.dup ? `<div class="dup-badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>${t('dup')}</div>` : '';
  // Deleting a folder removes everything inside it – make that explicit.
  const warn = f.isDir ? `<div class="folder-warn">⚠️ ${t('folder_warn')}</div>` : '';
  return `<div class="card ${cls}" data-path="${encodeURIComponent(f.path)}">
    <div class="tint"></div>
    <div class="stamp keep">${t('act_keep')}</div>
    <div class="stamp del">${t('act_del')}</div>
    <div class="preview">${dup}<div class="preview-slot" style="display:contents">${placeholderPreview(f)}</div></div>
    <div class="meta">
      <div class="fname">${f.name}</div>
      <div class="fpath" title="${f.path}">${f.path}</div>
      <div class="tags">
        <span class="tag-chip"><span class="swatch" style="background:${COLORS[f.type]}"></span>${t('t_' + f.type)}</span>
        <span class="tag-chip">${fmtKB(f.sizeKB)}</span>
        <span class="tag-chip">${fmtAge(f.mtimeMs)}</span>
      </div>
      ${warn}
      <div class="ai-row">
        <button class="open-link" data-open>${t('show_explorer')}</button>
        <button class="open-link" data-openfile style="margin-left:12px">${t('open_file')}</button>
      </div>
    </div>
  </div>`;
}

function renderDeck() {
  const p = pending();
  const total = countType(activeFilter);
  const done = total - p.length;
  $('#progressBar').style.width = total ? (done / total * 100) + '%' : '0%';
  $('#progressLabel').textContent = `${done} / ${total}`;
  $('#undoBtn').disabled = history.length === 0;

  if (p.length === 0) {
    // Only finish when EVERYTHING is decided. If just the current filter
    // is exhausted (but other files remain), show a hint instead of
    // jumping to the review screen.
    if (pendingAll().length === 0) {
      if (Object.keys(status).length > 0) openReview();
      else show('start');
    } else {
      clearBgFx();
      deckEl.innerHTML = `<div class="scanning">${t('filter_done')}</div>`;
    }
    return;
  }
  const slice = p.slice(0, 3).reverse();
  deckEl.innerHTML = slice.map((f, idx) => {
    const fromTop = slice.length - 1 - idx;
    return cardHTML(f, fromTop === 0 ? 'top' : fromTop === 1 ? 'behind' : 'behind2');
  }).join('');

  // Load previews for the visible cards
  deckEl.querySelectorAll('.card').forEach(el => {
    const f = byPath(decodeURIComponent(el.dataset.path));
    if (f) hydratePreview(el, f);
  });
  attachTop();
}

/* ================= Decisions ================= */
function decide(act, folder) {
  const p = pending(); if (!p.length) return;
  const f = p[0];
  if (act === 'skip') {
    session.push(session.splice(session.indexOf(f.path), 1)[0]);
    flyOut('skip'); setTimeout(renderDeck, 240); return;
  }
  if (act === 'sort' && !folder) { openPick(); return; }
  status[f.path] = { act: act === 'del' ? 'deleted' : act === 'keep' ? 'kept' : 'sorted', folder };
  history.push(f.path);
  // Short background flash matching the decision
  if (act === 'del')  flashBgFx('del');
  if (act === 'keep') flashBgFx('keep');
  if (act === 'sort') flashBgFx('sort');
  flyOut(act, folder);
  setTimeout(() => { renderDeck(); renderDock(); }, 240);
}
function flyOut(act, folder) {
  const card = deckEl.querySelector('.card.top'); if (!card) return;
  let tx = 0, ty = 0, rot = 0;
  if (act === 'del')  { tx = -700; rot = -14; }
  if (act === 'keep') { tx = 700; rot = 14; }
  if (act === 'skip') { ty = 700; }
  if (act === 'sort') {
    const fEl = document.querySelector(`.folder[data-folder="${folder}"]`);
    if (fEl) {
      const fr = fEl.getBoundingClientRect(), cr = card.getBoundingClientRect();
      tx = fr.left + fr.width / 2 - (cr.left + cr.width / 2);
      ty = fr.top + fr.height / 2 - (cr.top + cr.height / 2);
      card.style.transition = 'transform .32s cubic-bezier(.4,.7,.4,1), opacity .32s ease';
      card.style.transform = `translate(${tx}px,${ty}px) scale(.1) rotate(6deg)`; card.style.opacity = '0'; return;
    }
    ty = -700;
  }
  card.style.transition = 'transform .26s ease, opacity .26s ease';
  card.style.transform = `translate(${tx}px,${ty}px) rotate(${rot}deg)`; card.style.opacity = '0';
}
function undo() {
  if (!history.length) return;
  const p = history.pop(); delete status[p];
  renderDeck(); renderDock();
}

/* ================= Drag handling ================= */
function attachTop() {
  const card = deckEl.querySelector('.card.top'); if (!card) return;
  const f = byPath(decodeURIComponent(card.dataset.path));
  const tint = card.querySelector('.tint');
  const sKeep = card.querySelector('.stamp.keep'), sDel = card.querySelector('.stamp.del');
  let sx, sy, dx = 0, dy = 0, drag = false, hotFolder = null;
  let curScale = 1;   // smoothly animated card scale (shrinks over a folder)

  card.querySelector('[data-open]').onclick     = e => { e.stopPropagation(); window.sweep.showInFolder(f.path); };
  card.querySelector('[data-openfile]').onclick = e => { e.stopPropagation(); window.sweep.openFile(f.path); };

  function setHot(el) {
    if (hotFolder === el) return;
    if (hotFolder) hotFolder.classList.remove('hot');
    hotFolder = el; if (el) el.classList.add('hot');
  }
  function down(e) {
    if (e.target.closest('.open-link')) return;
    drag = true; sx = e.clientX; sy = e.clientY; card.style.transition = 'none';
    card.setPointerCapture(e.pointerId);
  }
  function move(e) {
    if (!drag) return;
    dx = e.clientX - sx; dy = e.clientY - sy;

    // Is there a folder under the pointer?
    card.style.pointerEvents = 'none';
    const under = document.elementFromPoint(e.clientX, e.clientY);
    card.style.pointerEvents = '';
    const fEl = under ? under.closest('.folder[data-folder]') : null;
    setHot(fEl);

    // The card shrinks smoothly while hovering a folder (lerp keeps
    // it fluid even though we re-set the transform every move event).
    const targetScale = fEl ? 0.7 : 1;
    curScale += (targetScale - curScale) * 0.22;
    card.style.transform = `translate(${dx}px,${dy}px) rotate(${dx * 0.05}deg) scale(${curScale.toFixed(3)})`;

    if (fEl) {
      sKeep.style.opacity = 0; sDel.style.opacity = 0;
      tint.style.background = 'var(--sort-soft)'; tint.style.opacity = .8;
      setBgFx('sort', .8);
      return;
    }
    // The further you drag, the stronger card tint, stamp AND the
    // whole window background react ("the redder, the more certain").
    const ax = Math.min(Math.abs(dx) / 130, 1);
    if (dx > 0) {
      sKeep.style.opacity = ax; sDel.style.opacity = 0;
      tint.style.background = 'var(--keep-soft)'; tint.style.opacity = ax;
      setBgFx('keep', ax);
    } else {
      sDel.style.opacity = ax; sKeep.style.opacity = 0;
      tint.style.background = 'var(--del-soft)'; tint.style.opacity = ax;
      setBgFx('del', ax);
    }
  }
  function up() {
    if (!drag) return; drag = false;
    if (hotFolder) { const fid = hotFolder.dataset.folder; setHot(null); return decide('sort', fid); }
    setHot(null);
    const TH = 110;
    if (dx >  TH) return decide('keep');
    if (dx < -TH) return decide('del');
    // Snap back: card returns, background fades out
    card.style.transition = 'transform .25s ease'; card.style.transform = '';
    sKeep.style.opacity = 0; sDel.style.opacity = 0; tint.style.opacity = 0;
    clearBgFx();
    dx = dy = 0; curScale = 1;
  }
  card.addEventListener('pointerdown', down);
  card.addEventListener('pointermove', move);
  card.addEventListener('pointerup', up);
  card.addEventListener('pointercancel', up);
}

/* ================= Folder modal: create, pin, remove ================= */
let newParent = null;   // chosen location for new folders
function locOptions() {
  return [
    { label: t('documents'),     path: knownFolders.documents },
    { label: t('scope_desktop'), path: knownFolders.desktop },
    { label: t('pictures'),      path: knownFolders.pictures },
    { label: t('scope_downloads'), path: knownFolders.downloads },
  ];
}
function renderLocRow() {
  const opts = locOptions();
  const isCustom = newParent && !opts.some(o => o.path === newParent.path);
  $('#locRow').innerHTML = opts.map(o =>
    `<div class="loc-chip ${newParent && newParent.path === o.path ? 'active' : ''}" data-loc="${encodeURIComponent(o.path)}" data-label="${o.label}">${o.label}</div>`
  ).join('') + `<div class="loc-chip ${isCustom ? 'active' : ''}" data-loc-pick>${isCustom ? shortPath(newParent.path) : t('other_loc')}</div>`;
  document.querySelectorAll('[data-loc]').forEach(el => el.onclick = () => {
    newParent = { label: el.dataset.label, path: decodeURIComponent(el.dataset.loc) };
    renderLocRow();
  });
  document.querySelector('[data-loc-pick]').onclick = async () => {
    const p = await window.sweep.pickFolder();
    if (!p) return;
    newParent = { label: 'custom', path: p };
    renderLocRow();
  };
}
function openFolderModal() {
  newParent = locOptions()[0];   // default: Documents
  $('#scrim').classList.add('show'); $('#folderModal').classList.add('show');
  $('#folderInput').value = ''; renderLocRow();
  setTimeout(() => $('#folderInput').focus(), 100);
}
function closeModals() {
  $('#scrim').classList.remove('show');
  document.querySelectorAll('.modal').forEach(m => m.classList.remove('show'));
  $('#drawer').classList.remove('show');
  listeningFor = null;
}
$('#folderCancel').onclick = closeModals;
$('#folderCreate').onclick = createFolder;
$('#folderInput').addEventListener('keydown', e => { if (e.key === 'Enter') createFolder(); });
function createFolder() {
  const v = $('#folderInput').value.trim(); if (!v) return;
  // "Virtual": the folder is only created on "Yes, apply" – until
  // then it exists in Sweep only.
  folders.push({ id: 'f' + Date.now(), name: v, path: joinPath(newParent.path, v), virtual: true, sys: false });
  savePrefs(); closeModals(); renderDock();
}
// Pin an existing folder from the PC (real picker dialog)
$('#pinExisting').onclick = async () => {
  const p = await window.sweep.pickFolder();
  if (!p) return;
  if (folders.some(f => f.path === p)) { closeModals(); return; }  // already pinned
  const name = p.split(/[\\/]/).filter(Boolean).pop() || p;
  folders.push({ id: 'f' + Date.now(), name, path: p, virtual: false, sys: false });
  savePrefs(); closeModals(); renderDock();
};

// ---- Remove a folder from the dock (with confirmation) ----
let pendingRemoveId = null;
function openRemoveModal(id) {
  const fo = folders.find(f => f.id === id); if (!fo) return;
  pendingRemoveId = id;
  const n = Object.entries(status).filter(([, s]) => s.act === 'sorted' && s.folder === id).length;
  $('#removeText').innerHTML = t('rm_text', escHtml(fo.name)) + (n ? t('rm_files', n) : '');
  $('#scrim').classList.add('show'); $('#removeModal').classList.add('show');
}
$('#removeCancel').onclick = closeModals;
$('#removeConfirm').onclick = () => {
  const id = pendingRemoveId; pendingRemoveId = null;
  if (!id) return closeModals();
  // Files sorted into this folder during this session go back to the queue
  for (const [p, s] of Object.entries(status)) {
    if (s.act === 'sorted' && s.folder === id) {
      delete status[p];
      history = history.filter(h => h !== p);
      session.push(session.splice(session.indexOf(p), 1)[0]);  // re-queue at the end
    }
  }
  const fo = folders.find(f => f.id === id);
  if (fo && fo.sys) hiddenSys.push(id);          // default folders: remember as hidden
  folders = folders.filter(f => f.id !== id);
  savePrefs(); closeModals();
  renderDock(); renderFilters(); renderDeck();
};

function openPick() {
  $('#pickList').innerHTML = folders.map((fo, i) => `
    <div class="pick-item" data-pick="${fo.id}">${FOLDER_ICON}${fo.name}<span class="num">${i + 1}</span></div>`).join('')
    + `<div class="pick-item" data-pick-new><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>${t('pick_new')}</div>`;
  $('#scrim').classList.add('show'); $('#pickModal').classList.add('show');
  document.querySelectorAll('[data-pick]').forEach(el => el.onclick = () => { const fid = el.dataset.pick; closeModals(); decide('sort', fid); });
  const nw = document.querySelector('[data-pick-new]'); if (nw) nw.onclick = () => { closeModals(); openFolderModal(); };
}
$('#scrim').onclick = closeModals;

/* ================= Review ================= */
function folderById(id) { return folders.find(f => f.id === id); }
function folderTargetDir(fo) { return fo.path; }
function miniIcon(f) { return `<div class="mini" style="background:${COLORS[f.type]}">${f.ext}</div>`; }

function openReview() {
  show('review');
  const get = act => session.map(byPath).filter(f => f && status[f.path] && status[f.path].act === act);
  const del = get('deleted'), sorted = get('sorted'), kept = get('kept');

  let html = '';
  html += `<div class="rev-sec"><div class="rev-sec-head"><span class="dot" style="background:var(--del)"></span><h3>${t('rev_del')}</h3><span class="n">${t('files_n', del.length)}</span></div>`;
  html += del.length ? del.map(f => `
    <div class="rev-item">${miniIcon(f)}<div class="inf"><div class="nm">${f.name}</div><div class="sz">${fmtKB(f.sizeKB)} · ${fmtAge(f.mtimeMs)}</div></div>
    <button class="restore" data-restore="${encodeURIComponent(f.path)}">${t('keep_btn')}</button></div>`).join('')
    : `<div class="rev-empty">${t('none_del')}</div>`;
  html += `</div>`;

  html += `<div class="rev-sec"><div class="rev-sec-head"><span class="dot" style="background:var(--sort)"></span><h3>${t('rev_sort')}</h3><span class="n">${t('files_n', sorted.length)}</span></div>`;
  if (sorted.length) {
    folders.forEach(fo => {
      const inF = sorted.filter(f => status[f.path].folder === fo.id);
      if (!inF.length) return;
      html += `<div class="rev-folder-group"><div class="fg-head">${FOLDER_ICON}${fo.name}
        <span class="arrow">→ ${folderTargetDir(fo)}${fo.virtual ? t('created') : ''}</span></div>`;
      html += inF.map(f => `<div class="rev-item">${miniIcon(f)}<div class="inf"><div class="nm">${f.name}</div><div class="sz">${fmtKB(f.sizeKB)}</div></div>
        <button class="restore" data-restore="${encodeURIComponent(f.path)}">${t('back')}</button></div>`).join('');
      html += `</div>`;
    });
  } else html += `<div class="rev-empty">${t('none_sort')}</div>`;
  html += `</div>`;

  // "Stays where it is": the same tidy tiles, compact in a grid –
  // collapsed at first when there are many files.
  const KEPT_LIMIT = 12;
  const keptShown = keptExpanded ? kept : kept.slice(0, KEPT_LIMIT);
  html += `<div class="rev-sec"><div class="rev-sec-head"><span class="dot" style="background:var(--keep)"></span><h3>${t('rev_keep')}</h3><span class="n">${t('files_n', kept.length)}</span></div>`;
  if (kept.length) {
    html += `<div class="rev-grid">` + keptShown.map(f => `
      <div class="rev-item slim">${miniIcon(f)}<div class="inf"><div class="nm" title="${f.name}">${f.name}</div><div class="sz">${fmtKB(f.sizeKB)}</div></div>
      <button class="restore" data-restore="${encodeURIComponent(f.path)}">${t('again_btn')}</button></div>`).join('') + `</div>`;
    if (kept.length > KEPT_LIMIT) {
      html += `<button class="btn-ghost wide" data-kept-toggle style="margin-top:10px">${keptExpanded ? t('show_less') : t('show_all', kept.length)}</button>`;
    }
  } else html += `<div class="rev-empty">${t('dash')}</div>`;
  html += `</div>`;

  $('#reviewBody').innerHTML = html;
  const freedKB = del.reduce((s, f) => s + f.sizeKB, 0);
  $('#freeNote').innerHTML = del.length ? t('free_del', del.length, fmtKB(freedKB)) : t('free_none');

  document.querySelectorAll('[data-restore]').forEach(b => b.onclick = () => {
    const p = decodeURIComponent(b.dataset.restore);
    delete status[p];
    history = history.filter(h => h !== p);
    session.push(session.splice(session.indexOf(p), 1)[0]);
    show('sweep'); renderFilters(); renderDock(); renderDeck();
  });
  const kt = document.querySelector('[data-kept-toggle]');
  if (kt) kt.onclick = () => { keptExpanded = !keptExpanded; openReview(); };
}

/* ================= Apply + done screen ================= */
$('#applyBtn').onclick = async () => {
  // Build the operation list for the main process
  const ops = [];
  for (const p of session) {
    const s = status[p]; if (!s) continue;
    const f = byPath(p);
    if (s.act === 'deleted') ops.push({ src: f.path, name: f.name, action: 'trash' });
    if (s.act === 'sorted') {
      const fo = folderById(s.folder);
      ops.push({ src: f.path, name: f.name, action: 'move', targetDir: folderTargetDir(fo), folderId: fo.id });
    }
  }

  // Fullscreen "sweeping" animation – runs for at least ~1.4s so it
  // feels intentional even when the work finishes instantly.
  startSweepAnim();
  const animMin = new Promise(r => setTimeout(r, 1400));

  $('#applyBtn').disabled = true;
  $('#applyBtn').textContent = t('applying');
  const results = await window.sweep.applyActions(ops);   // THIS is where it really happens
  await animMin;                                          // wait out the animation floor
  $('#applyBtn').disabled = false;
  $('#applyBtn').innerHTML = applyBtnHTML();

  if (mode === 'daily') bumpStreak();

  // Remember what really happened – for "undo moves", the per-folder
  // open buttons, AND the persistent history log.
  const moves = [];
  const folderCounts = new Map();   // folderId -> number of files received
  const historyBatch = [];          // entries to append to the log
  let trashedCount = 0;
  results.forEach((r, i) => {
    if (!r.ok) return;
    const o = ops[i];
    const name = o.name;
    if (o.action === 'move') {
      moves.push({ from: o.src, to: r.target });
      folderCounts.set(o.folderId, (folderCounts.get(o.folderId) || 0) + 1);
      historyBatch.push({ t: Date.now(), action: 'move', name, from: o.src, to: r.target });
    }
    if (o.action === 'trash') {
      trashedCount++;
      historyBatch.push({ t: Date.now(), action: 'trash', name, from: o.src });
    }
  });
  lastApply = { moves, trashedCount };
  addHistory(historyBatch);

  // Virtual folders now really exist
  folders.forEach(fo => { if (fo.virtual) fo.virtual = false; });
  savePrefs();

  const errors = results.filter(r => !r.ok);
  const kpt = Object.values(status).filter(s => s.act === 'kept').length;

  $('#doneStats').innerHTML = `
    <div class="sum-stat"><div class="n" style="color:var(--keep)">${kpt}</div><div class="l">${t('s_kept')}</div></div>
    <div class="sum-stat"><div class="n" style="color:var(--del)">${trashedCount}</div><div class="l">${t('s_trash')}</div></div>
    <div class="sum-stat"><div class="n" style="color:var(--sort)">${moves.length}</div><div class="l">${t('s_moved')}</div></div>`;

  $('#doneText').textContent = errors.length ? t('done_err', errors.length) : t('done_ok');

  const old = document.querySelector('.err-list'); if (old) old.remove();
  if (errors.length) {
    const list = document.createElement('div');
    list.className = 'err-list';
    list.innerHTML = errors.map(e => `<div class="err-item">${e.src}<br><small>${e.error || ''}</small></div>`).join('');
    $('#doneText').after(list);
  }

  // One open button per folder that actually received files
  $('#doneFolders').innerHTML = [...folderCounts.entries()].map(([fid, n]) => {
    const fo = folderById(fid); if (!fo) return '';
    return `<button class="btn-ghost done-folder" data-openfolder="${encodeURIComponent(fo.path)}">📂 ${escHtml(fo.name)} <span class="cnt">${n}</span></button>`;
  }).join('');
  document.querySelectorAll('[data-openfolder]').forEach(b =>
    b.onclick = () => window.sweep.openFile(decodeURIComponent(b.dataset.openfolder)));

  // Undo buttons only when there is something to undo
  const ub = $('#undoMoveBtn'), tb = $('#openTrashBtn');
  ub.style.display = moves.length ? '' : 'none';
  ub.disabled = false; ub.textContent = t('undo_moves');
  tb.style.display = trashedCount ? '' : 'none';

  show('done');
  stopSweepAnim();   // fade the overlay out, revealing the finished screen
};

// Undo moves: every file goes back to where it came from. (We know
// source and target – deletions, on the other hand, are restored by
// hand from the recycle bin; that's what the button next to it is for.)
$('#undoMoveBtn').onclick = async () => {
  if (!lastApply || !lastApply.moves.length) return;
  const ub = $('#undoMoveBtn');
  ub.disabled = true; ub.textContent = t('undoing');
  const ops = lastApply.moves.map(m => {
    const name = m.from.split(/[\\/]/).pop();
    const dir = m.from.slice(0, m.from.length - name.length - 1);
    return { src: m.to, name, action: 'move', targetDir: dir };
  });
  const results = await window.sweep.applyActions(ops);
  const failed = results.filter(r => !r.ok).length;
  ub.textContent = failed ? t('undo_fail', failed) : t('undone');
  if (!failed) {
    lastApply.moves = [];
    $('#doneFolders').innerHTML = '';
    $('#doneText').textContent = t('done_undone') + (lastApply.trashedCount ? t('trash_note') : '');
  } else ub.disabled = false;
};
$('#openTrashBtn').onclick = () => window.sweep.openRecycleBin();

$('#againBtn').onclick = () => { status = {}; history = []; lastApply = null; keptExpanded = false; show('start'); renderStart(); };

/* ================= Buttons / keyboard ================= */
document.querySelectorAll('.act[data-act]').forEach(b => b.onclick = () => decide(b.dataset.act));
$('#undoBtn').onclick = undo;

// The hint bar and the small labels under the action buttons always
// show the CURRENT key bindings (they update live after remapping).
function keyName(v) {
  if (v === '') return '–';
  if (v === ' ') return t('space');
  return { ArrowLeft: '←', ArrowRight: '→', ArrowUp: '↑', ArrowDown: '↓' }[v] || v.toUpperCase();
}
function renderHint() {
  $('#hint').innerHTML =
    `<kbd>${keyName(keys.del)}</kbd> ${t('act_del')} &nbsp; <kbd>${keyName(keys.keep)}</kbd> ${t('act_keep')} &nbsp; ` +
    `<kbd>${keyName(keys.sort)}</kbd> ${t('act_sort')} &nbsp; <kbd>${keyName(keys.skip)}</kbd> ${t('act_skip')} &nbsp; ` +
    `<kbd>${keyName(keys.undo)}</kbd> ${t('act_undo')}`;
  document.querySelectorAll('.act[data-act]').forEach(b => {
    const kbEl = b.querySelector('.kb');
    if (kbEl) kbEl.textContent = keyName(keys[b.dataset.act]);
    b.title = t('act_' + b.dataset.act);
  });
  $('#undoBtn').title = t('act_undo');
}

document.addEventListener('keydown', e => {
  if (listeningFor) {
    e.preventDefault(); e.stopPropagation();
    if (e.key === 'Escape') { listeningFor = null; renderKbList(); return; }  // Escape cancels remapping
    // Ignore a lone modifier press – wait for a "real" key so the binding
    // doesn't get stuck on Shift/Ctrl/Alt.
    if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock'].includes(e.key)) return;
    // Conflict resolution: if another action already uses this key,
    // that binding is cleared (shown as "–") until reassigned.
    for (const k of Object.keys(keys)) {
      if (k !== listeningFor && keys[k] === e.key) keys[k] = '';
    }
    keys[listeningFor] = e.key;
    listeningFor = null;                 // stop listening BEFORE re-rendering
    savePrefs(); renderKbList(); renderHint();
    return;
  }
  if ($('#pickModal').classList.contains('show')) {
    const n = parseInt(e.key);
    if (n >= 1 && n <= folders.length) { closeModals(); decide('sort', folders[n - 1].id); }
    if (e.key === 'Escape') closeModals();
    return;
  }
  if ($('#folderModal').classList.contains('show')) { if (e.key === 'Escape') closeModals(); return; }
  if ($('#removeModal').classList.contains('show')) { if (e.key === 'Escape') closeModals(); return; }
  if ($('#drawer').classList.contains('show'))      { if (e.key === 'Escape') closeModals(); return; }
  if (!$('#sweep').classList.contains('show')) return;
  const k = e.key;
  if (k !== '' && k === keys.del)       { e.preventDefault(); decide('del'); }
  else if (k !== '' && k === keys.keep) { e.preventDefault(); decide('keep'); }
  else if (k !== '' && k === keys.sort) { e.preventDefault(); decide('sort'); }
  else if (k !== '' && k === keys.skip) { e.preventDefault(); decide('skip'); }
  else if (keys.undo !== '' && k.toLowerCase() === keys.undo.toLowerCase()) { e.preventDefault(); undo(); }
}, true);   // capture phase: nothing can swallow the key before we see it

/* ================= Theme ================= */
const SUN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
const MOON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
let dark = localStorage.getItem('sweep-theme') !== 'light';
function setTheme(d) {
  dark = d; document.body.classList.toggle('dark', d);
  localStorage.setItem('sweep-theme', d ? 'dark' : 'light');
  ['themeBtn', 'themeBtn2', 'themeBtn3'].forEach(id => { const b = document.getElementById(id); if (b) b.innerHTML = d ? SUN : MOON; });
}
['themeBtn', 'themeBtn2', 'themeBtn3'].forEach(id => { const b = document.getElementById(id); if (b) b.onclick = () => setTheme(!dark); });

/* ================= Settings (incl. language) ================= */
document.querySelectorAll('.js-settings').forEach(b => b.onclick = () => {
  $('#drawer').classList.add('show'); $('#scrim').classList.add('show');
  renderKbList(); renderLangRow();
});
$('#closeDrawer').onclick = closeModals;

// Intro replay toggle: turning it on relaunches the intro right away
// (and it will also show again on the next start until completed).
$('#introSwitch').onclick = () => {
  const willEnable = !$('#introSwitch').classList.contains('on');
  $('#introSwitch').classList.toggle('on', willEnable);
  if (willEnable) {
    localStorage.removeItem('sweep-intro-done');
    closeModals();
    startIntro();
  }
};

const KB_META = [
  { k: 'del',  labelKey: 'act_del',  col: 'var(--del)' },
  { k: 'keep', labelKey: 'act_keep', col: 'var(--keep)' },
  { k: 'sort', labelKey: 'act_sort', col: 'var(--sort)' },
  { k: 'skip', labelKey: 'act_skip', col: 'var(--muted)' },
  { k: 'undo', labelKey: 'act_undo', col: 'var(--accent)' },
];
function renderKbList() {
  $('#kbList').innerHTML = KB_META.map(m => `
    <div class="kb-row"><span class="name"><span class="sw" style="background:${m.col}"></span>${t(m.labelKey)}</span>
    <button class="kb-key ${listeningFor === m.k ? 'listening' : ''} ${keys[m.k] === '' ? 'unset' : ''}" data-rebind="${m.k}">${listeningFor === m.k ? t('press_key') : keyName(keys[m.k])}</button></div>`).join('');
  document.querySelectorAll('[data-rebind]').forEach(b => b.onclick = () => {
    listeningFor = b.dataset.rebind;
    if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
    renderKbList();
  });
}
function renderLangRow() {
  $('#langRow').innerHTML = [['en', 'English'], ['de', 'Deutsch']].map(([code, label]) =>
    `<div class="loc-chip ${lang === code ? 'active' : ''}" data-lang="${code}">${label}</div>`).join('');
  document.querySelectorAll('[data-lang]').forEach(el => el.onclick = () => {
    if (lang === el.dataset.lang) return;
    lang = el.dataset.lang;
    localStorage.setItem('sweep-lang', lang);
    localStorage.setItem('sweep-lang-chosen', '1');   // user picked → stop auto-following the system
    refreshAll();
  });
}
// Re-render everything visible in the new language (state is kept).
function refreshAll() {
  // Default folder names follow the language (user-created names don't)
  for (const fo of folders) {
    if (fo.id === 'docs') fo.name = t('documents');
    if (fo.id === 'pics') fo.name = t('pictures');
  }
  applyStatic(); renderStart(); renderLangRow(); renderKbList(); renderHint();
  if ($('#sweep').classList.contains('show')) { renderFilters(); renderDock(); renderDeck(); updatePill(); }
  if ($('#review').classList.contains('show')) openReview();
  if ($('#history').classList.contains('show')) openHistory();
  if ($('#intro').classList.contains('show')) renderIntro();
}
document.querySelectorAll('[data-toggle]').forEach(tg => tg.onclick = () => tg.classList.toggle('on'));

/* ================= Apply animation (fullscreen) ================= */
let animTimer = null;
function startSweepAnim() {
  const layer = $('#sweepAnim');
  $('#animLabel').textContent = t('applying');
  // spawn a burst of little particles that get "swept" away
  const box = $('#animParticles');
  box.innerHTML = '';
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('span');
    p.className = 'anim-dot';
    p.style.left = (10 + Math.random() * 80) + '%';
    p.style.top = (20 + Math.random() * 60) + '%';
    p.style.animationDelay = (Math.random() * 0.5) + 's';
    p.style.background = ['var(--del)', 'var(--keep)', 'var(--sort)', 'var(--accent)'][i % 4];
    box.appendChild(p);
  }
  layer.classList.add('show');
}
function stopSweepAnim() {
  $('#sweepAnim').classList.remove('show');
}

/* ================= History / log ================= */
// Persisted in localStorage. Each entry: {t, action:'move'|'trash', name, from, to?}
function loadHistory() {
  try { return JSON.parse(localStorage.getItem('sweep-history') || '[]'); } catch { return []; }
}
function addHistory(batch) {
  if (!batch || !batch.length) return;
  let h = loadHistory();
  h = batch.concat(h);            // newest first
  if (h.length > 500) h = h.slice(0, 500);   // keep it bounded
  localStorage.setItem('sweep-history', JSON.stringify(h));
}
function fmtWhen(ts) {
  const d = new Date(ts);
  const pad = n => String(n).padStart(2, '0');
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function openHistory() {
  show('history');
  const h = loadHistory();
  const body = $('#historyBody');
  if (!h.length) { body.innerHTML = `<div class="hist-empty">${t('history_empty')}</div>`; return; }
  body.innerHTML = h.map((e, i) => {
    const col = e.action === 'trash' ? 'var(--del)' : 'var(--sort)';
    const where = e.action === 'trash'
      ? `<span class="hw" style="color:${col}">${t('hist_trashed')}</span>`
      : `<span class="hw" style="color:${col}">${t('hist_moved_to')}</span> <span class="hpath">${escHtml(e.to ? e.to.slice(0, e.to.length - (e.name.length + 1)) : '')}</span>`;
    const btn = e.action === 'trash'
      ? `<button class="hist-find" data-h-trash>${t('hist_open_trash')}</button>`
      : `<button class="hist-find" data-h-find="${i}">${t('hist_find')}</button>`;
    return `<div class="hist-item">
      <div class="hist-ico" style="background:${col}">${e.action === 'trash'
        ? '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>'
        : '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>'}</div>
      <div class="hist-inf"><div class="hist-nm">${escHtml(e.name)}</div>
        <div class="hist-sub">${where} · <span class="hist-when">${fmtWhen(e.t)}</span></div></div>
      ${btn}</div>`;
  }).join('');

  body.querySelectorAll('[data-h-find]').forEach(b => b.onclick = () => {
    const e = h[+b.dataset.hFind];
    // Reveal the file at its new location. If it has since been moved or
    // renamed, Windows Explorer falls back to opening the containing
    // folder – exactly the behaviour we want.
    window.sweep.showInFolder(e.to);
  });
  body.querySelectorAll('[data-h-trash]').forEach(b => b.onclick = () => window.sweep.openRecycleBin());
}
$('#historyBtn').onclick = openHistory;
$('#drawerHistory').onclick = () => { closeModals(); openHistory(); };
$('#histBack').onclick = () => show('start');
$('#histClear').onclick = () => {
  if (confirm(t('clear_history_confirm'))) { localStorage.removeItem('sweep-history'); openHistory(); }
};

/* ================= External links (branding / support) ================= */
$('#supportBtn').onclick   = () => window.sweep.openExternal(LINKS.kofi);
$('#websiteBtn').onclick   = () => window.sweep.openExternal(LINKS.website);
$('#drawerSupport').onclick = () => window.sweep.openExternal(LINKS.kofi);
$('#drawerWebsite').onclick = () => window.sweep.openExternal(LINKS.website);

/* ================= Auto-update ================= */
// The main process pushes 'update-status' events (see main.js). We turn
// them into a small banner. A downloaded patch is installed on one click.
(function initUpdates() {
  const banner  = $('#updateBanner');
  const spinner = $('#updateSpinner');
  const text    = $('#updateText');
  const action  = $('#updateAction');
  const dismiss = $('#updateDismiss');
  if (!banner) return;

  let downloadedReady = false;   // is a patch downloaded and waiting?
  let manualCheck = false;       // did the user click "Check for updates"?

  function showBanner() { banner.classList.add('show'); }
  function hideBanner() { banner.classList.remove('show'); }

  // Configure the banner for a given state. `spin` shows the spinner,
  // `btn` (text) shows the primary button, otherwise it's hidden.
  function render({ msg, spin = false, btn = null, onClick = null, auto = false }) {
    text.textContent = msg;
    spinner.hidden = !spin;
    if (btn) { action.hidden = false; action.textContent = btn; action.onclick = onClick; }
    else { action.hidden = true; action.onclick = null; }
    showBanner();
    // Auto-dismiss purely informational banners after a few seconds.
    if (auto) setTimeout(() => { if (!downloadedReady) hideBanner(); }, 4500);
  }

  window.sweep.onUpdateStatus((p) => {
    switch (p.state) {
      case 'checking':
        if (manualCheck) render({ msg: t('upd_checking'), spin: true });
        break;
      case 'available':
        render({ msg: t('upd_available', p.version), spin: true });
        break;
      case 'progress':
        render({ msg: t('upd_progress', p.percent), spin: true });
        break;
      case 'downloaded':
        downloadedReady = true;
        if (autoOn()) {
          // Auto-install is enabled → apply the patch and relaunch on its
          // own, after a short notice so the restart isn't a surprise.
          render({ msg: t('upd_installing', p.version), spin: true });
          setTimeout(() => window.sweep.installUpdate(), 2500);
        } else {
          // Default: just inform, the user decides when to install.
          render({
            msg: t('upd_ready', p.version),
            btn: t('upd_restart'),
            onClick: () => window.sweep.installUpdate(),
          });
        }
        break;
      case 'none':
        // Only bother the user if they asked, or if it's the dev build.
        if (p.dev) render({ msg: t('upd_dev'), auto: true });
        else if (manualCheck) render({ msg: t('upd_none'), auto: true });
        manualCheck = false;
        break;
      case 'error':
        if (manualCheck) render({ msg: t('upd_error'), auto: true });
        manualCheck = false;
        break;
    }
  });

  dismiss.onclick = hideBanner;

  // "Check for updates" in the settings drawer.
  const drawerUpdate = $('#drawerUpdate');
  if (drawerUpdate) drawerUpdate.onclick = () => {
    manualCheck = true;
    closeModals();
    render({ msg: t('upd_checking'), spin: true });
    window.sweep.checkForUpdates();
  };

  // "Install updates automatically" switch. Default OFF: the user is only
  // notified and installs on their own. When ON, downloaded patches apply
  // themselves (and also install silently when the app is closed).
  const AUTO_KEY = 'sweep-auto-install';
  function autoOn() { return localStorage.getItem(AUTO_KEY) === '1'; }
  const autoSwitch = $('#autoUpdateSwitch');
  if (autoSwitch) {
    autoSwitch.classList.toggle('on', autoOn());   // reflect stored choice
    autoSwitch.onclick = () => {
      const willEnable = !autoSwitch.classList.contains('on');
      autoSwitch.classList.toggle('on', willEnable);
      localStorage.setItem(AUTO_KEY, willEnable ? '1' : '0');
      window.sweep.setAutoInstall(willEnable);
      // If a patch is already downloaded and waiting, honour the new choice
      // right away instead of making the user hunt for the banner.
      if (willEnable && downloadedReady) window.sweep.installUpdate();
    };
  }
  // Tell the main process the current preference at startup (governs the
  // silent install-on-quit behaviour).
  window.sweep.setAutoInstall(autoOn());
})();

/* ================= Intro / onboarding ================= */
const INTRO_STEPS = ['t1', 't2', 't3', 't4'];
let introStep = 0;
function introDone() {
  localStorage.setItem('sweep-intro-done', '1');
  $('#introSwitch').classList.remove('on');
  show('start');
}
function startIntro() {
  introStep = 0;
  show('intro');
  renderIntro();
}
function renderIntro() {
  const step = INTRO_STEPS[introStep];
  const stage = $('#introStage');
  let inner = '';
  if (step === 't1') inner += `<img class="intro-logo" src="sweep-logo.svg" alt="Sweep" draggable="false">`;
  inner += `<h2 class="intro-h">${t('intro_' + step)}</h2><p class="intro-p">${t('intro_b' + step.slice(1))}</p>`;

  if (step === 't2') {
    // language + appearance pickers
    inner += `<div class="intro-set"><p class="sec-label">${t('intro_lang')}</p><div class="loc-row" id="introLang"></div></div>`;
    inner += `<div class="intro-set"><p class="sec-label">${t('intro_theme')}</p><div class="loc-row" id="introTheme"></div></div>`;
  }
  if (step === 't3') {
    inner += `<div class="demo-wrap"><div class="demo-deck" id="demoDeck"></div>
      <div class="demo-folder" id="demoFolder">${FOLDER_ICON}<span>${t('demo_folder')}</span></div></div>
      <div class="demo-hint" id="demoHint">${t('demo_left')} · ${t('demo_right')}</div>`;
  }
  stage.innerHTML = inner;

  // dots
  $('#introDots').innerHTML = INTRO_STEPS.map((_, i) => `<span class="dot ${i === introStep ? 'on' : ''}"></span>`).join('');
  // nav labels
  $('#introBack').style.display = introStep === 0 ? 'none' : '';
  $('#introNext').textContent = introStep === INTRO_STEPS.length - 1 ? t('intro_start') : t('intro_next');

  if (step === 't2') {
    $('#introLang').innerHTML = [['en', 'English'], ['de', 'Deutsch']].map(([c, l]) =>
      `<div class="loc-chip ${lang === c ? 'active' : ''}" data-ilang="${c}">${l}</div>`).join('');
    document.querySelectorAll('[data-ilang]').forEach(el => el.onclick = () => {
      lang = el.dataset.ilang; localStorage.setItem('sweep-lang', lang);
      localStorage.setItem('sweep-lang-chosen', '1');   // explicit choice
      for (const fo of folders) { if (fo.id === 'docs') fo.name = t('documents'); if (fo.id === 'pics') fo.name = t('pictures'); }
      applyStatic(); renderStart(); renderIntro();   // re-render intro in new language
    });
    $('#introTheme').innerHTML = [['dark', t('theme_dark')], ['light', t('theme_light')]].map(([c, l]) =>
      `<div class="loc-chip ${ (c === 'dark') === dark ? 'active' : ''}" data-itheme="${c}">${l}</div>`).join('');
    document.querySelectorAll('[data-itheme]').forEach(el => el.onclick = () => {
      setTheme(el.dataset.itheme === 'dark'); renderIntro();
    });
  }
  if (step === 't3') mountDemo();
}
$('#introBack').onclick = () => { if (introStep > 0) { introStep--; renderIntro(); } };
$('#introNext').onclick = () => {
  if (introStep < INTRO_STEPS.length - 1) { introStep++; renderIntro(); }
  else introDone();
};
$('#introSkip').onclick = introDone;

// Self-contained demo deck with dummy "files" (no real files involved).
function mountDemo() {
  const dummies = [
    { name: t('demo_card1'), type: 'image', tint: COLORS.image },
    { name: t('demo_card2'), type: 'pdf',   tint: COLORS.pdf },
    { name: t('demo_card3'), type: 'audio', tint: COLORS.audio },
  ];
  let idx = 0;
  const deck = $('#demoDeck');
  const hint = $('#demoHint');

  function draw() {
    if (idx >= dummies.length) {
      deck.innerHTML = `<div class="demo-done">${t('demo_done')}</div>`;
      hint.textContent = '';
      return;
    }
    const slice = dummies.slice(idx, idx + 2).reverse();
    deck.innerHTML = slice.map((d, i) => {
      const top = i === slice.length - 1;
      const ph = d.type === 'image'
        ? `<div class="img-preview"><div class="ph" style="background:linear-gradient(135deg,${d.tint},#0af)"></div></div>`
        : d.type === 'pdf'
          ? `<div class="generic-ico" style="background:linear-gradient(135deg,${d.tint},#ff8aa0)"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg></div>`
          : `<div class="generic-ico" style="background:linear-gradient(135deg,${d.tint},#55efc4)"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg></div>`;
      return `<div class="card demo-card ${top ? 'top' : 'behind'}">
        <div class="tint"></div><div class="stamp keep">${t('act_keep')}</div><div class="stamp del">${t('act_del')}</div>
        <div class="preview">${ph}</div>
        <div class="meta"><div class="fname">${escHtml(d.name)}</div><div class="tags"><span class="tag-chip"><span class="swatch" style="background:${d.tint}"></span>${t('t_' + d.type)}</span></div></div>
      </div>`;
    }).join('');
    attachDemo();
  }
  function advance() { idx++; setTimeout(draw, 240); }

  function attachDemo() {
    const card = deck.querySelector('.card.top'); if (!card) return;
    const tint = card.querySelector('.tint');
    const sKeep = card.querySelector('.stamp.keep'), sDel = card.querySelector('.stamp.del');
    let sx, dx = 0, drag = false, overFolder = false;
    const folderEl = $('#demoFolder');

    card.addEventListener('pointerdown', e => { drag = true; sx = e.clientX; card.style.transition = 'none'; card.setPointerCapture(e.pointerId); });
    card.addEventListener('pointermove', e => {
      if (!drag) return;
      dx = e.clientX - sx;
      card.style.pointerEvents = 'none';
      const under = document.elementFromPoint(e.clientX, e.clientY);
      card.style.pointerEvents = '';
      overFolder = !!(under && under.closest('#demoFolder'));
      folderEl.classList.toggle('hot', overFolder);
      const sc = overFolder ? 0.8 : 1;
      card.style.transform = `translate(${dx}px, ${overFolder ? -40 : 0}px) rotate(${dx * 0.05}deg) scale(${sc})`;
      const ax = Math.min(Math.abs(dx) / 120, 1);
      if (overFolder) { sKeep.style.opacity = 0; sDel.style.opacity = 0; tint.style.background = 'var(--sort-soft)'; tint.style.opacity = .8; }
      else if (dx > 0) { sKeep.style.opacity = ax; sDel.style.opacity = 0; tint.style.background = 'var(--keep-soft)'; tint.style.opacity = ax; }
      else { sDel.style.opacity = ax; sKeep.style.opacity = 0; tint.style.background = 'var(--del-soft)'; tint.style.opacity = ax; }
    });
    const release = () => {
      if (!drag) return; drag = false;
      folderEl.classList.remove('hot');
      if (overFolder) { fly(0, -400, .3); return; }
      if (dx > 110) return fly(600, 0, .25);
      if (dx < -110) return fly(-600, 0, .25);
      card.style.transition = 'transform .25s'; card.style.transform = '';
      sKeep.style.opacity = 0; sDel.style.opacity = 0; tint.style.opacity = 0; dx = 0;
    };
    function fly(tx, ty, dur) {
      card.style.transition = `transform ${dur}s ease, opacity ${dur}s ease`;
      card.style.transform = `translate(${tx}px,${ty}px) rotate(${tx * 0.02}deg)${ty ? ' scale(.1)' : ''}`;
      card.style.opacity = '0';
      advance();
    }
    card.addEventListener('pointerup', release);
    card.addEventListener('pointercancel', release);
  }
  draw();
}

/* ================= Init ================= */
(async function init() {
  knownFolders = await window.sweep.getKnownFolders();

  const firstRun = !localStorage.getItem('sweep-intro-done');
  // Follow the system until the user explicitly picks a language/theme.
  // (We track an explicit choice separately so a stale stored value from
  //  earlier runs can't block auto-detection.)
  const langChosen = localStorage.getItem('sweep-lang-chosen');
  let sys = null;
  try { sys = await window.sweep.getSystemInfo(); } catch {}

  // Real version from package.json (via the main process). Falls back to
  // the hard-coded constant if the bridge isn't there (e.g. plain browser).
  try {
    const v = await window.sweep.getAppVersion();
    if (v) {
      APP_VERSION = v;
      const fv = $('#footVer'); if (fv) fv.textContent = 'v' + APP_VERSION;
      const av = $('#aboutVer'); if (av) av.textContent = APP_VERSION;
    }
  } catch {}
  if (!langChosen && sys) {
    lang = (sys.locale || '').toLowerCase().startsWith('de') ? 'de' : 'en';
    localStorage.setItem('sweep-lang', lang);
  }
  if (firstRun && sys && localStorage.getItem('sweep-theme') === null) {
    dark = !!sys.darkMode;
  }

  folders = [
    { id: 'docs', name: t('documents'), path: knownFolders.documents, sys: true },
    { id: 'pics', name: t('pictures'),  path: knownFolders.pictures,  sys: true },
    { id: 'dl',   name: 'Downloads',    path: knownFolders.downloads, sys: true },
  ];
  loadPrefs();
  setTheme(dark);
  applyStatic();
  renderStart();
  renderHint();

  if (firstRun) startIntro();   // guided onboarding on the very first launch
})();
