import {Router} from "../router";
import * as bodyParser from 'body-parser'

import {Database} from "../database/Database";
import {verifySessionToken} from "../auth";
import {Device, DeviceStatus, ErrorResponse} from "../model";

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
    verifySessionToken(req, res, () => {
        let deviceId = req.params.id;
        let db = new Database();
        try {
            let device = db.getDeviceById(deviceId);
            if (!device) return res.status(404).send({ error: 'Device does not exist'});
        } finally {
            db.close();
        }
        let status = req.body.status;
        if (!status) return res.status(400).send({ error: 'No status provided' });
        if (status === 'on') {
            console.log('Set the device', deviceId, 'to status on');
            res.status(200).send({ id: deviceId , status: 'on' });
        } else if (status === 'off') {
            console.log('Set the device', deviceId, 'to status off');
            res.status(200).send({ id: deviceId , status: 'off' });
        } else {
            res.status(400).send({ error: "Invalid status: need to be 'on' or 'off'" });
        }
    })
});