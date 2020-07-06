import React, { useState } from 'react';
import emulations from '../emulations';
import EmuInstance from '../instance/EmulationInstance';
const { ipcRenderer } = window.require('electron');

const noop = () => {};
let { emulationTypeList, emulationList, ...appConfig } = ipcRenderer.sendSync(
    'getConfig',
) as AppConfig;

let emulationInstanceList = emulationList.map(json =>
    EmuInstance.fromJson(json),
);

const Context = React.createContext<ContextData>({
    url: '',
    port: 3000,
    zoom: 50,
    foldState: 'unfold',
    orientation: 'portrait',
    osFilter: undefined,
    typeFilter: undefined,
    emulationList: emulationInstanceList,
    ...appConfig,
    emulationTypeList: [...emulations],
    emulationTypeMap: {},
    updateUrl: noop,
    toggleFoldState: noop,
    setOsFilter: noop,
    setTypeFilter: noop,
    setOrientation: noop,
    setFocusEmulation: noop,

    addEmulationType: (noop as unknown) as (
        emulationType: EmulationType,
    ) => Promise<any>,
    removeEmulationType: (noop as unknown) as (
        emulationType: EmulationType,
    ) => Promise<any>,
    updateEmulationList: noop,
    updateEmulation: noop,
    setZoom: noop,
});

const Consumer = Context.Consumer;

declare interface ContextData extends AppConfig {
    url: string;
    port: number;
    zoom: number;
    preload?: string;
    focusEmulationId?: number;
    foldState: 'unfold' | 'fold';
    emulationList: EmuInstance[];
    updateUrl: (path: string, port: number) => void;
    toggleFoldState: () => void;
    osFilter?: 'Android' | 'Mac OS' | 'Windows' | 'Others';
    typeFilter?: 'mobile' | 'pad' | 'laptop' | 'desktop';
    orientation: 'portrait' | 'landscape';
    emulationTypeMap: { [key: string]: EmulationType };
    setOsFilter: (
        osFilter: 'Android' | 'Mac OS' | 'Windows' | 'Others',
    ) => void;
    setTypeFilter: (
        typeFilter: 'mobile' | 'pad' | 'laptop' | 'desktop',
    ) => void;
    setOrientation: (orientation: 'portrait' | 'landscape') => void;
    setFocusEmulation: (emulationId?: number) => void;
    addEmulationType: (emulationType: EmulationType) => Promise<any>;
    removeEmulationType: (emulationType: EmulationType) => Promise<any>;
    updateEmulationList: (emulationList: EmuInstance[]) => void;
    updateEmulation: (id: string, config: Partial<EmulationInstance>) => void;
    setZoom: (zoom: number) => void;
}

const mergeEmulationTypeList = [...emulations, ...emulationTypeList];
const mergeEmulationTypeMap: { [key: string]: EmulationType } = {};
const innerEmulationTypeMap: { [key: string]: EmulationType } = {};
mergeEmulationTypeList.map(emulation => {
    mergeEmulationTypeMap[emulation.deviceType] = emulation;
    innerEmulationTypeMap[emulation.deviceType] = emulation;
});

export { innerEmulationTypeMap };

console.log(appConfig);

const Provider: React.FC = ({ children }) => {
    const [store, setStore] = useState<ContextData>({
        zoom: 50,
        url: '',
        port: 3000,
        foldState: 'unfold',
        orientation: 'portrait',
        osFilter: undefined,
        typeFilter: undefined,
        emulationList: emulationInstanceList,
        ...appConfig,
        emulationTypeList: mergeEmulationTypeList,
        emulationTypeMap: mergeEmulationTypeMap,
        updateUrl: (url: string, port: number) => {
            setStore(store => {
                return Object.assign({}, store, {
                    url,
                    port,
                });
            });
        },
        toggleFoldState: () => {
            setStore(store => {
                return Object.assign({}, store, {
                    foldState: store.foldState === 'fold' ? 'unfold' : 'fold',
                });
            });
        },
        setOsFilter: (
            osFilter: 'Android' | 'Mac OS' | 'Windows' | 'Others',
        ) => {
            setStore(store => {
                return Object.assign({}, store, {
                    osFilter: osFilter,
                });
            });
        },
        setTypeFilter: (
            typeFilter: 'mobile' | 'pad' | 'laptop' | 'desktop',
        ) => {
            setStore(store => {
                return Object.assign({}, store, {
                    typeFilter: typeFilter,
                });
            });
        },
        setOrientation: (orientation: 'portrait' | 'landscape') => {
            setStore(store => {
                return Object.assign({}, store, {
                    orientation: orientation,
                });
            });
        },
        setFocusEmulation: (emulationId?: number) => {
            setStore(store => {
                return Object.assign({}, store, {
                    focusEmulationId: emulationId,
                });
            });
        },
        addEmulationType: (emulationType: EmulationType) => {
            // 创建实例
            emulationInstanceList.unshift(
                new EmuInstance(
                    emulationType.deviceType,
                    true,
                    emulationType.deviceName,
                ),
            );
            // 创建的需要添加到配置文件中
            emulationTypeList.unshift(emulationType);

            setStore(store => {
                const { emulationTypeList: list, emulationTypeMap } = store;
                emulationTypeMap[emulationType.deviceType] = emulationType;
                return Object.assign({}, store, {
                    emulationTypeList: ([] as EmulationType[])
                        .concat([emulationType])
                        .concat(...list),
                    emulationTypeMap: { ...emulationTypeMap },
                    emulationList: ([] as EmulationInstance[]).concat(
                        emulationInstanceList,
                    ),
                });
            });

            return ipcRenderer.invoke('updateConfig', {
                emulationTypeList: emulationTypeList,
                emulationList: emulationInstanceList,
            });
        },
        removeEmulationType: (emulationType: EmulationType) => {
            // 删除实例
            emulationInstanceList = emulationInstanceList.filter(
                item => item.deviceType !== emulationType.deviceType,
            );
            emulationTypeList = emulationTypeList.filter(
                item => item.deviceType !== emulationType.deviceType,
            );

            setStore(store => {
                const { emulationTypeList: list, emulationTypeMap } = store; // deviceType
                const filterList = list.filter(
                    item => item.deviceType !== emulationType.deviceType,
                );
                delete emulationTypeMap[emulationType.deviceType];
                return Object.assign({}, store, {
                    emulationTypeList: ([] as EmulationType[]).concat(
                        filterList,
                    ),
                    emulationTypeMap: { ...emulationTypeMap },
                    emulationList: ([] as EmulationInstance[]).concat(
                        emulationInstanceList,
                    ),
                });
            });

            return ipcRenderer.invoke('updateConfig', {
                emulationTypeList: emulationTypeList,
                emulationList: emulationInstanceList,
            });
        },
        updateEmulationList: (emulationList: EmuInstance[]) => {
            emulationInstanceList = emulationList;
            setStore(store => {
                return Object.assign({}, store, {
                    emulationList: ([] as EmulationInstance[]).concat(
                        emulationInstanceList,
                    ),
                });
            });
            return ipcRenderer.invoke('updateConfig', {
                emulationList: emulationInstanceList,
            });
        },
        updateEmulation: (id: string, config: Partial<EmulationInstance>) => {
            emulationInstanceList
                .find(instance => instance.id === id)
                ?.updateConfig(config);
            setStore(store => {
                return Object.assign({}, store, {
                    emulationList: ([] as EmulationInstance[]).concat(
                        emulationInstanceList,
                    ),
                });
            });
            return ipcRenderer.invoke('updateConfig', {
                emulationList: emulationInstanceList,
            });
        },
        setZoom: (zoom: number) => {
            setStore(store => {
                ipcRenderer.invoke('updateConfig', {
                    zoom: zoom,
                });
                return Object.assign({}, store, {
                    zoom: zoom,
                });
            });
        },
    });

    return <Context.Provider value={store}>{children}</Context.Provider>;
};

export { Provider, Consumer, Context };
