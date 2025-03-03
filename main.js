// main.js
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // Завантажуємо index.html
  win.loadFile(path.join(__dirname, 'scr', 'index.html'));
}

app.whenReady().then(createWindow);
