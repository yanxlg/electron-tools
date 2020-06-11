import React, { useMemo } from 'react';
import { Modal } from 'antd';
import JsonForm from '@/components/JsonForm';

declare interface EmulationEditModalProps {
    visible: boolean;
    onCancel: () => void;
}

const EmulationEditModal = ({ visible, onCancel }: EmulationEditModalProps) => {
    return useMemo(() => {
        return (
            <Modal
                width={500}
                visible={visible}
                title="添加虚拟设备"
                onCancel={onCancel}
            >
                <JsonForm
                    layout="horizontal"
                    fieldList={[
                        {
                            type: 'input',
                            name: 'deviceName',
                            label: 'deviceName',
                        },
                        {
                            type: 'positiveInteger',
                            name: 'width',
                            label: 'width',
                        },
                        {
                            type: 'positiveInteger',
                            name: 'height',
                            label: 'height',
                        },
                        {
                            type: 'select',
                            name: 'os',
                            label: 'os',
                            optionList: [
                                {
                                    name: 'Android',
                                    value: 'Android',
                                },
                                {
                                    name: 'Mac OS',
                                    value: 'Mac OS',
                                },
                                {
                                    name: 'Windows',
                                    value: 'Windows',
                                },
                                {
                                    name: 'MeeGo',
                                    value: 'MeeGo',
                                },
                            ],
                        },
                        {
                            type: 'select',
                            name: 'type',
                            label: 'type',
                            optionList: [
                                {
                                    name: 'mobile',
                                    value: 'mobile',
                                },
                                {
                                    name: 'pad',
                                    value: 'pad',
                                },
                                {
                                    name: 'laptop',
                                    value: 'laptop',
                                },
                                {
                                    name: 'desktop',
                                    value: 'desktop',
                                },
                            ],
                        },
                        {
                            type: 'textarea',
                            name: 'useragent',
                            label: 'useragent',
                        },
                    ]}
                    enableCollapse={false}
                />
            </Modal>
        );
    }, []);
};

export default EmulationEditModal;
