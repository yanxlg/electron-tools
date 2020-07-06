import React, {
    RefObject,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { Modal } from 'antd';
import JsonForm, { JsonFormRef } from './JsonForm';
import {
    AndroidOutlined,
    AppleOutlined,
    WindowsOutlined,
} from '@ant-design/icons/lib';
import classNames from 'classnames';
import styles from '../styles/emulation.module.less';
import formStyles from './JsonForm/form.module.less';
import Icons from './IconFont';
import { Store } from 'rc-field-form/es/interface';
import { Context, innerEmulationTypeMap } from './Context';

declare interface EmulationTypeModalProps {
    visible: boolean | string;
    onCancel: () => void;
}

declare interface FormProps {
    disabled: boolean;
    visible: boolean | string;
    forwardRef: RefObject<JsonFormRef>;
    emulationTypeMap: { [key: string]: EmulationType };
}

const Form = ({
    disabled,
    visible,
    emulationTypeMap,
    forwardRef,
}: FormProps) => {
    useEffect(() => {
        if (visible) {
            if (typeof visible === 'string') {
                // 获取数据
                const emulationInstance = emulationTypeMap[visible];
                forwardRef.current!.setFieldsValue({
                    ...emulationInstance,
                });
            }
        }
    }, [visible]);

    return useMemo(() => {
        return (
            <JsonForm
                layout="horizontal"
                ref={forwardRef}
                className={formStyles.formHelpAbsolute}
                initialValues={{
                    os: 'Android',
                    type: 'mobile',
                }}
                fieldList={[
                    {
                        type: 'input',
                        name: 'deviceType',
                        label: 'deviceType',
                        disabled: disabled,
                        formItemClassName: classNames(
                            styles.formLabel,
                            formStyles.formItem,
                        ),
                        className: styles.formInputFull,
                        rules: [
                            {
                                required: true,
                                message:
                                    '请输入设备类型（添加后自动创建设备实例使用该类型作为设备名）',
                            },
                            {
                                validator: (rule, value) => {
                                    if (
                                        emulationTypeMap.hasOwnProperty(value)
                                    ) {
                                        return Promise.reject(
                                            '已存在相同的deviceType',
                                        );
                                    } else {
                                        return Promise.resolve();
                                    }
                                },
                            },
                        ],
                    },
                    {
                        type: 'layout',
                        fieldList: [
                            {
                                type: 'positiveInteger',
                                name: 'width',
                                label: 'width',
                                disabled: disabled,
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
                                disabled: disabled,
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
                        type: 'layout',
                        fieldList: [
                            {
                                type: 'radioGroup',
                                name: 'os',
                                label: 'os',
                                radioType: 'button',
                                disabled: disabled,
                                formItemClassName: classNames(
                                    formStyles.formHorizon,
                                    formStyles.formItem,
                                    styles.formLabel,
                                ),
                                options: [
                                    {
                                        label: <AndroidOutlined />,
                                        value: 'Android',
                                    },
                                    {
                                        label: <AppleOutlined />,
                                        value: 'Mac OS',
                                    },
                                    {
                                        label: <WindowsOutlined />,
                                        value: 'Windows',
                                    },
                                    {
                                        label: (
                                            <Icons
                                                title="其他OS"
                                                type="tools-system"
                                            />
                                        ),
                                        value: 'Others',
                                    },
                                ],
                                onChange: (name, form) => {
                                    form.resetFields(['osName']);
                                },
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择设备系统',
                                    },
                                ],
                            },
                            {
                                type: 'dynamic',
                                shouldUpdate: (
                                    prevValues: Store,
                                    nextValues: Store,
                                ) => {
                                    return (
                                        prevValues['os'] !== nextValues['os']
                                    );
                                },
                                dynamic: form => {
                                    const os = form.getFieldValue('os');
                                    return {
                                        type: 'input',
                                        name: 'osName',
                                        label: null,
                                        colon: false,
                                        labelClassName: styles.formAttachLabel,
                                        disabled: os !== 'Others' || disabled,
                                        formItemClassName: classNames(
                                            formStyles.formHorizon,
                                            formStyles.formItem,
                                            styles.formAttach,
                                            styles.formLabel,
                                        ),
                                        rules: [
                                            {
                                                required: os === 'Others',
                                                message: '请填写设备系统名',
                                            },
                                        ],
                                    };
                                },
                            },
                        ],
                    },
                    {
                        type: 'radioGroup',
                        name: 'type',
                        label: 'type',
                        radioType: 'button',
                        disabled: disabled,
                        formItemClassName: classNames(
                            styles.formLabel,
                            formStyles.formItem,
                        ),
                        options: [
                            {
                                label: <Icons type="tools-mobile" />,
                                value: 'mobile',
                            },
                            {
                                label: <Icons type="tools-pad" />,
                                value: 'pad',
                            },
                            {
                                label: <Icons type="tools-laptop" />,
                                value: 'laptop',
                            },
                            {
                                label: <Icons type="tools-desktop" />,
                                value: 'desktop',
                            },
                        ],
                        rules: [
                            {
                                required: true,
                                message: '请选择设备类型',
                            },
                        ],
                    },
                    {
                        type: 'textarea',
                        name: 'userAgent',
                        label: 'userAgent',
                        disabled: disabled,
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
                enableCollapse={false}
            />
        );
    }, []);
};

const EmulationTypeModal = ({ visible, onCancel }: EmulationTypeModalProps) => {
    const formRef = useRef<JsonFormRef>(null);
    const { addEmulationType, emulationTypeMap } = useContext(Context);
    const [submitting, setSubmitting] = useState(false);

    const editableRef = useRef(true);
    useMemo(() => {
        if (visible) {
            editableRef.current =
                (typeof visible === 'string' &&
                    !innerEmulationTypeMap.hasOwnProperty(visible)) ||
                typeof visible === 'boolean';
        }
    }, [visible]);

    const submit = useCallback(() => {
        if (!editableRef.current) {
            onCancel();
        }
        formRef.current!.validateFields().then((values: any) => {
            // 添加一个emulationType
            setSubmitting(true);
            addEmulationType({
                ...values,
                deviceName: values.deviceType,
            }).then(() => {
                setSubmitting(false);
                onCancel();
            });
        });
    }, []);

    return useMemo(() => {
        const disabled = !editableRef.current;
        const title =
            typeof visible === 'boolean'
                ? '添加虚拟设备类型'
                : innerEmulationTypeMap.hasOwnProperty(visible)
                ? '查看虚拟设备类型'
                : '编辑虚拟设备类型';
        return (
            <Modal
                width={600}
                visible={!!visible}
                title={title}
                onCancel={onCancel}
                okText="确定"
                cancelText="取消"
                onOk={submit}
                confirmLoading={submitting}
                destroyOnClose={true}
            >
                <Form
                    disabled={disabled}
                    forwardRef={formRef}
                    visible={visible}
                    emulationTypeMap={emulationTypeMap}
                />
            </Modal>
        );
    }, [visible, submitting]);
};

export default EmulationTypeModal;
