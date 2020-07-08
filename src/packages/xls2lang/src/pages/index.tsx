import React, { FC, useState, useCallback } from 'react';
import styles from '../styles/index.module.less';
import { Upload, Table, Tabs } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { RcFile } from 'antd/lib/upload/interface';
import Icons from '../../../sizzy/src/components/IconFont/index';
import Editor from '../../../main/src/pages/components/Editor';

const { ipcRenderer } = window.require('electron');

const { Dragger } = Upload;

const Xls2Lang: FC = (props) => {
    const [activeKey, setActiveKey] = useState(0);
    const [fileJson, setFileJson] = useState<
        Array<{
            name: string;
            data: Array<Array<string | undefined>>;
        }>
    >();

    const [codeTypes, setCodeTypes] = useState<Array<'json' | 'js' | 'ts' | undefined>>([]);

    const beforeUpload = useCallback((file: RcFile & { path?: string }, FileList: RcFile[]) => {
        const json = ipcRenderer.sendSync('xls2json', {
            path: file.path,
        });
        setFileJson(json);
        return false;
    }, []);

    return fileJson ? (
        <div className={styles.main}>
            <Tabs
                activeKey={`${activeKey}`}
                onChange={(key: string) => {
                    setActiveKey(Number(key));
                }}
                tabBarExtraContent={
                    <>
                        <Icons
                            type={'tools-json'}
                            className={styles.icon}
                            onClick={() => {
                                setCodeTypes((codeTypes) => {
                                    codeTypes[activeKey] = 'json';
                                    return Array.from(codeTypes);
                                });
                            }}
                        />
                        <Icons
                            type={'tools-js'}
                            className={styles.icon}
                            onClick={() => {
                                setCodeTypes((codeTypes) => {
                                    codeTypes[activeKey] = 'js';
                                    return Array.from(codeTypes);
                                });
                            }}
                        />
                        <Icons
                            type={'tools-ts'}
                            className={styles.icon}
                            onClick={() => {
                                setCodeTypes((codeTypes) => {
                                    codeTypes[activeKey] = 'ts';
                                    return Array.from(codeTypes);
                                });
                            }}
                        />
                    </>
                }
            >
                {fileJson.map((sheet, index) => {
                    const category = sheet.data[0];
                    const data = sheet.data.slice(1);
                    const width = 150;
                    const columns = category.map((cat, index) => {
                        return {
                            title: cat,
                            dataIndex: index,
                            width: width,
                            align: 'center' as 'center',
                            className: index === 0 ? styles.langRow : undefined,
                        };
                    });
                    const codeType = codeTypes[index];

                    const keys = data.map((item) => {
                        return item[0];
                    }) as string[];

                    const getJson = (keys: string[], values: string[]) => {
                        let json: { [key: string]: any } = {};
                        keys.forEach((key, index) => {
                            json[key] = values[index];
                        });
                        return ipcRenderer.sendSync('prettier', { value: JSON.stringify(json) });
                    };

                    return (
                        <Tabs.TabPane tab={sheet.name} key={index} tabKey={`${index}`}>
                            {codeType ? (
                                <div className={styles.editor}>
                                    <Tabs>
                                        {category.map((cat, index) => {
                                            if (index === 0) {
                                                return null;
                                            }
                                            const values = data.map((item) => {
                                                return item[index];
                                            }) as string[];
                                            return (
                                                <Tabs.TabPane tab={cat as string} key={index}>
                                                    <div className={styles.editorContent}>
                                                        {codeType === 'json' ? (
                                                            <Editor
                                                                key={'json'}
                                                                options={{
                                                                    mode: 'application/json',
                                                                }}
                                                                value={getJson(keys, values)}
                                                            />
                                                        ) : codeType === 'js' ? (
                                                            <Editor
                                                                key={'javascript'}
                                                                options={{
                                                                    mode: 'javascript',
                                                                }}
                                                                value={
                                                                    'export default ' +
                                                                    getJson(keys, values)
                                                                }
                                                            />
                                                        ) : (
                                                            <Editor
                                                                key={'typescript'}
                                                                options={{
                                                                    mode: 'application/typescript',
                                                                }}
                                                                value={
                                                                    'export default ' +
                                                                    getJson(keys, values)
                                                                }
                                                            />
                                                        )}
                                                    </div>
                                                </Tabs.TabPane>
                                            );
                                        })}
                                    </Tabs>
                                </div>
                            ) : (
                                <Table
                                    rowKey={(record) => record[0] as string}
                                    bordered={true}
                                    columns={columns}
                                    dataSource={data}
                                    pagination={false}
                                    scroll={{ x: columns.length * width, y: 'calc(100vh - 130px)' }}
                                    onHeaderRow={(column) => {
                                        return {
                                            className: styles.header,
                                        };
                                    }}
                                />
                            )}
                        </Tabs.TabPane>
                    );
                })}
            </Tabs>
        </div>
    ) : (
        <div className={styles.main}>
            <div className={styles.upload}>
                <Dragger beforeUpload={beforeUpload} multiple={false}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">点击或拖动文件到该区域</p>
                    <p className="ant-upload-hint">支持Office、金山、WPS等excel表格类型.</p>
                </Dragger>
            </div>
        </div>
    );
};

export default Xls2Lang;
