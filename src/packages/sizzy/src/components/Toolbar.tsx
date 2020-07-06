import React, {
    useCallback,
    KeyboardEvent,
    useMemo,
    useContext,
    useState,
    useRef,
} from 'react';
import { Input, Select, Popover, Menu } from 'antd';
import classNames from 'classnames';
import styles from '../styles/toolbar.module.less';
import { Context } from './Context';
import Icons from './IconFont';
import {
    PlusOutlined,
    UnorderedListOutlined,
    PlusCircleOutlined,
} from '@ant-design/icons';
import { SettingOutlined } from '@ant-design/icons/lib';

const { ipcRenderer } = window.require('electron');

import scrollToElementJs from 'raw-loader!babel-loader!../jsTemplate/scrollToElement';
import EmulationEditModal from './EmulationEditModal';
import EmulationTypeModal from './EmulationTypeModal';
import useModal from '../hooks/useModal';
import { ClickParam } from 'antd/es/menu';
import EmulationListModal from './EmulationListModal';

declare interface ToolbarProps {}

const Toolbar = ({}: ToolbarProps) => {
    const { updateUrl, port, emulationTypeList } = useContext(Context);
    const [showAnchor, setShowAnchor] = useState(false);
    const anchorRef = useRef<Input>(null);

    const [typeModal, showTypeModal, closeTypeModal] = useModal<
        string | boolean
    >();

    const [listModal, showListModal, closeListModal] = useModal<boolean>();

    const portRef = useRef(port);
    portRef.current = port;

    const toggleAnchor = useCallback(() => {
        setShowAnchor(showAnchor => !showAnchor);
    }, []);

    const goAnchor = useCallback(() => {
        const anchor = anchorRef.current!.input.value;
        const js = scrollToElementJs.replace(/#selector/, anchor);
        ipcRenderer.send('executeJs', js);
    }, []);

    const onKeyEnter = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
        const nextPort = portRef.current + 2; // server+ config 2个服务占用两个端口
        const url = e.currentTarget.value;
        updateUrl(url, nextPort);
    }, []);

    const onMenuClick = useCallback((e: ClickParam) => {
        const key = e.key;
        if (key === 'custom') showTypeModal(true);
        else showTypeModal(key);
    }, []);

    return useMemo(() => {
        return (
            <div className={styles.toolbar}>
                <Input
                    className={styles.toolbarInput}
                    onPressEnter={onKeyEnter}
                />
                <div
                    className={classNames(styles.toolbarAnchorWrap, {
                        [styles.toolbarAnchorShow]: showAnchor,
                    })}
                >
                    <Input
                        className={styles.toolbarAnchor}
                        placeholder="anchor"
                        ref={anchorRef}
                        allowClear={true}
                    />
                    <Icons
                        type="tools-go"
                        className={styles.toolbarIcon}
                        onClick={goAnchor}
                    />
                    <Icons
                        type="tools-close"
                        className={styles.toolbarIcon}
                        onClick={toggleAnchor}
                    />
                </div>
                <Icons
                    type="tools-anchor"
                    className={classNames(styles.toolbarIcon, {
                        [styles.toolbarIconHide]: showAnchor,
                    })}
                    onClick={toggleAnchor}
                />
                <Popover
                    overlayClassName={styles.popover}
                    title={null}
                    arrowPointAtCenter={true}
                    content={
                        <>
                            <Menu
                                mode="vertical"
                                className={styles.popoverMenu}
                                selectable={false}
                                onClick={onMenuClick}
                            >
                                <Menu.Item
                                    key={'custom'}
                                    className="text-center"
                                >
                                    <PlusCircleOutlined />
                                    新增虚拟设备类型
                                </Menu.Item>
                                <Menu.Divider />
                                <Menu.ItemGroup title="已有类型">
                                    {emulationTypeList.map(emulation => {
                                        return (
                                            <Menu.Item
                                                key={emulation.deviceType}
                                            >
                                                {emulation.deviceName}
                                            </Menu.Item>
                                        );
                                    })}
                                </Menu.ItemGroup>
                            </Menu>
                        </>
                    }
                >
                    <PlusOutlined className={styles.toolbarIcon} />
                </Popover>

                <UnorderedListOutlined
                    className={styles.toolbarIcon}
                    onClick={() => showListModal(true)}
                />
                <SettingOutlined className={styles.toolbarIcon} />
                <EmulationTypeModal
                    visible={typeModal}
                    onCancel={closeTypeModal}
                />
                <EmulationEditModal
                    visible={listModal}
                    onCancel={closeListModal}
                />
                <EmulationListModal
                    visible={listModal}
                    onCancel={closeListModal}
                />
            </div>
        );
    }, [showAnchor, typeModal, listModal]);
};

export default Toolbar;
