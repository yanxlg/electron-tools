import React, { useCallback, useContext, useMemo, useState } from 'react';
import styles from '../styles/aside.module.less';
import {
    AndroidOutlined,
    AppleOutlined,
    WindowsOutlined,
    MinusOutlined,
    PlusOutlined,
} from '@ant-design/icons/lib';
import Icons from '@/components/IconFont';
import { Context } from '@/components/Context';
import classNames from 'classnames';
import { Slider } from 'antd';

const ASide = () => {
    const {
        foldState,
        toggleFoldState,
        osFilter,
        setOsFilter,
        typeFilter,
        setTypeFilter,
        zoom,
        setZoom,
    } = useContext(Context);

    const osFilterCallback1 = useCallback(() => setOsFilter('Android'), []);
    const osFilterCallback2 = useCallback(() => setOsFilter('Mac OS'), []);
    const osFilterCallback3 = useCallback(() => setOsFilter('Windows'), []);
    const osFilterCallback4 = useCallback(() => setOsFilter('Others'), []);

    const typeFilterCallback1 = useCallback(() => setTypeFilter('mobile'), []);
    const typeFilterCallback2 = useCallback(() => setTypeFilter('pad'), []);
    const typeFilterCallback3 = useCallback(() => setTypeFilter('laptop'), []);
    const typeFilterCallback4 = useCallback(() => setTypeFilter('desktop'), []);

    const plusZoom = useCallback(() => {
        const next = Math.min(100, zoom + 5);
        setZoom(next);
    }, [zoom]);

    const reduceZoom = useCallback(() => {
        const next = Math.max(0, zoom - 5);
        setZoom(next);
    }, [zoom]);

    return useMemo(() => {
        return (
            <div
                className={classNames(styles.aside, {
                    [styles.asideFold]: foldState === 'fold',
                })}
            >
                <Icons
                    type={
                        foldState === 'unfold' ? 'tools-fold' : 'tools-unfold'
                    }
                    className={styles.iconFold}
                    onClick={toggleFoldState}
                />
                <div className={styles.labelContainer}>
                    <div className={styles.label}>
                        {foldState === 'fold' ? 'Os Filter' : 'Os'}
                    </div>
                </div>

                <div className={styles.line} />
                <div className={styles.icons}>
                    <AndroidOutlined
                        title="Android"
                        className={classNames(styles.icon, {
                            [styles.iconActive]: osFilter === 'Android',
                        })}
                        onClick={osFilterCallback1}
                    />
                    <AppleOutlined
                        title="Mac OS"
                        className={classNames(styles.icon, {
                            [styles.iconActive]: osFilter === 'Mac OS',
                        })}
                        onClick={osFilterCallback2}
                    />
                    <WindowsOutlined
                        title="Windows"
                        className={classNames(styles.icon, {
                            [styles.iconActive]: osFilter === 'Windows',
                        })}
                        onClick={osFilterCallback3}
                    />
                    <Icons
                        title="其他OS"
                        type="tools-system"
                        className={classNames(styles.icon, {
                            [styles.iconActive]: osFilter === 'Others',
                        })}
                        onClick={osFilterCallback4}
                    />
                </div>
                <div className={styles.labelContainer}>
                    <div className={styles.label}>
                        {foldState === 'fold' ? 'Type Filter' : 'Type'}
                    </div>
                </div>
                <div className={styles.line} />
                <div className={styles.icons}>
                    <Icons
                        type="tools-mobile"
                        className={classNames(styles.icon, {
                            [styles.iconActive]: typeFilter === 'mobile',
                        })}
                        onClick={typeFilterCallback1}
                    />
                    <Icons
                        type="tools-pad"
                        className={classNames(styles.icon, {
                            [styles.iconActive]: typeFilter === 'pad',
                        })}
                        onClick={typeFilterCallback2}
                    />
                    <Icons
                        type="tools-laptop"
                        className={classNames(styles.icon, {
                            [styles.iconActive]: typeFilter === 'laptop',
                        })}
                        onClick={typeFilterCallback3}
                    />
                    <Icons
                        type="tools-desktop"
                        className={classNames(styles.icon, {
                            [styles.iconActive]: typeFilter === 'desktop',
                        })}
                        onClick={typeFilterCallback4}
                    />
                </div>
                <div className={styles.labelContainer}>
                    <div className={styles.label}>Settings</div>
                </div>
                <div className={styles.line} />
                <div className={styles.zoom}>
                    <div className={styles.labelContainer}>
                        <div className={styles.label}>Zoom</div>
                    </div>
                    <div className={styles.line} />
                    <div className={styles.zoomIcons}>
                        <MinusOutlined
                            className={styles.zoomIcon}
                            onClick={reduceZoom}
                        />
                        <PlusOutlined
                            className={styles.zoomIcon}
                            onClick={plusZoom}
                        />
                    </div>

                    <div
                        className={styles.zoomNumber}
                        onClick={() => setZoom(25)}
                    >
                        25%
                    </div>
                    <div
                        className={styles.zoomNumber}
                        onClick={() => setZoom(50)}
                    >
                        50%
                    </div>
                    <div
                        className={styles.zoomNumber}
                        onClick={() => setZoom(75)}
                    >
                        75%
                    </div>
                    <div
                        className={styles.zoomNumber}
                        onClick={() => setZoom(100)}
                    >
                        100%
                    </div>
                </div>
                <div className={styles.zoomFold}>
                    <div className={styles.zoomFoldIcons}>
                        <MinusOutlined
                            className={styles.zoomFoldIcon}
                            onClick={reduceZoom}
                        />
                        <PlusOutlined
                            className={styles.zoomFoldIcon}
                            onClick={plusZoom}
                        />
                    </div>
                    <Slider
                        className={styles.zoomFoldSlider}
                        min={0}
                        max={100}
                        value={zoom}
                        defaultValue={50}
                        step={5}
                        onChange={value => setZoom(value as number)}
                    />
                    <div className={styles.zoomFoldNumberList}>
                        <div
                            className={styles.zoomNumber}
                            onClick={() => setZoom(25)}
                        >
                            25%
                        </div>
                        <div
                            className={styles.zoomNumber}
                            onClick={() => setZoom(50)}
                        >
                            50%
                        </div>
                        <div
                            className={styles.zoomNumber}
                            onClick={() => setZoom(75)}
                        >
                            75%
                        </div>
                        <div
                            className={styles.zoomNumber}
                            onClick={() => setZoom(100)}
                        >
                            100%
                        </div>
                    </div>
                </div>
            </div>
        );
    }, [foldState, osFilter, typeFilter, zoom]);
};

export default ASide;
