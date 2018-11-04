const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const TokenUtils = require('../auth/TokenUtils');
const StreamManager = require('./StreamManager');


router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.get('/create', function (req, res) {
    TokenUtils.verifySessionToken(req, res, function () {
        StreamManager.createStream(message => res.status(message.code).send(message.content));
    });
});

router.get('/:id', function (req, res) {
    TokenUtils.verifySessionToken(req, res, function () {
        StreamManager.readString(req.params.id, message => res.status(message.code).send(message.content));
    });
});

router.delete('/:id', function (req, res) {
    TokenUtils.verifySessionToken(req, res, function () {
        StreamManager.deleteStream(req.params.id, message => res.status(message.code).send(message.content));
    });
});

module.exports = router;