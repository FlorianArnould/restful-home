import {Router} from "express";
import * as bodyParser from 'body-parser'

import {Database} from "../database/Database";
import {verifySessionToken} from "../auth";

export const router = Router();

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.get('/all', (req, res) => {
    verifySessionToken(req, res, () => {
        let db = new Database();
        let devices = db.getDevices();
        db.close();
        res.status(200).send(devices);
    })
});

router.put('/onoff/:id', (req, res) => {
    verifySessionToken(req, res, () => {
        let deviceId = req.params.id;
        let db = new Database();
        try {
            let device = db.getDeviceById(deviceId);
            if (!device) return res.status(404).send({ success: false, message: 'Device does not exist'});
        } finally {
            db.close();
        }
        let status = req.body.status;
        if (!status) return res.status(400).send({ success: false, message: 'No status provided' });
        if (status === 'on') {
            console.log('Set the device', deviceId, 'to status on');
            res.status(200).send({ success: true, deviceId: deviceId , status: 'on' });
        } else if (status === 'off') {
            console.log('Set the device', deviceId, 'to status off');
            res.status(200).send({ success: true, deviceId: deviceId , status: 'off' });
        } else {
            res.status(400).send({ success: false, message: "Invalid status: need to be 'on' or 'off'" });
        }
    })
});