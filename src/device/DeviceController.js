const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const TokenUtils = require('../auth/TokenUtils');
const Database = require('../database/Database');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.get('/all', function (req, res) {
    TokenUtils.verifySessionToken(req, res, function () {
        let db = new Database();
        let devices = db.getDevices();
        db.close();
        res.status(200).send(devices);
    })
});

router.put('/onoff/:id', function (req, res) {
    TokenUtils.verifySessionToken(req, res, function () {
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

module.exports = router;