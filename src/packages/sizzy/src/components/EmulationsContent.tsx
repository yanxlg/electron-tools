import React, { useContext, useMemo } from 'react';
import styles from '@/styles/layout.module.less';
import Emulation from '@/components/Emulation';
import { Context } from '@/components/Context';
import classNames from 'classnames';

interface EditStageProps {}

const EmulationsContent: React.FC<EditStageProps> = props => {
    const { focusEmulationId, emulationList, url } = useContext(Context);
    return useMemo(() => {
        return (
            <div
                className={classNames(styles.pageContainer, {
                    [styles.pageScroll]: focusEmulationId === void 0,
                })}
            >
                {url
                    ? emulationList.map(({ deviceType, deviceName, open }) =>
                          open ? (
                              <Emulation
                                  key={deviceName || deviceType}
                                  deviceType={deviceType}
                                  deviceName={deviceName}
                              />
                          ) : null,
                      )
                    : null}
            </div>
        );
    }, [focusEmulationId, url]);
};

export default EmulationsContent;
