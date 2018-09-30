const sq = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const Database = require('../../src/database/Database');
const TokenUtils = require('../../src/auth/TokenUtils');

function createUser(user) {
    let db = new sq('database.db3');
    let hashedPassword = bcrypt.hashSync(user.password, 8);
    let info = db.prepare('INSERT INTO users (login, password) VALUES (?, ?)').run(user.login, hashedPassword);
    db.close();
    return info.lastInsertROWID;
}

function removeUser(id) {
    let db = new sq('database.db3');
    db.prepare('DELETE FROM users WHERE id = ?').run(id);
    db.close();
}

function generateAndSaveToken(id) {
    let tokenValues = TokenUtils.generateToken();
    let db = new Database();
    db.setToken(id, tokenValues.value);
    db.close();
    return tokenValues.token;
}

module.exports.createUser = createUser;
module.exports.removeUser = removeUser;
module.exports.generateAndSaveToken = generateAndSaveToken;