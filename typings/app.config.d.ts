declare interface EmulationType {
    deviceType: string;
    deviceName: string;
    userAgent: string;
    width: number;
    height: number;
    os: 'Android' | 'Mac OS' | 'Windows' | string;
    type: 'mobile' | 'pad' | 'laptop' | 'desktop';
    jsFix?: string;
    cssFix?: string;
}

declare interface EmulationInstance {
    deviceType: string;
    deviceName?: string;
    open: boolean; // 是否打开
    id: string;
    index?: number;
    width?: number;
    height?: number;
    userAgent?: string;
}

declare interface AppConfig {
    // 虚拟设备类型列表
    emulationTypeList: Array<EmulationType>;
    // 虚拟设备列表 =>  > emulationTypeList    添加一个虚拟类型自动创建一个虚拟设备
    emulationList: Array<EmulationInstance>;
}
