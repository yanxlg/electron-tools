import React, { FC } from 'react';
import classNames from 'classnames';
import { Tooltip } from 'antd';
import styles from './styles/media_controller.module.less';
import { LaptopOutlined, MobileOutlined } from '@ant-design/icons';

export type MediaType = 'desktop' | 'mobile';

interface EditInfluenceProps {
    media?: MediaType;
    onChange?: (type: MediaType) => void;
}

const MediaController: FC<EditInfluenceProps> = props => {
    const { media, onChange } = props;

    const handleChange = (type: MediaType) => {
        onChange && onChange(type);
    };

    return (
        <div className={styles.editInfluence}>
            <div>
                <Tooltip title="Desktop">
                    <LaptopOutlined
                        className={classNames({
                            [styles.active]: media === 'desktop',
                        })}
                        onClick={() => {
                            handleChange('desktop');
                        }}
                    />
                </Tooltip>
                <Tooltip title="Mobile">
                    <MobileOutlined
                        className={classNames({
                            [styles.active]: media === 'mobile',
                        })}
                        onClick={() => {
                            handleChange('mobile');
                        }}
                    />
                </Tooltip>
            </div>
        </div>
    );
};

MediaController.defaultProps = {
    media: 'desktop',
};

export default MediaController;
