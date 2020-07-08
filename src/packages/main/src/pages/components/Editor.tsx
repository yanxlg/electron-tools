import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/theme/eclipse.css';
import 'codemirror/theme/3024-day.css';
import 'codemirror/theme/3024-night.css';
import 'codemirror/theme/abcdef.css';
import 'codemirror/theme/ayu-dark.css';
import 'codemirror/theme/ayu-mirage.css';
import 'codemirror/addon/lint/lint.css';
import 'codemirror/addon/fold/foldgutter.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/comment/comment';
import 'jsonlint/web/json2';
import './jsonlint.js';
import 'codemirror/addon/lint/lint';
import 'codemirror/addon/lint/json-lint';
import 'codemirror/addon/lint/javascript-lint';
import 'codemirror/addon/search/search';
import 'codemirror/addon/search/jump-to-line';
import 'codemirror/addon/search/searchcursor';
import 'codemirror/addon/search/match-highlighter';
import 'codemirror/addon/search/matchesonscrollbar';
import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror/addon/fold/comment-fold';
import 'codemirror/addon/fold/indent-fold';
import 'codemirror/addon/fold/markdown-fold';

import React, { useMemo } from 'react';

import {
    IUnControlledCodeMirror,
    UnControlled as CodeMirror,
} from 'react-codemirror2';
import styles from '../../styles/index.module.less';

declare interface EditorProps extends IUnControlledCodeMirror {}

const Editor: React.FC<EditorProps> = ({ options, ...props }) => {
    return useMemo(() => {
        return (
            <CodeMirror
                className={styles.editor}
                {...props}
                options={{
                    mode: 'application/json',
                    theme: 'ayu-dark',
                    lineNumbers: true,
                    autoCloseBrackets: true,
                    matchBrackets: true,
                    tabSize: 4,
                    lineWrapping: true,
                    foldGutter: true,
                    lint: true,
                    indentUnit: 4,
                    ...options,
                }}
            />
        );
    }, []);
};

export default Editor;
