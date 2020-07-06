import React, { FC, useEffect } from 'react';
import styles from './styles/index.module.less';
import * as ace from 'brace';
import JSONEditor from 'jsoneditor';
import 'jsoneditor/dist/jsoneditor.min.css';
import 'brace/mode/json';
import 'brace/theme/terminal';
import 'brace/theme/chrome';

import 'brace/mode/javascript';
import 'brace/theme/monokai';

const JSONPage: FC = props => {
    useEffect(() => {
        const editor1 = ace.edit('javascript-editor');
        editor1.getSession().setMode('ace/mode/javascript');
        editor1.setTheme('ace/theme/monokai');

        editor1.on('change', ev => {
            try {
                const json = JSON.parse(editor1.getValue());
                console.log(json);
                editor.set(json);
            } catch (e) {
                // editor.update(e.message);
            }
        });
        const container = document.getElementById('jsoneditor') as HTMLDivElement;
        const editor = new JSONEditor(container, {
            mode: 'view',
            modes: ['code', 'form', 'tree', 'view'],
            theme: 'ace/theme/chrome',
            search: false,
            mainMenuBar: false,
            navigationBar: false,
        });
        editor.set(undefined);
    }, []);
    return (
        <div className={styles.main}>
            <div id={'javascript-editor'} className={styles.left} />
            <div id="jsoneditor" className={styles.right} />
        </div>
    );
};

export default JSONPage;
