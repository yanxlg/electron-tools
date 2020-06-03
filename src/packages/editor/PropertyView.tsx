import React from 'react';
import styles from './styles/editor.module.less';
import { EditorList } from 'rc-editor-list';

const PropertyView = () => {
    return (
        <div className={styles.editRightView}>
            {/*    <EditorList
                style={{
                    width: '100%',
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    zIndex: 1,
                }}
                editorElem={null}
                // editorElem={this.state.editorDom}
                // onChange={this.onChange}
                // isMobile={this.state.state === 'mobile'}
                // rootSelector="#abc"
            />*/}
        </div>
    );
};

export default PropertyView;
