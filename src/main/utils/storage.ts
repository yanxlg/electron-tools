import * as storage from 'electron-json-storage';
import { DataOptions } from 'electron-json-storage';

const getDefaultDataPath = storage.getDefaultDataPath;
const setDataPath = storage.setDataPath;
const getDataPath = storage.getDataPath;

const has = (key: string, options?: DataOptions) => {
    return new Promise<boolean>((resolve, reject) => {
        storage.has(key, options, (error, hasKey) => {
            if (error) reject(error);
            resolve(hasKey);
        });
    });
};

const keys = (options?: DataOptions) => {
    return new Promise<string[]>((resolve, reject) => {
        storage.keys(options, (error, keys) => {
            if (error) reject(error);
            resolve(keys);
        });
    });
};

const remove = (key: string, options?: DataOptions) => {
    return new Promise((resolve, reject) => {
        storage.remove(key, options, error => {
            if (error) reject(error);
            resolve();
        });
    });
};

const clear = (options?: DataOptions) => {
    return new Promise((resolve, reject) => {
        storage.clear(options, error => {
            if (error) reject(error);
            resolve();
        });
    });
};

const set = (key: string, json: object, options?: DataOptions) => {
    return new Promise((resolve, reject) => {
        storage.set(key, json, options, error => {
            if (error) reject(error);
            resolve();
        });
    });
};

const get = (key: string, options?: DataOptions) => {
    return new Promise<object>((resolve, reject) => {
        storage.get(key, options, (error: any, data: object) => {
            if (error) reject(error);
            resolve(data);
        });
    });
};

const getAll = (options?: DataOptions) => {
    return new Promise<object>((resolve, reject) => {
        storage.getAll(options, (error: any, data: object) => {
            if (error) reject(error);
            resolve(data);
        });
    });
};

const getMany = (keys: ReadonlyArray<string>, options?: DataOptions) => {
    return new Promise<object>((resolve, reject) => {
        storage.getMany(keys, options, (error: any, data: object) => {
            if (error) reject(error);
            resolve(data);
        });
    });
};

export {
    has,
    keys,
    get,
    getAll,
    getMany,
    set,
    getDefaultDataPath,
    setDataPath,
    getDataPath,
    remove,
    clear,
};
