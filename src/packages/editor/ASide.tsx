import React, { Fragment, useEffect, useState } from 'react';
import styles from './styles/aside.module.less';
import { Tooltip } from 'antd';
import {
    ExclamationCircleOutlined,
    LockOutlined,
    PlusCircleOutlined,
    UnlockOutlined,
} from '@ant-design/icons/lib';
import DrawerMenu from 'rc-drawer';
import dragula from 'dragula';
import 'dragula/dist/dragula.css';

const template: any = {
    Nav: {
        name: 'Header',
        order: 0,
        data: [
            {
                src: 'https://zos.alipayobjects.com/rmsportal/ZjfIAdkDVlpnilf.jpg',
                text: '普通型(暗色)',
                uid: 0,
            },
            {
                src: 'https://zos.alipayobjects.com/rmsportal/UTHsfGMNXXbpEoL.jpg',
                text: '带用户型',
                uid: 1,
            },
            {
                src: 'https://zos.alipayobjects.com/rmsportal/ZjfIAdkDVlpnilf.jpg',
                text: 'Link 页面滚动',
                uid: 2,
            },
            {
                src:
                    'https://gw.alipayobjects.com/mdn/rms_ae7ad9/afts/img/A*luthRonCYuQAAAAAAAAAAABkARQnAQ',
                text: '普通型(浅色)',
                uid: 3,
            },
        ],
    },
};

const ASide = () => {
    const [editMenuOpen, setEditMenuOpen] = useState<boolean>(false);
    const showMenu = () => {
        setEditMenuOpen(true);
    };
    const hideMenu = () => {
        setEditMenuOpen(false);
    };

    const pushData = (child: any, i: number, key: string, item: any) => {
        if (child.disabled) {
            return null;
        }
        const img = child.isVideo ? (
            <video src={child.src} width="100%" height="100%" autoPlay loop>
                <track kind="captions" />
            </video>
        ) : (
            <img src={child.src} width="100%" alt="img" />
        );

        return (
            <div
                draggable={true}
                className={styles.imgWrapper}
                key={`${key}${'uid' in child ? child.uid : i}`}
                data-key={`${key}${'uid' in child ? child.uid : i}`}
            >
                <Tooltip
                    placement="right"
                    title={<div style={{ width: 500 }}>{img}</div>}
                    overlayStyle={{ maxWidth: 'none' }}
                >
                    <div draggable={true} className={styles.img}>
                        {img}
                    </div>
                </Tooltip>
                <p>
                    {item.name}
                    {child.uid} - {child.text}
                </p>
            </div>
        );
    };

    const isLock = true;

    useEffect(() => {
        // drag
        // 接收子级里传来的 dom 数据;
        /*    window.receiveDomData = this.receiveDomData;
        // 重置框
        window.addEventListener('resize', () => {
            this.reRect();
        });*/
        // 拖动

        const side = document.querySelector('#asideDrawer');

        const stage = document.querySelector('#editorContent');
        const t = dragula([side, stage], {
            copy: (el, source) => source === side,
            moves: (el, container, handle) =>
                handle.classList.contains('drag-hints') ||
                handle.classList.contains('img') ||
                handle.tagName.toLocaleLowerCase() === 'img',
            accepts: (el, source) => {
                /*if (source === stage) {
                    const elKey = el.getAttribute('data-key');
                    const data = state.data;
                    const dArr = Object.keys(data)
                        .filter(key => key.split('_')[0] === elKey)
                        .map(key => parseFloat(key.split('_')[1]))
                        .sort((a, b) => a - b);
                    newId = `${elKey}_${dArr[dArr.length - 1] + 1 || 0}`;
                    const sourceArray = Array.prototype.slice.call(source.children);
                    stateChild = stateChild || sourceArray;
                    const placeholder = source.querySelectorAll('.placeholder')[0];
                    const ci = sourceArray.indexOf(placeholder);
                    if (ci >= 0) {
                        const dom = sourceArray[ci - 1 >= 0 ? ci - 1 : 0];
                        if (dom) {
                            placeholder.style.top = ci
                                ? `${dom.offsetTop + dom.offsetHeight}px`
                                : 0;
                            placeholder.style.zIndex = dom.style.zIndex;
                        }
                    }
                    const ii = sourceArray.indexOf(el);
                    if (
                        ii >= 0 &&
                        sourceArray.map(item => item.getAttribute('id')).join() !==
                        stateChild.map(item => item.getAttribute('id')).join()
                    ) {
                        // this.setPropsData(el, sourceArray);
                        stateChild = sourceArray;
                    }
                }*/
                return source === stage;
            },
        });

        /*
        let newId;

        let stateChild;
        const t = dragula([side, stage], {
            copy: (el, source) => source === side,
            moves: (el, container, handle) =>
                handle.classList.contains('drag-hints') ||
                handle.classList.contains('img') ||
                handle.tagName.toLocaleLowerCase() === 'img',
            accepts: (el, source) => {
                if (source === stage) {
                    const elKey = el.getAttribute('data-key');
                    const data = state.data;
                    const dArr = Object.keys(data)
                        .filter(key => key.split('_')[0] === elKey)
                        .map(key => parseFloat(key.split('_')[1]))
                        .sort((a, b) => a - b);
                    newId = `${elKey}_${dArr[dArr.length - 1] + 1 || 0}`;
                    const sourceArray = Array.prototype.slice.call(source.children);
                    stateChild = stateChild || sourceArray;
                    const placeholder = source.querySelectorAll('.placeholder')[0];
                    const ci = sourceArray.indexOf(placeholder);
                    if (ci >= 0) {
                        const dom = sourceArray[ci - 1 >= 0 ? ci - 1 : 0];
                        if (dom) {
                            placeholder.style.top = ci
                                ? `${dom.offsetTop + dom.offsetHeight}px`
                                : 0;
                            placeholder.style.zIndex = dom.style.zIndex;
                        }
                    }
                    const ii = sourceArray.indexOf(el);
                    if (
                        ii >= 0 &&
                        sourceArray.map(item => item.getAttribute('id')).join() !==
                            stateChild.map(item => item.getAttribute('id')).join()
                    ) {
                        // this.setPropsData(el, sourceArray);
                        stateChild = sourceArray;
                    }
                }
                return source === stage;
            },
        });
        t.on('drag', () => {
            newId = '';
            stateChild = null;
            // this.isDrag = true;
            // this.reRect();
            // state.className = `${state.className} drag`;
        })
            .on('dragend', () => {
                // state.className = state.className.replace('drag', '').trim();
                // this.isDrag = false;
            })
            .on('drop', el => {
                if (el.className === 'placeholder') {
                    el.innerHTML = '';
                    el.setAttribute('id', newId);
                }
            })
            .on('shadow', e => {
                // 挡掉上下拖动滚动跳动；
                /!*      this.dom.scrollTop = this.scrollTop;
                // 占位符
                if (e.className.indexOf('img-wrapper') >= 0) {
                    e.className = 'placeholder';
                    const isZhCN = utils.isZhCN(this.props.location.pathname);
                    e.innerHTML = isZhCN ? '放在此处' : 'Placed here';
                }*!/
            })
            .on('out', (el, source) => {
                if (source === stage) {
                    if (el.className === 'placeholder') {
                        // || el.className === 'overlay-elem'
                        // this.setPropsData(el, Array.prototype.slice.call(source.children));
                    }
                }
            })
            .on('cloned', (clone, original, type) => {
                if (type === 'mirror' && clone.className.indexOf('img-wrapper') === -1) {
                    const key = clone.getAttribute('data-key');
                    const keyName = key.replace(/[^a-z]/gi, '');
                    const keyId = parseFloat(key.replace(/[a-z]/gi, ''));
                    const item = template[keyName].data.filter(
                        (c, i) => c.uid === keyId || i === keyId,
                    )[0];
                    clone.style.backgroundImage = `url(${item && item.src})`;
                    clone.style.backgroundSize = 'cover';
                    clone.style.backgroundPosition = 'center top';
                }
            });*/
    }, []);

    return (
        <div className={styles.editSideMenuWrapper} onMouseLeave={hideMenu}>
            <DrawerMenu
                level={null}
                getContainer={null}
                handler={null}
                open={editMenuOpen}
                wrapperClassName={styles.editSideDrawer}
            >
                <div className={styles.imgContentWrapper} id="asideDrawer">
                    {Object.keys(template)
                        .sort((a, b) => template[a].order - template[b].order)
                        .map(key => {
                            if (key !== 'Other') {
                                const item = template[key];
                                return (
                                    <Fragment key={key}>
                                        <div className={styles.title} key={key}>
                                            {item.name}
                                        </div>
                                        {item.data.map((child, i) => {
                                            return pushData(child, i, key, item);
                                        })}
                                    </Fragment>
                                );
                            }
                        })}
                </div>
            </DrawerMenu>
            <div className={styles.editSideMenu}>
                <div className={styles.add} onMouseEnter={showMenu}>
                    <PlusCircleOutlined /> 添加内容
                </div>
                <ul className={styles.other} onMouseEnter={hideMenu}>
                    <Tooltip title={isLock ? '编辑加密' : '取消加密'} placement="right">
                        <li>{isLock ? <LockOutlined /> : <UnlockOutlined />}</li>
                    </Tooltip>
                    <Tooltip title="查看帮助" placement="right">
                        <li>
                            <a target="_blank">
                                <ExclamationCircleOutlined />
                            </a>
                        </li>
                    </Tooltip>
                </ul>
            </div>
        </div>
    );
};

export default ASide;
