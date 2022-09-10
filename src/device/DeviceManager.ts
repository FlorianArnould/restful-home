const rfx = require('rfxcom');

export class DeviceManager {
    private static instance: DeviceManager;
    private rfxtrx: any;
    private constructor() {
        this.rfxtrx = new rfx.RfxCom("/dev/ttyUSB0", {debug: true});
    }
    static getInstance() {
        if (!DeviceManager.instance) {
            DeviceManager.instance = new DeviceManager();
        }
        return DeviceManager.instance;
    }

    initialize(callback: () => void)  {
        this.rfxtrx.initialise(callback);
    }

    switchOn(id: string) {
        new rfx.Lighting2(this.rfxtrx, rfx.lighting2.HOMEEASY_EU).switchOn(id);
    }

    switchOff(id: string) {
        new rfx.Lighting2(this.rfxtrx, rfx.lighting2.HOMEEASY_EU).switchOff(id);
    }
}
