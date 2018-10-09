const express = require('express');
const router = express.Router([]);
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
        res.status(200).send({ success: true, devices: devices });
    })
});

router.post('/:id', function (req, res) {
    res.send('user ' + req.params.id);
});

module.exports = router;