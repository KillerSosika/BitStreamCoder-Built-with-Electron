const { app, BrowserWindow, ipcMain } = require('electron');

let mainWindow;
let helpWindow;

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 700,
        webPreferences: {
            nodeIntegration: true
        }
    });
    mainWindow.loadFile('index.html');
});

ipcMain.on('open-help', () => {
    if (!helpWindow) {
        helpWindow = new BrowserWindow({
            width: 600,
            height: 400,
            webPreferences: {
                nodeIntegration: true
            }
        });
        helpWindow.loadFile('help.html');
        helpWindow.on('closed', () => helpWindow = null);
    }
});