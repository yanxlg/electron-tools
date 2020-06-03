import React, { useState } from 'react';
import {
    CloudUploadOutlined,
    CodeOutlined,
    EyeOutlined,
    FileAddOutlined,
    LoadingOutlined,
    SaveOutlined,
    ToolOutlined,
} from '@ant-design/icons';
import IconFont from '@/components/IconFont';
import { Popconfirm, Tooltip } from 'antd';
import styles from '@/components/NavController/nav-controller.module.less';
import classNames from 'classnames';
import { RollbackOutlined } from '@ant-design/icons/lib';

const Toolbar = () => {
    const [saveLoad, setSaveLoad] = useState<boolean>(false);
    const [publishLoad, setPublishLoad] = useState<boolean>(false);
    const [downloadLoad, setDownloadLoad] = useState<boolean>(false);

    const handleSave = (e: MouseEvent, type: string) => {};

    const handlePreview = () => {};

    const handleUploadCloud = () => {};

    const handleChangeDataOpenModal = () => {};

    const handleRemoveAllLocalStorage = () => {};

    const handleSaveCode = () => {};

    const menuChild = [
        {
            name: '保存',
            icon: saveLoad ? <LoadingOutlined /> : <SaveOutlined />,
            onClick: saveLoad ? undefined : (e: any) => handleSave(e, 'menu'),
        },
        {
            name: '预览',
            icon: <EyeOutlined />,
            onClick: handlePreview,
        },
        {
            name: '下载',
            icon: downloadLoad ? <LoadingOutlined /> : <CodeOutlined />,
            onClick: downloadLoad ? undefined : handleSaveCode,
        },
        {
            name: '发布',
            icon: publishLoad ? <LoadingOutlined /> : <CloudUploadOutlined />,
            onClick: handleUploadCloud,
        },
        {
            name: '编辑数据',
            icon: <ToolOutlined />,
            onClick: handleChangeDataOpenModal,
        },
        {
            name: '清理缓存',
            icon: <IconFont type={'icon-brush'} />,
            onClick: handleRemoveAllLocalStorage,
            tooltip:
                '清除全部的缓存，重新从服务器读取最后保存的数据；单个缓存请在新建文件的下拉菜单里清除。',
        },
    ].map((item, i) => {
        let children = (
            <Tooltip title={item.name}>
                <a onClick={item.tooltip ? undefined : item.onClick}>{item.icon}</a>
            </Tooltip>
        );

        if (item.tooltip) {
            children = (
                <Popconfirm
                    title={item.tooltip}
                    onConfirm={item.onClick}
                    okText="确定"
                    cancelText="取消"
                    overlayStyle={{ width: 320 }}
                >
                    {children}
                </Popconfirm>
            );
        }
        return <li key={i.toString()}>{children}</li>;
    });

    return (
        <div className={styles.editNav}>
            <div className={styles.logo}>
                <img
                    src="https://gw.alipayobjects.com/zos/rmsportal/SVDdpZEbAlWBFuRGIIIL.svg"
                    alt="logo"
                />
            </div>
            <ul className={styles.menu}>{menuChild}</ul>
            <a className={styles.newFileButton}>
                <FileAddOutlined />
            </a>
            {/*<NewFileButton currentTemplateId={props.currentTemplateId} />*/}
            {/*<HistoryButton />*/}
            <ul className={styles.historyButtonWrapper}>
                <li
                    className={classNames(styles.undo, {
                        [styles.disabled]: true,
                    })}
                >
                    <Tooltip title="撤消">
                        <a>
                            <RollbackOutlined />
                        </a>
                    </Tooltip>
                </li>
                <li
                    className={classNames(styles.redo, {
                        [styles.disabled]: false,
                    })}
                >
                    <Tooltip title="重做">
                        <a>
                            <RollbackOutlined />
                        </a>
                    </Tooltip>
                </li>
            </ul>
        </div>
    );
};

export default Toolbar;
