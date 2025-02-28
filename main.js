const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600
    // інші налаштування
  })

  mainWindow.loadFile(path.join(__dirname, 'scr', 'index.html'))
}

app.whenReady().then(createWindow)
