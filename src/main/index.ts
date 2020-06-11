'use strict';

import { app, BrowserWindow, webContents, ipcMain, nativeImage, BrowserView } from 'electron';
import * as path from 'path';
import { format as formatUrl } from 'url';
import './bridge';
import { init } from './appConfig';

const isDevelopment = process.env.NODE_ENV !== 'production';

// .env文件支持
if (isDevelopment) {
    require('dotenv').config();
}

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow: null | BrowserWindow = null;

async function createMainWindow() {
    await init();

    const window = new BrowserWindow({
        webPreferences: { nodeIntegration: true, webviewTag: true },
    });

    const contents = window.webContents;
    window.maximize();

    if (isDevelopment) {
        // window.webContents.openDevTools()
    }

    if (isDevelopment) {
        window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);
    } else {
        window.loadURL(
            formatUrl({
                pathname: path.join(__dirname, 'index.html'),
                protocol: 'file',
                slashes: true,
            }),
        );
    }
    contents.addListener('did-attach-webview', (event, webContents) => {
        try {
            webContents.debugger.attach('1.3');
        } catch (err) {
            console.log('Debugger attach failed : ', err);
        }

        // touch
        /*   webContents.debugger.sendCommand('Emulation.setEmitTouchEventsForMouse', {
            enabled: true,
            configuration: 'mobile',
        });*/
    });

    window.on('closed', () => {
        mainWindow = null;
    });
    mainWindow = window;
}

// quit application when all windows are closed
app.on('window-all-closed', () => {
    // on macOS it is common for applications to stay open until the user explicitly quits
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.commandLine.appendSwitch('--ignore-certificate-errors', 'true'); // 忽略证书问题，防止webview无法打开browserSync服务

app.on('activate', () => {
    // on macOS it is common to re-create a window even after all windows have been closed
    if (mainWindow === null) {
        createMainWindow();
    }
});

// create main BrowserWindow when electron is ready
app.on('ready', () => {
    createMainWindow();
});
