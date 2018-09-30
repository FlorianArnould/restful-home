const jwt = require('jsonwebtoken');
const config = require('../../config');
const Database = require('../database/Database');
const crypto = require('crypto');

function generateToken() {
    let value = crypto.randomBytes(20).toString('hex');
    let token = jwt.sign({ value: value }, config.secret, { expiresIn: 86400 });
    return { value: value, token: token };
}

function verifyToken(req, res, next) {
    let token = req.body.token;
    if (!token) return res.status(403).send({ auth: false, message: 'No token provided.' });
    jwt.verify(token, config.secret, function(err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        let user;
        if(decoded) {
            let db = new Database();
            user = db.getUserByToken(decoded.value);
            db.close();
        }
        if(!user) return res.status(401).send({ auth: false, message: 'Not valid token' });
        next(user);
  });
}

module.exports.generateToken = generateToken;
module.exports.verifyToken = verifyToken;