
const { app, BrowserWindow, ipcMain , dialog} = require('electron');
const { autoUpdater } = require('electron-updater');
const logger = require('electron-log');

let mainWindow;
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
        },
    });
    mainWindow.loadFile('index.html');
    mainWindow.on('closed', function () {
        mainWindow = null;
    });

}

app.on('ready', () => {
    createWindow();
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});

ipcMain.on('app_version', (event) => {
    event.sender.send('app_version', { version: app.getVersion() });
});
autoUpdater.channel = 'latest'
autoUpdater.allowDowngrade = false

autoUpdater.logger = logger
autoUpdater.logger.transports.file.level = 'silly'
autoUpdater.logger.transports.file.appName = 'auto update'
autoUpdater.autoDownload = true
autoUpdater.on('update-downloaded', () => {
    dialog.showMessageBox({
        message: 'update downloaded please restart the app'
    })
    autoUpdater.quitAndInstall();
})

autoUpdater.on('checking-for-update', () => {
    autoUpdater.logger.info('checking for updates')
})

autoUpdater.on('update-available', () => {
    dialog.showMessageBox({
        message: 'New update is available',
        type: "info",
    })
    mainWindow.webContents.send('update-available')
})

app.on('ready', () => {
    console.log('app-ready')
    autoUpdater.logger.info("app-ready")
    autoUpdater.checkForUpdates()
})

