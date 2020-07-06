import React, { RefObject, useEffect, useMemo, useRef } from 'react';
import { LeftCircleOutlined } from '@ant-design/icons/lib';
import styles from '../styles/emulation.module.less';
import JsonForm, { JsonFormRef } from './JsonForm';
import classNames from 'classnames';
import formStyles from './JsonForm/form.module.less';

export interface IEditEmulation {
    deviceName: string;
    width: number;
    height: number;
    userAgent: string;
    id: string;
    index?: number;
}

declare interface EmulationEditProps {
    onBack: () => void;
    emulation?: IEditEmulation;
    originRef: RefObject<JsonFormRef>;
}

const EmulationEdit = ({
    onBack,
    emulation,
    originRef,
}: EmulationEditProps) => {
    useEffect(() => {
        originRef.current!.setFieldsValue({
            deviceName: emulation?.deviceName,
            userAgent: emulation?.userAgent,
            width: emulation?.width,
            height: emulation?.height,
        });
    }, [emulation]);

    return useMemo(() => {
        return (
            <div>
                <LeftCircleOutlined
                    className={styles.listBack}
                    onClick={onBack}
                />
                <JsonForm
                    ref={originRef}
                    enableCollapse={false}
                    fieldList={[
                        {
                            type: 'input',
                            label: 'deviceName',
                            name: 'deviceName',
                        },
                        {
                            type: 'layout',
                            fieldList: [
                                {
                                    type: 'positiveInteger',
                                    name: 'width',
                                    label: 'width',
                                    formItemClassName: classNames(
                                        formStyles.formHorizon,
                                        formStyles.formItem,
                                        styles.formLabel,
                                    ),
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入设备宽度',
                                        },
                                    ],
                                    formatter: 'number',
                                },
                                {
                                    type: 'positiveInteger',
                                    name: 'height',
                                    label: 'height',
                                    formItemClassName: classNames(
                                        formStyles.formHorizon,
                                        formStyles.formItem,
                                        styles.formLabel,
                                    ),
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入设备高度',
                                        },
                                    ],
                                    formatter: 'number',
                                },
                            ],
                        },
                        {
                            type: 'textarea',
                            name: 'userAgent',
                            label: 'userAgent',
                            className: styles.formInputFull,
                            formItemClassName: classNames(
                                styles.formLabel,
                                formStyles.formItem,
                            ),
                            autoSize: { minRows: 3, maxRows: 5 },
                            rules: [
                                {
                                    required: true,
                                    message: '请选择设备userAgent',
                                },
                            ],
                        },
                    ]}
                />
            </div>
        );
    }, [emulation]);
};

export default EmulationEdit;
