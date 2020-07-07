import React, { FC, useCallback, useEffect, useMemo } from 'react';
import styles from '@/styles/index.module.less';
import { Card } from 'antd';
import { history } from '@@/core/history';

window.require = window.require || (() => {});

const Main: FC = (props) => {
    return (
        <div className={styles.main}>
            <Card
                className={styles.card}
                onClick={() => {
                    history.push('/sizzy');
                }}
            >
                Sizzy
            </Card>
            <Card
                className={styles.card}
                onClick={() => {
                    history.push('/json');
                }}
            >
                JSON
            </Card>
            <Card
                className={styles.card}
                onClick={() => {
                    history.push('/xls2lang');
                }}
            >
                Xls2Lang
            </Card>
        </div>
    );
};

export default Main;
