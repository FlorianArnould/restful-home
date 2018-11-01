const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const TokenUtils = require('../auth/TokenUtils');
const StreamManager = require('./StreamManager');


router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

const sendMessage = (res, message) => res.status(message.code).send(message.content);

router.get('/start', function (req, res) {
    TokenUtils.verifySessionToken(req, res, function () {
        StreamManager.createStream(sendMessage);
    });
});

router.get('/:id', function (req, res) {
    TokenUtils.verifySessionToken(req, res, function () {
        StreamManager.readString(req.params.id, sendMessage);
    });
});

router.delete('/stop/:id', function (req, res) {
    TokenUtils.verifySessionToken(req, res, function () {
        StreamManager.deleteStream(req.params.id, sendMessage);
    });
});

module.exports = router;