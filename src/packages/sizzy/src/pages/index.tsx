import React, { FC } from 'react';
import styles from '../styles/layout.module.less';
import Toolbar from '../components/Toolbar';
import ASide from '../components/ASide';
import { Provider } from '../components/Context';
import Main from '../components/Main';
import '../styles/index.less';

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
