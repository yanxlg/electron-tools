import React, { useCallback, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { MediaType } from '@/models/global';
import { ConnectProps } from '@/models/connect';
import styles from './styles/content.module.less';
import ReactDOM from 'react-dom';

interface EditStageProps extends ConnectProps {
    media: MediaType;
}

//需要Json化所有页面，Json化太过复杂。。。
const EditorContent: React.FC<EditStageProps> = props => {
    const { media, dispatch } = props;
    const rootRef = useRef(null);

    const handleOverlayScroll = () => {};

    const handleMouseLeave = () => {};

    const handleMouseMove = () => {};

    const handleClick = () => {};

    const handleDoubleClick = () => {};

    const onClick = useCallback(e => {
        const dom = e.target;
        console.log(dom);
    }, []);

    const wrapperMove = e => {};

    const _return = (
        <div
            ref={rootRef}
            className={classNames(styles.editStage, {
                [`${styles.mobile}`]: media === 'mobile',
            })}
            onScroll={handleOverlayScroll}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
        >
            <div
                data-key="wrapper"
                onMouseMove={wrapperMove}
                onMouseEnter={wrapperMove}
                onClick={handleClick}
                className={styles.overlay}
                onDoubleClick={handleDoubleClick}
                id="editorContent"
            >
                123
            </div>
        </div>
    );

    useEffect(() => {
        console.log(_return);
    }, []);

    return _return;
};

export default EditorContent;
