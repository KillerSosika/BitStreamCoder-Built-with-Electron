const { app, BrowserWindow } = require('electron');

let mainWindow;

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });

    mainWindow.loadURL(`data:text/html;charset=utf-8,
        <html>
        <head>
            <title>BitStreamCoder</title>
            <style>
                body { font-family: Arial, sans-serif; text-align: center; padding: 20px; }
                button { padding: 10px 20px; margin: 10px; font-size: 16px; }
            </style>
        </head>
        <body>
            <h1>Welcome to BitStreamCoder</h1>
            <button onclick="alert('Encoding Selected!')">Encoding</button>
            <button onclick="alert('Scrambling Selected!')">Scrambling</button>
            <button onclick="alert('Exit')">Exit</button>
        </body>
        </html>`);
});
