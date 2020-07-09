import React, { FC } from 'react';
import styles from '@/styles/index.module.less';
import { Card, Button } from 'antd';
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
                Sizzy Test
            </Card>
            <Card
                className={styles.card}
                onClick={() => {
                    history.push('/json');
                }}
            >
                JSON Viewer
            </Card>
            <Card
                className={styles.card}
                onClick={() => {
                    history.push('/xls2lang');
                }}
            >
                Lang Parser
            </Card>
            <Card
                className={styles.card}
                onClick={() => {
                    history.push('/base64');
                }}
            >
                Base64
            </Card>
        </div>
    );
};

export default Main;
