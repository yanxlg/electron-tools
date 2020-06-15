import React, {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import styles from '@/styles/emulation.module.less';
import classNames from 'classnames';
import Icons from '@/components/IconFont';
import { Context } from '@/components/Context';
import { Dropdown, Menu } from 'antd';
import { ClickParam } from 'antd/lib/menu';
import anime from 'animejs';
import useId from '@/hooks/useId';
import inspectJs from 'raw-loader!babel-loader!../jsTemplate/inspect';

const { ipcRenderer } = window.require('electron');

declare interface EmulationProps {
    deviceType: string;
    deviceName?: string;
}

const initLoadingPromise = () => {
    let resolve: (value?: unknown) => void = () => {};
    const _promise = new Promise(_resolve => {
        resolve = _resolve;
    });
    return {
        promise: _promise,
        resolve: resolve,
    };
};

//TODO session setProxy 设置代理，调用browser-sync
const Emulation = ({ deviceType, deviceName }: EmulationProps) => {
    const emulationId = useId();
    const webviewRef = useRef<any>(null);
    const placeholderRef = useRef<HTMLDivElement>(null);
    const animRef = useRef<HTMLDivElement>(null);
    const maskWrapRef = useRef<HTMLDivElement>(null);
    const [inspect, setInspect] = useState(false);
    const {
        url,
        preload,
        orientation: globalOrientation,
        emulationTypeMap,
        focusEmulationId,
        osFilter,
        typeFilter,
        setFocusEmulation,
        zoom,
    } = useContext(Context);
    const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(
        globalOrientation,
    );

    const webViewReadyPromise = useRef(initLoadingPromise());

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setOrientation(globalOrientation);
    }, [globalOrientation]);

    useEffect(() => {
        const readyCallback = () => {
            webViewReadyPromise.current.resolve(
                webviewRef.current.getWebContentsId(),
            );
        };

        const startLoadingCallback = () => {
            setLoading(true);
        };

        const endLoadingCallback = () => {
            setLoading(false);
        };

        const failLoadingCallback = (event: any) => {
            const { errorCode } = event;
            if (errorCode === -106) {
                console.log('当前无网络');
            }
        };

        webviewRef.current.addEventListener('dom-ready', readyCallback);
        webviewRef.current.addEventListener(
            'did-start-loading',
            startLoadingCallback,
        );
        webviewRef.current.addEventListener(
            'did-stop-loading',
            endLoadingCallback,
        );
        webviewRef.current.addEventListener(
            'did-fail-load',
            failLoadingCallback,
        );

        return () => {
            webviewRef.current.removeEventListener('dom-ready', readyCallback);
            webviewRef.current.removeEventListener(
                'did-start-loading',
                startLoadingCallback,
            );
            webviewRef.current.removeEventListener(
                'did-stop-loading',
                endLoadingCallback,
            );
            webviewRef.current.removeEventListener(
                'did-fail-load',
                failLoadingCallback,
            );
        };
    }, []);

    const [networkStatus, setNetworkStatus] = useState<
        'online' | 'low-end' | 'mid-tier' | 'offline' | 'custom'
    >('online');

    const toggleInspect = useCallback(() => {
        setInspect(inspect => {
            if (inspect) {
                webViewReadyPromise.current.promise.then(id => {
                    ipcRenderer.send('execute-js', {
                        webviewId: id,
                        js: 'window._off_inspect()',
                    });
                });
            } else {
                webViewReadyPromise.current.promise.then(id => {
                    ipcRenderer.send('execute-js', {
                        webviewId: id,
                        js: inspectJs,
                    });
                });
            }
            return !inspect;
        });
    }, []);

    const onNetworkChange = useCallback((param: ClickParam) => {
        const networkStatus = param.key as any;
        webViewReadyPromise.current.promise.then(id => {
            ipcRenderer.send('setNetworkStatus', {
                webviewId: id,
                networkStatus,
                customOptions: {
                    latency: 1, // 自定义
                    downloadThroughput: 2, // 自定义
                    uploadThroughput: 3, // 自定义
                },
            });
        });
        setNetworkStatus(param.key as any);
    }, []);

    const toggleOrientation = useCallback(() => {
        //TODO ScreenOrientation 底层也要修改
        setOrientation(orientation =>
            orientation === 'portrait' ? 'landscape' : 'portrait',
        );
    }, []);

    const triggerReload = useCallback(() => {
        try {
            webviewRef.current.reload();
        } catch (e) {}
    }, []);

    const snapShot = useCallback(() => {
        webViewReadyPromise.current.promise.then(id => {
            const height = ipcRenderer.sendSync('before-snapshot', {
                webviewId: id,
            });
            console.log(height);
            webviewRef.current!.style.height = `${height}px`;
            setTimeout(() => {
                ipcRenderer.sendSync('snapshot', {
                    webviewId: id,
                });
                webviewRef.current!.style.removeProperty('height');
            }, 1000);
        });
    }, []);

    const focus = focusEmulationId === emulationId;
    const beforeFocusState = useRef(focus);

    const focusEmulation = useCallback(() => {
        setFocusEmulation(focus ? undefined : emulationId);
    }, [focus]);

    useEffect(() => {
        //TODO 动画需要优化
        // focus 动画=>先计算初始位置，然后执行居中动画
        const target = animRef.current as HTMLDivElement;
        const main = document.getElementById('main') as HTMLDivElement;
        const placeholder = placeholderRef.current as HTMLDivElement;
        const rect = placeholder.getBoundingClientRect();
        const mainRect = main.getBoundingClientRect();
        const maxWidth = main.offsetWidth;
        if (focus) {
            target.style.left =
                ((rect.left - mainRect.left) / maxWidth) * 100 + '%';
            target.style.top = rect.top - mainRect.top + 'px';
            maskWrapRef.current!.className = styles.focusWrap;
            maskWrapRef.current!.style.backgroundColor = 'rgba(0,0,0,0)';
            Promise.resolve().then(() => {
                anime({
                    targets: target,
                    duration: 300,
                    left: '50%',
                    top: '50px',
                    translateX: '-50%',
                    easing: 'easeInQuad',
                    begin: () => {},
                    complete: () => {
                        //focus
                    },
                });
                // mask
                anime({
                    targets: maskWrapRef.current!,
                    duration: 300,
                    easing: 'easeInQuad',
                    backgroundColor: 'rgba(0,0,0,1)',
                    begin: () => {},
                    complete: () => {
                        //focus
                    },
                });
            });
        } else if (beforeFocusState.current) {
            // 判断当前已触发最大化状态
            // 当前已
            const left = ((rect.left - mainRect.left) / maxWidth) * 100 + '%';
            const top = rect.top - mainRect.top + 'px';
            anime({
                targets: target,
                duration: 300,
                easing: 'easeInQuad',
                left: left,
                top: top,
                translateX: '0%',
                begin: () => {},
                complete: () => {
                    //focus
                    target.style.removeProperty('position');
                    target.style.removeProperty('left');
                    target.style.removeProperty('top');
                    target.style.removeProperty('transform');
                },
            });
            // mask
            anime({
                targets: maskWrapRef.current!,
                duration: 300,
                easing: 'easeInQuad',
                backgroundColor: 'rgba(0,0,0,0)',
                begin: () => {},
                complete: () => {
                    //focus
                    maskWrapRef.current!.className = styles.focusWrapDefault;
                    maskWrapRef.current!.style.backgroundColor =
                        'rgba(0,0,0,0)';
                },
            });
        }
        beforeFocusState.current = focus;
    }, [focus]);

    const openDev = useCallback(() => {
        webViewReadyPromise.current.promise.then(id => {
            ipcRenderer.send('open-dev', {
                webviewId: id,
            });
        });
    }, []);

    const config = emulationTypeMap[deviceType];

    const width = orientation === 'portrait' ? config.width : config.height;
    const height = orientation === 'portrait' ? config.height : config.width;

    const webviewComponent = useMemo(() => {
        return (
            <webview
                ref={webviewRef}
                src={url}
                useragent={config.userAgent}
                className={styles.webview}
                preload={preload ? `file:///${preload}` : undefined}
            />
        );
    }, [url]);

    const realContent = useMemo(() => {
        return (
            <div
                ref={animRef}
                className={styles.anim}
                style={{
                    width: width,
                    height: height,
                    transform: `scale(${zoom / 100})`,
                    transformOrigin: 'top left',
                }}
            >
                <div
                    className={classNames(
                        'flex-row',
                        'flex-align',
                        styles.toolbar,
                    )}
                >
                    <Icons
                        type={`tools-${config.type}`}
                        className={classNames(styles.icon, {
                            [styles.iconHorizon]: orientation === 'landscape',
                        })}
                        onClick={
                            config.type !== 'mobile' && config.type !== 'pad'
                                ? undefined
                                : toggleOrientation
                        }
                    />
                    <div className="flex-fill flex-row flex-align">
                        <div className={styles.title}>
                            {deviceName || config.deviceName}
                        </div>
                        <div className={styles.subtitle}>
                            ({width}x️{height})
                        </div>
                    </div>
                    <div>
                        <Icons
                            type="tools-reload"
                            className={styles.icon}
                            onClick={triggerReload}
                        />
                        <Dropdown
                            overlay={
                                <Menu selectedKeys={[networkStatus]}>
                                    <Menu.Item
                                        key="online"
                                        onClick={onNetworkChange}
                                    >
                                        online
                                    </Menu.Item>
                                    <Menu.Item
                                        key="low-end"
                                        onClick={onNetworkChange}
                                    >
                                        low-end
                                    </Menu.Item>
                                    <Menu.Item
                                        key="mid-tier"
                                        onClick={onNetworkChange}
                                    >
                                        mid-tier
                                    </Menu.Item>
                                    <Menu.Item
                                        danger
                                        key="offline"
                                        onClick={onNetworkChange}
                                    >
                                        offline
                                    </Menu.Item>
                                    {/*TODO 支持自定义，全局自定义，和单个自定义并应用*/}
                                    <Menu.Item
                                        key="custom"
                                        onClick={onNetworkChange}
                                    >
                                        custom
                                    </Menu.Item>
                                </Menu>
                            }
                        >
                            <Icons type="tools-wifi" className={styles.icon} />
                        </Dropdown>

                        <Icons
                            type="tools-screenshot"
                            className={styles.icon}
                            onClick={snapShot}
                        />
                        <Icons
                            type="tools-focus"
                            className={styles.icon}
                            onClick={focusEmulation}
                        />
                        <Dropdown
                            overlay={
                                <Menu>
                                    <Menu.Item>
                                        <Icons
                                            type="tools-devtool"
                                            className={styles.icon}
                                            onClick={openDev}
                                        />
                                    </Menu.Item>
                                    <Menu.Item>
                                        <Icons
                                            type="tools-touch"
                                            className={styles.icon}
                                            onClick={() =>
                                                webViewReadyPromise.current.promise.then(
                                                    id => {
                                                        ipcRenderer.send(
                                                            'touch',
                                                            {
                                                                webviewId: id,
                                                            },
                                                        );
                                                    },
                                                )
                                            }
                                        />
                                    </Menu.Item>
                                    <Menu.Item onClick={toggleInspect}>
                                        <Icons
                                            type="tools-touch"
                                            className={classNames(styles.icon, {
                                                [styles.iconActive]: inspect,
                                            })}
                                        />
                                    </Menu.Item>
                                </Menu>
                            }
                        >
                            <Icons type="tools-more" className={styles.icon} />
                        </Dropdown>
                    </div>
                </div>
                {loading && (
                    <div className={styles.loadingTrack}>
                        <div className={styles.loadingBar} />
                    </div>
                )}
                <div className={styles.fullWrap}>{webviewComponent}</div>
            </div>
        );
    }, [orientation, loading, networkStatus, url, focus, zoom, inspect]);

    return useMemo(() => {
        return (
            <div
                className={classNames(
                    styles.container,
                    'inline-block',
                    'block-align-top',
                    {
                        [styles.filterIgnore]:
                            (osFilter && osFilter !== config.os) ||
                            (typeFilter && typeFilter !== config.type),
                    },
                )}
                style={{
                    width: (width * zoom) / 100,
                    height: (height * zoom) / 100,
                    paddingTop: (25 * zoom) / 100,
                }}
            >
                <div ref={placeholderRef} className={styles.placeholder} />
                <div
                    ref={maskWrapRef}
                    className={styles.focusWrapDefault}
                    style={{
                        top: (25 * zoom) / 100,
                    }}
                >
                    {realContent}
                </div>
            </div>
        );
    }, [
        url,
        orientation,
        osFilter,
        typeFilter,
        networkStatus,
        loading,
        focus,
        zoom,
        inspect,
    ]);
};

export default Emulation;
