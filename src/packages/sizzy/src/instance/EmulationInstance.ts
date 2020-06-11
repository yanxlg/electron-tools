import { uuid } from '@/utils/uuid';

class EmuInstance implements EmulationInstance {
    public deviceType: string;
    public deviceName?: string;
    public open: boolean;
    public id: string;
    public index?: number;
    constructor(
        deviceType: string,
        open: boolean,
        deviceName?: string,
        id?: string,
    ) {
        this.id = id || uuid();
        this.deviceType = deviceType;
        this.open = open;
        this.deviceName = deviceName;
    }
    public static fromJson(json: EmulationInstance) {
        return new EmuInstance(
            json.deviceType,
            json.open,
            json.deviceName,
            json.id,
        );
    }
    public toJson() {
        return {
            deviceType: this.deviceType,
            deviceName: this.deviceName,
            open: this.open,
            id: this.id,
        };
    }
}

export default EmuInstance;
