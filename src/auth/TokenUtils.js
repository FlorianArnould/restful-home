const jwt = require('jsonwebtoken');
const config = require('../../config');
const Database = require('../database/Database');
const crypto = require('crypto');

function generateSessionToken() {
    return generateToken(7200);
}

function generateRefreshToken() {
    return generateToken(15552000);
}

function generateToken(expiresIn) {
    let value = crypto.randomBytes(20).toString('hex');
    return jwt.sign({value: value}, config.secret, {expiresIn: expiresIn});
}

function verifySessionToken(req, res, next) {
    let token = req.headers['x-access-token'];
    if (!token) return res.status(403).send({auth: false, message: 'No token provided.'});
    jwt.verify(token, config.secret, function (err) {
        if (err) return res.status(500).send({auth: false, message: 'Failed to authenticate token.'});
        let db = new Database();
        let user = db.getUserByToken(token);
        db.close();
        if (!user) return res.status(401).send({auth: false, message: 'Not valid token'});
        next(user);
    });
}

function verifyRefreshToken(req, res, next) {
    let token = req.headers['x-access-token'];
    if (!token) return res.status(403).send({auth: false, message: 'No token provided.'});
    jwt.verify(token, config.secret, function (err, decoded) {
        if (err) return res.status(500).send({auth: false, message: 'Failed to authenticate token.'});
        let user;
        let db = new Database();
        user = db.getUserByRefreshToken(token);
        db.close();
        if (!user) return res.status(401).send({auth: false, message: 'Not valid token'});
        if (decoded.exp < (Date.now() / 1000) + 7776000) {
            next(user, true)
        } else {
            next(user, false);
        }
    });
}

module.exports.generateSessionToken = generateSessionToken;
module.exports.generateRefreshToken = generateRefreshToken;
module.exports.verifySessionToken = verifySessionToken;
module.exports.verifyRefreshToken = verifyRefreshToken;