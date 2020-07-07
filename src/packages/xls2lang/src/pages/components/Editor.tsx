import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import * as ace from 'brace';

import 'brace/mode/javascript';
import 'brace/theme/monokai';

declare interface EditorProps {
    mode?: string;
    theme?: string;
    onChange?: (value?: string) => void;
    value?: string;
}

const Editor: FC<EditorProps> = ({
    mode = 'ace/mode/javascript',
    theme = 'ace/theme/monokai',
    onChange,
    value,
}) => {
    const editorContainer = useRef<HTMLDivElement>(null);
    const editor = useRef<ace.Editor>();

    useEffect(() => {
        editor.current = ace.edit(editorContainer.current as HTMLDivElement);
        editor.current.getSession().setMode(mode);
        editor.current.setTheme(theme);
        editor.current.on('change', (ev) => {
            onChange?.(editor.current?.getValue());
        });
    }, []);

    useEffect(() => {
        editor.current?.setValue(value || '');
    }, [value]);

    return useMemo(() => {
        return (
            <div
                ref={editorContainer}
                style={{ position: 'absolute', width: '100%', height: '100%', left: 0, top: 0 }}
            />
        );
    }, []);
};

export default Editor;
