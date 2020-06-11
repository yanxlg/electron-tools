import React, {
    useCallback,
    useContext,
    useMemo,
    useRef,
    useState,
} from 'react';
import {
    DragDropContext,
    Draggable,
    DraggableLocation,
    Droppable,
    DropResult,
    ResponderProvided,
} from 'react-beautiful-dnd';
import { Context } from '@/components/Context';
import { Divider, List, Modal, Button, Tabs, Popconfirm } from 'antd';
import {
    AndroidOutlined,
    AppleOutlined,
    EditOutlined,
    WindowsOutlined,
    DeleteOutlined,
    CopyOutlined,
    LeftCircleOutlined,
    PlusOutlined,
} from '@ant-design/icons/lib';
import Icons from '@/components/IconFont';
import styles from '@/styles/emulation.module.less';
import EmuInstance from '@/instance/EmulationInstance';
import JsonForm, { JsonFormRef } from '@/components/JsonForm';
import QueueAnim from 'rc-queue-anim';
import EmulationEdit from '@/components/EmulationEdit';

declare interface EmulationListModalProps {
    visible: boolean;
    onCancel: () => void;
}

const EmulationListModal = ({ visible, onCancel }: EmulationListModalProps) => {
    const [activeKey, setActiveKey] = useState('1');
    useMemo(() => {
        if (visible) {
            setActiveKey('1');
        }
    }, [visible]);

    const [editInstance, setEditInstance] = useState<
        EmulationInstance | undefined
    >(undefined);

    const formRef = useRef<JsonFormRef>(null);
    const {
        emulationList,
        emulationTypeList,
        emulationTypeMap,
        updateEmulationList,
    } = useContext(Context);

    let visibleList = useMemo(() => {
        return emulationList
            .filter(({ open }) => open)
            .map((item, index) => {
                item.index = index;
                return item;
            });
    }, [emulationList]);

    let hideList = useMemo(() => {
        return emulationList
            .filter(({ open }) => !open)
            .map((item, index) => {
                item.index = index;
                return item;
            });
    }, [emulationList]);

    const reorder = useCallback(
        (droppableId: string, startIndex: number, endIndex: number) => {
            const list = droppableId === '1' ? visibleList : hideList;
            const result = Array.from(list);
            const [removed] = result.splice(startIndex, 1);
            result.splice(endIndex, 0, removed);
            if (droppableId === '1') {
                return ([] as EmuInstance[]).concat(result).concat(hideList);
            } else {
                return ([] as EmuInstance[]).concat(visibleList).concat(result);
            }
        },
        [emulationList],
    );

    const move = useCallback(
        (source: DraggableLocation, destination: DraggableLocation) => {
            const visibleListClone = Array.from(visibleList);
            const hideListClone = Array.from(hideList);
            if (source.droppableId === '1') {
                // 1=>2
                const [removed] = visibleListClone.splice(source.index, 1);
                removed.open = false;
                hideListClone.splice(destination.index, 0, removed);
            } else {
                // 2=>1
                const [removed] = hideListClone.splice(source.index, 1);
                removed.open = true;
                visibleListClone.splice(destination.index, 0, removed);
            }
            return ([] as EmuInstance[])
                .concat(visibleListClone)
                .concat(hideListClone);
        },
        [emulationList],
    );

    const onDragEnd = useCallback(
        (result: DropResult, provided: ResponderProvided) => {
            const { source, destination } = result;
            // dropped outside the list
            if (!destination) {
                return;
            }
            if (source.droppableId === destination.droppableId) {
                // sort
                const items = reorder(
                    source.droppableId,
                    source.index,
                    destination.index,
                );
                updateEmulationList(items);
            } else {
                const items = move(source, destination);
                updateEmulationList(items);
            }
        },
        [emulationList],
    );

    const onAddEmulation = useCallback(() => {
        setActiveKey('2');
    }, []);

    const onOKey = useCallback(() => {
        if (activeKey === '1') {
            onCancel();
        } else {
            formRef.current!.validateFields().then(values => {
                const { deviceType, deviceName } = values;
                const emuInstance = new EmuInstance(
                    deviceType,
                    true,
                    deviceName,
                );
                const visibleListClone = Array.from(visibleList);
                const hideListClone = Array.from(hideList);
                const items = [emuInstance]
                    .concat(visibleListClone)
                    .concat(hideListClone);
                updateEmulationList(items);
            });
            onCancel();
        }
    }, [activeKey]);

    const onBack = useCallback(() => {
        setActiveKey('1');
    }, []);

    const onDelete = useCallback(
        (rmId: string) => {
            const filter = emulationList.filter(({ id }) => id !== rmId);
            updateEmulationList(filter);
        },
        [emulationList],
    );

    const onCopy = useCallback(
        (emulation: EmulationInstance, index: number) => {
            const copy = new EmuInstance(
                emulation.deviceType,
                emulation.open,
                emulation.deviceName,
            );
            const visibleListClone = Array.from(visibleList);
            const hideListClone = Array.from(hideList);
            if (copy.open) {
                visibleListClone.splice(index + 1, 0, copy);
            } else {
                hideListClone.splice(index + 1, 0, copy);
            }
            const items = ([] as EmuInstance[])
                .concat(visibleListClone)
                .concat(hideListClone);
            updateEmulationList(items);
        },
        [emulationList],
    );

    const onEdit = useCallback((emulation: EmulationInstance) => {
        setEditInstance(emulation);
        setActiveKey('3');
    }, []);

    return useMemo(() => {
        return (
            <Modal
                width={800}
                visible={visible}
                title={activeKey === '1' ? '虚拟设备列表' : '添加虚拟设备'}
                okText="确定"
                cancelText="取消"
                onCancel={onCancel}
                onOk={onOKey}
            >
                <QueueAnim
                    component="div"
                    type={['right', 'left']}
                    leaveReverse
                >
                    {activeKey === '1' ? (
                        <DragDropContext onDragEnd={onDragEnd}>
                            <div className={styles.listTitle}>
                                显示设备
                                <PlusOutlined
                                    className={styles.listAdd}
                                    onClick={onAddEmulation}
                                />
                            </div>
                            <Divider className={styles.listDivider} />
                            <Droppable droppableId="1">
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        className={styles.list}
                                    >
                                        {visibleList.map(
                                            ({
                                                id,
                                                index,
                                                deviceType,
                                                deviceName,
                                                ...extra
                                            }) => {
                                                const emulationType =
                                                    emulationTypeMap[
                                                        deviceType
                                                    ];
                                                const {
                                                    os,
                                                    type,
                                                    width,
                                                    height,
                                                } = emulationType;
                                                return (
                                                    <Draggable
                                                        key={id}
                                                        draggableId={String(id)}
                                                        index={index!}
                                                    >
                                                        {(
                                                            provided,
                                                            snapshot,
                                                        ) => (
                                                            <div
                                                                ref={
                                                                    provided.innerRef
                                                                }
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                            >
                                                                <List.Item
                                                                    actions={[
                                                                        <EditOutlined
                                                                            onClick={() =>
                                                                                onEdit(
                                                                                    {
                                                                                        id,
                                                                                        index,
                                                                                        deviceType,
                                                                                        deviceName,
                                                                                        ...extra,
                                                                                    },
                                                                                )
                                                                            }
                                                                            key={
                                                                                'edit'
                                                                            }
                                                                        />,
                                                                        <Popconfirm
                                                                            title="确定要删除改模拟设备吗？"
                                                                            onConfirm={() =>
                                                                                onDelete(
                                                                                    id,
                                                                                )
                                                                            }
                                                                            okText="确定"
                                                                            cancelText="取消"
                                                                        >
                                                                            <DeleteOutlined key="delete" />
                                                                        </Popconfirm>,
                                                                        <CopyOutlined
                                                                            key="copy"
                                                                            onClick={() =>
                                                                                onCopy(
                                                                                    {
                                                                                        id,
                                                                                        deviceType,
                                                                                        deviceName,
                                                                                        ...extra,
                                                                                    },
                                                                                    index!,
                                                                                )
                                                                            }
                                                                        />,
                                                                    ]}
                                                                >
                                                                    <List.Item.Meta
                                                                        avatar={
                                                                            os ===
                                                                            'Android' ? (
                                                                                <AndroidOutlined
                                                                                    className={
                                                                                        styles.listAvatar
                                                                                    }
                                                                                />
                                                                            ) : os ===
                                                                              'Mac OS' ? (
                                                                                <AppleOutlined
                                                                                    className={
                                                                                        styles.listAvatar
                                                                                    }
                                                                                />
                                                                            ) : os ===
                                                                              'Windows' ? (
                                                                                <WindowsOutlined
                                                                                    className={
                                                                                        styles.listAvatar
                                                                                    }
                                                                                />
                                                                            ) : os ===
                                                                              'Others' ? (
                                                                                <Icons
                                                                                    title="其他OS"
                                                                                    type="tools-system"
                                                                                    className={
                                                                                        styles.listAvatar
                                                                                    }
                                                                                />
                                                                            ) : null
                                                                        }
                                                                        title={
                                                                            deviceName ||
                                                                            deviceType
                                                                        }
                                                                        description={
                                                                            <>
                                                                                <Icons
                                                                                    type={`tools-${type}`}
                                                                                />

                                                                                （
                                                                                {
                                                                                    width
                                                                                }

                                                                                *
                                                                                {
                                                                                    height
                                                                                }

                                                                                ）
                                                                            </>
                                                                        }
                                                                    />
                                                                </List.Item>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                );
                                            },
                                        )}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                            <div className={styles.listTitle}>未显示设备</div>
                            <Divider className={styles.listDivider} />
                            <Droppable droppableId="2">
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        className={styles.list}
                                    >
                                        {hideList.map(
                                            ({
                                                id,
                                                index,
                                                deviceType,
                                                deviceName,
                                                ...extra
                                            }) => {
                                                const emulationType =
                                                    emulationTypeMap[
                                                        deviceType
                                                    ];
                                                const {
                                                    os,
                                                    type,
                                                    width,
                                                    height,
                                                } = emulationType;
                                                return (
                                                    <Draggable
                                                        key={id}
                                                        draggableId={String(id)}
                                                        index={index!}
                                                    >
                                                        {(
                                                            provided,
                                                            snapshot,
                                                        ) => (
                                                            <div
                                                                ref={
                                                                    provided.innerRef
                                                                }
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                            >
                                                                <List.Item
                                                                    actions={[
                                                                        <EditOutlined
                                                                            key={
                                                                                'edit'
                                                                            }
                                                                            onClick={() =>
                                                                                onEdit(
                                                                                    {
                                                                                        id,
                                                                                        index,
                                                                                        deviceType,
                                                                                        deviceName,
                                                                                        ...extra,
                                                                                    },
                                                                                )
                                                                            }
                                                                        />,
                                                                        <Popconfirm
                                                                            title="确定要删除改模拟设备吗？"
                                                                            onConfirm={() =>
                                                                                onDelete(
                                                                                    id,
                                                                                )
                                                                            }
                                                                            okText="确定"
                                                                            cancelText="取消"
                                                                        >
                                                                            <DeleteOutlined key="delete" />
                                                                        </Popconfirm>,
                                                                        <CopyOutlined
                                                                            key="copy"
                                                                            onClick={() =>
                                                                                onCopy(
                                                                                    {
                                                                                        id,
                                                                                        deviceType,
                                                                                        deviceName,
                                                                                        ...extra,
                                                                                    },
                                                                                    index!,
                                                                                )
                                                                            }
                                                                        />,
                                                                    ]}
                                                                >
                                                                    <List.Item.Meta
                                                                        avatar={
                                                                            os ===
                                                                            'Android' ? (
                                                                                <AndroidOutlined
                                                                                    className={
                                                                                        styles.listAvatar
                                                                                    }
                                                                                />
                                                                            ) : os ===
                                                                              'Mac OS' ? (
                                                                                <AppleOutlined
                                                                                    className={
                                                                                        styles.listAvatar
                                                                                    }
                                                                                />
                                                                            ) : os ===
                                                                              'Windows' ? (
                                                                                <WindowsOutlined
                                                                                    className={
                                                                                        styles.listAvatar
                                                                                    }
                                                                                />
                                                                            ) : os ===
                                                                              'Others' ? (
                                                                                <Icons
                                                                                    title="其他OS"
                                                                                    type="tools-system"
                                                                                    className={
                                                                                        styles.listAvatar
                                                                                    }
                                                                                />
                                                                            ) : null
                                                                        }
                                                                        title={
                                                                            deviceName ||
                                                                            deviceType
                                                                        }
                                                                        description={
                                                                            <>
                                                                                <Icons
                                                                                    type={`tools-${type}`}
                                                                                />

                                                                                （
                                                                                {
                                                                                    width
                                                                                }

                                                                                *
                                                                                {
                                                                                    height
                                                                                }

                                                                                ）
                                                                            </>
                                                                        }
                                                                    />
                                                                </List.Item>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                );
                                            },
                                        )}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    ) : activeKey === '2' ? (
                        <div>
                            <LeftCircleOutlined
                                className={styles.listBack}
                                onClick={onBack}
                            />
                            <JsonForm
                                ref={formRef}
                                fieldList={[
                                    {
                                        type: 'input',
                                        label: 'deviceName',
                                        name: 'deviceName',
                                    },
                                    {
                                        type: 'select',
                                        label: 'deviceType',
                                        name: 'deviceType',
                                        optionList: emulationTypeList.map(
                                            item => ({
                                                name: item.deviceType,
                                                value: item.deviceType,
                                            }),
                                        ),
                                    },
                                ]}
                            />
                        </div>
                    ) : activeKey === '3' ? (
                        <EmulationEdit
                            onBack={onBack}
                            emulation={editInstance}
                        />
                    ) : null}
                </QueueAnim>
            </Modal>
        );
    }, [emulationList, activeKey, emulationTypeList, visible]);
};

export default EmulationListModal;
