import { ipcMain } from 'electron';
import * as storage from './utils/storage';
import defaultConfig from './config/default';
import * as path from 'path';

const init = async () => {
    // init
    ////// default.conf
    const hasDefaultConfig = await storage.has('default');
    if (!hasDefaultConfig) {
        await storage.set('default', defaultConfig);
    }
    ////// user.conf
    const hasUserConfig = await storage.has('user');
    if (!hasUserConfig) {
        await storage.set('user', {
            preload: path.resolve(process.cwd(), './static/browser-sync.js'),
        });
    }

    let userConfig = await storage.get('user');

    ipcMain.on('getConfig', (event) => {
        event.returnValue = {
            ...defaultConfig,
            ...userConfig,
        };
    });
    ipcMain.handle('updateConfig', (event, args) => {
        return storage.set('user', Object.assign({}, userConfig, args));
    });
};

export { init };
