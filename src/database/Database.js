const sq = require('better-sqlite3');

class Database {
    constructor() {
        this.db = new sq('database.db3');
        let sql = 'CREATE TABLE IF NOT EXISTS users (\n' +
            '\tid INTEGER PRIMARY KEY AUTOINCREMENT,\n' +
            '\tlogin TEXT NOT NULL,\n' +
            '\tpassword TEXT NOT NULL,\n' +
            '\ttoken TEXT);';
        this.db.exec(sql);
    }

    getUser(login) {
        return this.db.prepare("SELECT id, login, password, token FROM users WHERE login = ?").get(login);
    }

    getUserByToken(token) {
        return this.db.prepare("SELECT id, login, password, token FROM users WHERE token = ?").get(token);
    }

    setToken(id, token) {
        this.db.prepare("UPDATE users SET token = ? WHERE id = ?").run(token, id);
    }

    resetToken(id) {
        this.db.prepare("UPDATE users SET token = null WHERE id = ?").run(id);
    }

    close() {
        this.db.close();
    }
}

module.exports = Database;