import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import styles from './styles/index.module.less';
import JSONEditor from '../../xls2lang/src/pages/components/JSONEditor';
import 'brace/theme/chrome';
import Editor from '../../xls2lang/src/pages/components/Editor';

const JSONPage: FC = (props) => {
    const [json, setJson] = useState();

    const onChange = useCallback((value?: string) => {
        try {
            const json = JSON.parse(value!);
            setJson(json);
        } catch (e) {
            // editor.update(e.message);
        }
    }, []);

    return useMemo(() => {
        return (
            <div className={styles.main}>
                <div id={'javascript-editor'} className={styles.left}>
                    <Editor onChange={onChange} />
                </div>
                <div className={styles.right}>
                    <JSONEditor
                        value={json}
                        mode={'view'}
                        modes={['code', 'form', 'tree', 'view']}
                        theme={'ace/theme/chrome'}
                        search={false}
                        mainMenuBar={false}
                        navigationBar={false}
                    />
                </div>
            </div>
        );
    }, [json]);
};

export default JSONPage;
