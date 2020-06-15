import React, { FC, useEffect, useMemo } from 'react';
import styles from '@/styles/index.module.less';
import { Card } from 'antd';
import JSONEditor from 'jsoneditor';
import 'jsoneditor/dist/jsoneditor.min.css';
import 'brace/mode/json';
import 'brace/theme/terminal';
import ace from 'brace';

const Main: FC = props => {
    useEffect(() => {
        const container = document.getElementById(
            'jsoneditor',
        ) as HTMLDivElement;
        const options = {};
        const editor = new JSONEditor(container, {
            mode: 'tree',
            modes: ['code', 'form', 'text', 'tree', 'view', 'preview'],
            theme: 'ace/theme/terminal',
            search: false,
        });
        const initialJson = {
            Array: [1, 2, 3],
            Boolean: true,
            Null: null,
            Number: 123,
            Object: { a: 'b', c: 'd' },
            String: 'Hello World',
        };
        editor.set(initialJson);
    }, []);
    return (
        <div className={styles.main}>
            <Card className={styles.card}>Sizzy</Card>
            <div
                id="jsoneditor"
                style={{ width: 400, height: 400, backgroundColor: 'white' }}
            />
        </div>
    );
};

export default Main;
