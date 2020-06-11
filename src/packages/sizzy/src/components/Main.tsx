import React, { useContext, useMemo } from 'react';
import styles from '@/styles/layout.module.less';
import EmulationsContent from './EmulationsContent';
import { Context } from '@/components/Context';
import classNames from 'classnames';

const Main = () => {
    const { foldState } = useContext(Context);
    return useMemo(() => {
        return (
            <div
                id="main"
                className={classNames(styles.pageMain, {
                    [styles.pageMainFold]: foldState === 'fold',
                })}
            >
                <EmulationsContent />
            </div>
        );
    }, [foldState]);
};

export default Main;
