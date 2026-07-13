// =====================================================================
// preload.js – the bridge between the UI and the main process.
// We expose ONLY this hand-picked set of functions to the UI –
// no full Node access. Usage: window.sweep.<function>(...)
// =====================================================================

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('sweep', {
  pickFolder:      ()                   => ipcRenderer.invoke('pick-folder'),
  getKnownFolders: ()                   => ipcRenderer.invoke('get-known-folders'),
  scanFolder:      (folderPath)         => ipcRenderer.invoke('scan-folder', folderPath),
  scanLargest:     (folderPath)         => ipcRenderer.invoke('scan-largest', folderPath),
  readShortcut:    (filePath)           => ipcRenderer.invoke('read-shortcut', filePath),
  getPreview:      (filePath, fileType) => ipcRenderer.invoke('get-preview', filePath, fileType),
  readFileBytes:   (filePath, maxBytes) => ipcRenderer.invoke('read-file-bytes', filePath, maxBytes),
  listZip:         (filePath)           => ipcRenderer.invoke('list-zip', filePath),
  listFolder:      (folderPath)         => ipcRenderer.invoke('list-folder', folderPath),
  getFileUrl:      (filePath)           => ipcRenderer.invoke('get-file-url', filePath),
  getFileIcon:     (filePath)           => ipcRenderer.invoke('get-file-icon', filePath),
  openExternal:    (url)                => ipcRenderer.invoke('open-external', url),
  getSystemInfo:   ()                   => ipcRenderer.invoke('get-system-info'),
  showInFolder:    (filePath)           => ipcRenderer.invoke('show-in-folder', filePath),
  openFile:        (filePath)           => ipcRenderer.invoke('open-file', filePath),
  applyActions:    (ops)                => ipcRenderer.invoke('apply-actions', ops),
  openRecycleBin:  ()                   => ipcRenderer.invoke('open-recycle-bin'),

  // --- Auto-update ---
  getAppVersion:   ()                   => ipcRenderer.invoke('get-app-version'),
  checkForUpdates: ()                   => ipcRenderer.invoke('check-for-updates'),
  installUpdate:   ()                   => ipcRenderer.invoke('install-update'),
  setAutoInstall:  (on)                 => ipcRenderer.invoke('set-auto-install', on),
  // Subscribe to update-status pushes from the main process.
  onUpdateStatus:  (cb) => {
    const listener = (_e, payload) => cb(payload);
    ipcRenderer.on('update-status', listener);
    return () => ipcRenderer.removeListener('update-status', listener);
  },
});
