import React, { FC } from 'react';
import styles from '@/styles/layout.module.less';
import Toolbar from './Toolbar';
import ASide from './ASide';
import { Provider } from './Context';
import Main from '@/components/Main';

const Sizzy: FC = props => {
    return (
        <Provider>
            <div className={styles.page}>
                <Toolbar />
                <div className={styles.pageContent}>
                    <ASide />
                    <Main />
                </div>
            </div>
        </Provider>
    );
};

export default Sizzy;
