import { uuid } from '../utils/uuid';

class EmuInstance implements EmulationInstance {
    public deviceType: string;
    public deviceName?: string;
    public open: boolean;
    public id: string;
    public index?: number;
    public width?: number;
    public height?: number;
    public userAgent?: string;
    constructor(
        deviceType: string,
        open: boolean,
        deviceName?: string,
        id?: string,
        width?: number,
        height?: number,
        userAgent?: string,
    ) {
        this.id = id || uuid();
        this.deviceType = deviceType;
        this.open = open;
        this.deviceName = deviceName;
        this.width = width;
        this.height = height;
        this.userAgent = userAgent;
    }
    public static fromJson(json: EmulationInstance) {
        return new EmuInstance(
            json.deviceType,
            json.open,
            json.deviceName,
            json.id,
            json.width,
            json.height,
            json.userAgent,
        );
    }
    public updateConfig(config: Partial<EmulationInstance>) {
        Object.assign(this, config);
    }
    public toJson() {
        return {
            deviceType: this.deviceType,
            deviceName: this.deviceName,
            open: this.open,
            id: this.id,
            width: this.width,
            height: this.height,
            userAgent: this.userAgent,
        };
    }
}

export default EmuInstance;
