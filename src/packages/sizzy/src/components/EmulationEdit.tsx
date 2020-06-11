import React, { useEffect, useMemo, useRef } from 'react';
import { LeftCircleOutlined } from '@ant-design/icons/lib';
import styles from '@/styles/emulation.module.less';
import JsonForm, { JsonFormRef } from '@/components/JsonForm';
import classNames from 'classnames';
import formStyles from '@/components/JsonForm/form.module.less';

declare interface EmulationEditProps {
    onBack: () => void;
    emulation?: EmulationInstance;
}

const EmulationEdit = ({ onBack, emulation }: EmulationEditProps) => {
    const formRef = useRef<JsonFormRef>(null);
    useEffect(() => {
        formRef.current!.setFieldsValue({});
    }, []);
    return useMemo(() => {
        return (
            <div>
                <LeftCircleOutlined
                    className={styles.listBack}
                    onClick={onBack}
                />
                <JsonForm
                    ref={formRef}
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
    }, []);
};

export default EmulationEdit;
