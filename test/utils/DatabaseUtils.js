const sq = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../../config');
const Database = require('../../src/database/Database');
const TokenUtils = require('../../src/auth/TokenUtils');

function createUser(user) {
    let db = new sq('database.db3');
    let hashedPassword = bcrypt.hashSync(user.password, 8);
    let info = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)').run(user.username, hashedPassword);
    db.close();
    return info.lastInsertROWID;
}

function removeUser(id) {
    let db = new sq('database.db3');
    db.prepare('DELETE FROM users WHERE id = ?').run(id);
    db.close();
}

function generateAndSaveSessionToken(id) {
    let token = TokenUtils.generateSessionToken();
    let db = new Database();
    db.setSessionToken(id, token);
    db.close();
    return token;
}

function generateAndSaveRefreshToken(id) {
    let token = TokenUtils.generateRefreshToken();
    let db = new Database();
    db.setRefreshToken(id, token);
    db.close();
    return token;
}

function generateAndSaveShortTermRefreshToken(id) {
    let token = jwt.sign({value: 'value'}, config.secret, {expiresIn: 3888000 });
    let db = new Database();
    db.setRefreshToken(id, token);
    db.close();
    return token;
}

module.exports.createUser = createUser;
module.exports.removeUser = removeUser;
module.exports.generateAndSaveSessionToken = generateAndSaveSessionToken;
module.exports.generateAndSaveRefreshToken = generateAndSaveRefreshToken;
module.exports.generateAndSaveShortTermRefreshToken = generateAndSaveShortTermRefreshToken;