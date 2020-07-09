import React, { FC, useState, useCallback, useMemo } from 'react';
import styles from '../styles/index.module.less';
import { Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { RcFile } from 'antd/lib/upload/interface';
import SplitPane from "react-split-pane";

const { Dragger } = Upload;

function imgToBase64(img:HTMLImageElement,type:string) {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    ctx!.drawImage(img, 0, 0, img.width, img.height);
    return canvas.toDataURL(type);
}

const Base64ToImage: FC = (props) => {
    const [base64, setBase64] = useState<string>();

    const beforeUpload = useCallback((file: RcFile & { path?: string }, FileList: RcFile[]) => {
        const path = window.URL.createObjectURL(file);
        const image = new Image();
        image.src=path;
        image.onload=()=>{
            const base64 = imgToBase64(image,file.type);
            setBase64(base64);
        }
        return false;
    }, []);

    return useMemo(()=>{
        return (
            <div className={styles.main}>
                <SplitPane allowResize={false} className={styles.relative}>
                    {
                        base64?(
                            <div className={styles.full} style={{backgroundImage:`url(${base64})`,backgroundSize:'contain',backgroundPosition:"center center",backgroundRepeat:'no-repeat'}}>
                            </div>
                        ):(
                            <div className={styles.upload}>
                                <Dragger beforeUpload={beforeUpload} multiple={false} showUploadList={false}>
                                    <p className="ant-upload-drag-icon">
                                        <InboxOutlined />
                                    </p>
                                    <p className="ant-upload-text">点击或拖动图片文件到该区域</p>
                                    <p className="ant-upload-hint">支持png、jpg、jpeg等图片格式.</p>
                                </Dragger>
                            </div>
                        )
                    }
                    <div style={{wordBreak:"break-all",height:"100%",overflow:"auto"}}>
                        {base64}
                    </div>
                </SplitPane>
            </div>
        )
    },[base64]);
};

export default Base64ToImage;
