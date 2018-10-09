const sq = require('better-sqlite3');

class Database {
    constructor() {
        this.db = new sq('database.db3');
    }

    getUser(username) {
        return this.db.prepare("SELECT id, username, password, refresh_token, token FROM users WHERE username = ?").get(username);
    }

    getUserByToken(token) {
        return this.db.prepare("SELECT id, username, password, refresh_token, token FROM users WHERE token = ?").get(token);
    }

    getUserByRefreshToken(refresh_token) {
        return this.db.prepare("SELECT id, username, password, refresh_token, token FROM users WHERE refresh_token = ?").get(refresh_token);
    }

    setSessionToken(id, token) {
        this.db.prepare("UPDATE users SET token = ? WHERE id = ?").run(token, id);
    }

    setRefreshToken(id, refresh_token) {
        this.db.prepare("UPDATE users SET refresh_token = ? WHERE id = ?").run(refresh_token, id);
    }

    resetTokens(id) {
        this.db.prepare("UPDATE users SET token = null, refresh_token = null WHERE id = ?").run(id);
    }

    getDevices() {
        return this.db.prepare("SELECT id, name FROM devices").all();
    }

    close() {
        this.db.close();
    }
}

module.exports = Database;