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
        let user = db.getUser(req.body.login);
        if(!user) return res.status(404).send({ auth: false, token: null, message: 'No user found.' });
        let passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if(!passwordIsValid) return res.status(401).send({ auth: false, token: null, message: 'Wrong login or password' });
        let tokenValues = TokenUtils.generateToken();
        db.setToken(user.id, tokenValues.value);
        res.status(200).send({ auth: true, token: tokenValues.token });
    } finally {
        db.close();
    }
});

router.post('/isAuthenticated', function (req, res) {
    TokenUtils.verifyToken(req, res, function () {
        res.status(200).send({ auth: true });
    });
});

router.post('/logout', function(req, res) {
    TokenUtils.verifyToken(req, res, function (user) {
        let db = new Database();
        db.resetToken(user.id);
        db.close();
        res.status(200).send({ auth: false, token: null });
    });
});

module.exports = router;