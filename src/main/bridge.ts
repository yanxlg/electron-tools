import { ipcMain, webContents } from 'electron';
import * as browserSync from 'browser-sync';

const bs = browserSync.create();

bs.init({
    server: true,
    open: false,
});

ipcMain.on('open-dev', (event, args) => {
    const { webviewId } = args;
    const contents = webContents.fromId(webviewId);
    contents.openDevTools();
});

ipcMain.on('executeJs', (event, args) => {
    // webview注入js
    const contentsArray = webContents.getAllWebContents();
    contentsArray.map(contents => {
        const type = contents.getType();
        if (type === 'webview') {
            contents.executeJavaScript(args);
        }
    });
});

ipcMain.on('setNetworkStatus', (event, args) => {
    const { webviewId, networkStatus, customOptions } = args;
    const contents = webContents.fromId(webviewId);
    switch (networkStatus) {
        case 'online':
            (async () => {
                const dbg = contents.debugger;
                await dbg.sendCommand('Network.disable');
            })();
            break;
        case 'low-end':
            (async () => {
                const dbg = contents.debugger;
                await dbg.sendCommand('Network.enable');
                await dbg.sendCommand('Network.emulateNetworkConditions', {
                    offline: false,
                    latency: 20,
                    downloadThroughput: 50 * 1024,
                    uploadThroughput: 50 * 1024,
                });
            })();
            break;
        case 'mid-tier':
            (async () => {
                const dbg = contents.debugger;
                await dbg.sendCommand('Network.enable');
                await dbg.sendCommand('Network.emulateNetworkConditions', {
                    offline: false,
                    latency: 10,
                    downloadThroughput: 10 * 1024,
                    uploadThroughput: 10 * 1024,
                });
            })();
            break;
        case 'offline':
            (async () => {
                const dbg = contents.debugger;
                await dbg.sendCommand('Network.enable');
                await dbg.sendCommand('Network.emulateNetworkConditions', {
                    offline: true,
                    latency: 0,
                    downloadThroughput: -1,
                    uploadThroughput: -1,
                });
            })();
            break;
        case 'custom':
            break;
    }
});

ipcMain.on('before-snapshot', async (event, args) => {
    const { webviewId } = args;
    const contents = webContents.fromId(webviewId);
    const allHeight = await contents.executeJavaScript('document.body.offsetHeight');
    await contents.executeJavaScript('window.scrollTo(0,0)');
    event.returnValue = allHeight;
});

ipcMain.on('snapshot', async (event, args) => {
    const { webviewId } = args;
    const contents = webContents.fromId(webviewId);
    const image = await contents.capturePage();
    const buffer = image.toPNG();
    const fs = require('fs');
    fs.writeFileSync(`${__dirname}/example1.png`, buffer);
    event.returnValue = 'success';
});
