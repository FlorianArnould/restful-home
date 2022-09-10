import {Router} from "../router";
import bodyParser from 'body-parser'

import {Database} from "../database/Database";
import {verifySessionToken} from "../auth";
import {Device, DeviceStatus, ErrorResponse} from "../model";
import {DeviceManager} from "./DeviceManager";

export const router = new Router();

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.get<Device[] | ErrorResponse>('/', (req, res) => {
    verifySessionToken(req, res, () => {
        let db = new Database();
        let devices = db.getDevices();
        db.close();
        res.status(200).send(devices);
    })
});

router.put<DeviceStatus | ErrorResponse>('/:id', (req, res) => {
    console.log("put device status called");
    verifySessionToken(req, res, () => {
        let deviceId = req.params.id;
        let db = new Database();
        try {
            let device = db.getDeviceById(parseInt(deviceId, 10));
            if (!device) return res.status(404).send({ error: 'Device does not exist'});
            let status = req.body.status;
            if (!status) return res.status(400).send({ error: 'No status provided' });
            if (status === 'on') {
                DeviceManager.getInstance().switchOn(device.rfxcomId);
                res.status(200).end();
            } else if (status === 'off') {
                DeviceManager.getInstance().switchOff(device.rfxcomId);
                res.status(200).end();
            } else {
                res.status(400).send({ error: "Invalid status: need to be 'on' or 'off'" });
            }
        } finally {
            db.close();
        }
    })
});
