import React, { FC, useState } from 'react';
import styles from './styles/editor.module.less';
import Toolbar from './Toolbar';
import ASide from './ASide';
import PropertyView from './PropertyView';
import MediaController from './MediaController';
import EditorContent from './EditorContent';
import { Provider } from './EditorContext';

const Editor: FC = props => {
    const [media, setMedia] = useState('desktop');
    const handleMediaChange = type => {
        setMedia(type);
    };

    return (
        <Provider>
            <div className={styles.editWrapper} key="2">
                <div className={styles.editLeftView}>
                    <Toolbar />
                    {/*<NavController currentTemplateId={currentTemplateId} />*/}
                    <div className={styles.editContentWrapper}>
                        <ASide />
                        {/*<SideMenu />*/}
                        <div className={styles.editStageWrapper}>
                            {/** 切换编译器视图显示 */}
                            <MediaController media={media} onChange={handleMediaChange} />
                            <EditorContent media={media} {...props} />
                        </div>
                    </div>
                </div>
                <PropertyView />
            </div>
        </Provider>
    );
};

export default Editor;
