const express = require('express');
const router = express.Router([]);
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

const TokenUtils = require('./TokenUtils');
const Database = require('../database/Database');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post('/login', function(req, res) {
    let db = new Database();
    try {
        let user = db.getUser(req.body.username);
        if(!user) return res.status(401).send({ auth: false, message: 'Wrong username or password' });
        let passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if(!passwordIsValid) return res.status(401).send({ auth: false, message: 'Wrong username or password' });
        let refreshToken = TokenUtils.generateRefreshToken();
        let sessionToken = TokenUtils.generateSessionToken();
        db.setRefreshToken(user.id, refreshToken);
        db.setSessionToken(user.id, sessionToken);
        res.status(200).send({ auth: true, refreshToken: refreshToken, sessionToken: sessionToken });
    } finally {
        db.close();
    }
});

router.get('/refreshToken', function(req, res) {
    TokenUtils.verifyRefreshToken(req, res, function (user, canRenewRefreshToken) {
        if (!user) return res.status(401).send({ auth: false, token: null, message: 'This token was revoked' });
        let message = { auth: true };
        let db = new Database();
        if(canRenewRefreshToken) {
            let refreshToken = TokenUtils.generateRefreshToken();
            db.setRefreshToken(user.id, refreshToken);
            message.refreshToken = refreshToken;
        }
        let sessionToken = TokenUtils.generateSessionToken();
        db.setSessionToken(user.id, sessionToken);
        message.sessionToken = sessionToken;
        db.close();
        res.status(200).send(message);
    });
});

router.get('/isAuthenticated', function (req, res) {
    TokenUtils.verifySessionToken(req, res, function () {
        res.status(200).send({ auth: true });
    });
});

router.get('/logout', function(req, res) {
    TokenUtils.verifySessionToken(req, res, function (user) {
        let db = new Database();
        db.resetTokens(user.id);
        db.close();
        res.status(200).send({ auth: false });
    });
});

module.exports = router;