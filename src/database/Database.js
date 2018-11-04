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
        return this.db.prepare("SELECT id, name, description, type, file FROM devices").all();
    }

    getDeviceById(id) {
        return this.db.prepare("SELECT id, name, description, type, file FROM devices WHERE id = ?").get(id);
    }

    createStream(id) {
        this.db.prepare("INSERT INTO streams(id, offset) VALUES (?, 0)").run(id);
    }

    getStreamInfo(id) {
        return this.db.prepare("SELECT offset, isFinished FROM streams WHERE id = ?").get(id);
    }

    setStreamOffset(id, offset) {
        this.db.prepare("UPDATE streams SET offset = ? WHERE id = ?").run(offset, id);
    }

    deleteStream(id) {
        this.db.prepare("DELETE FROM streams WHERE id = ?").run(id);
    }

    finishStream(id) {
        this.db.prepare("UPDATE streams SET isFinished = 'true' WHERE id = ?").run(id);
    }

    close() {
        this.db.close();
    }
}

module.exports = Database;