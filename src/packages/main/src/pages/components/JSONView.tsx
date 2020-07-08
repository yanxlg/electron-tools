import React, { useMemo } from 'react';
import ReactJson, { ReactJsonViewProps } from 'react-json-view';

const JSONViewer: React.FC<ReactJsonViewProps> = (props) => {
    return useMemo(() => {
        return (
            <ReactJson
                theme="threezerotwofour"
                iconStyle="circle"
                name={null}
                collapsed={false}
                style={{
                    height: '100%',
                }}
                {...props}
            />
        );
    }, [props]);
};

export default JSONViewer;
