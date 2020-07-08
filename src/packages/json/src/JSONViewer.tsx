import React, { FC, useCallback, useMemo, useState } from 'react';
import styles from './styles/index.module.less';
import Editor from '../../main/src/pages/components/Editor';
import * as codemirror from 'codemirror';
import JSONViewer from '../../main/src/pages/components/JSONView';

const JSONPage: FC = (props) => {
    const [json, setJson] = useState<Object>();
    const [error, setError] = useState<string>();

    const onChange = useCallback(
        (editor: codemirror.Editor, data: codemirror.EditorChange, value: string) => {
            try {
                // @ts-ignore
                const json = window.jsonlint.parse(value);
                setJson(json);
                setError(undefined);
            } catch (e) {
                setError(e.message);
            }
        },
        [],
    );

    return useMemo(() => {
        return (
            <div className={styles.main}>
                <div id={'javascript-editor'} className={styles.left}>
                    <Editor options={{ mode: 'application/json' }} onChange={onChange} />
                </div>
                <div className={styles.right}>
                    {json ? <JSONViewer src={json} /> : null}
                    {error ? (
                        <pre
                            className={styles.editorError}
                            dangerouslySetInnerHTML={{ __html: error }}
                        />
                    ) : null}
                </div>
            </div>
        );
    }, [json, error]);
};

export default JSONPage;
