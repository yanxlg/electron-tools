import React, { useCallback, useMemo } from 'react';
import styles from '../styles/index.module.less';
import { LeftCircleOutlined } from '@ant-design/icons';

export default function ({ history, children }: any) {
    const onBack = useCallback(() => {
        history.goBack();
    }, []);

    return useMemo(
        () => (
            <>
                {children}
                {history.location.pathname !== '/' ? (
                    <LeftCircleOutlined
                        className={styles.back}
                        onClick={onBack}
                    />
                ) : null}
            </>
        ),
        [children],
    );
}
