import React, { useEffect, useMemo, useRef } from 'react';
import Editor, { JSONEditorOptions } from 'jsoneditor';
import 'jsoneditor/dist/jsoneditor.min.css';

declare interface IJSONProps extends JSONEditorOptions {
    value?: any;
}

const JSONEditor: React.FC<IJSONProps> = ({ value, ...options }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const editor = useRef<Editor>();

    useEffect(() => {
        editor.current = new Editor(containerRef.current as HTMLDivElement, options);
    }, []);

    useEffect(() => {
        editor.current?.set(value);
    }, [value]);

    return useMemo(() => {
        return (
            <div
                ref={containerRef}
                style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    left: 0,
                    top: 0,
                    backgroundColor: 'rgba(0,0,0,0.85)',
                }}
            />
        );
    }, []);
};

export default JSONEditor;
