import SQLiteDatabaseFactory, {Database as SQLiteDatabase} from 'better-sqlite3';
import {Device, StreamInfo, User} from "../model";
import {WeatherRecord} from "../model/WeatherRecord";

export class Database {
    private db: SQLiteDatabase;

    constructor() {
        this.db = new SQLiteDatabaseFactory('database.db');
    }

    getUser(username: string): User {
        return this.db.prepare("SELECT id, username, password, refresh_token, token FROM users WHERE username = ?").get(username);
    }

    getUserByToken(token: string): User {
        return this.db.prepare("SELECT id, username, password, refresh_token, token FROM users WHERE token = ?").get(token);
    }

    getUserByRefreshToken(refresh_token: string): User {
        return this.db.prepare("SELECT id, username, password, refresh_token, token FROM users WHERE refresh_token = ?").get(refresh_token);
    }

    setSessionToken(id: number, token: string) {
        this.db.prepare("UPDATE users SET token = ? WHERE id = ?").run(token, id);
    }

    setRefreshToken(id: number, refresh_token: string) {
        this.db.prepare("UPDATE users SET refresh_token = ? WHERE id = ?").run(refresh_token, id);
    }

    resetTokens(id: number) {
        this.db.prepare("UPDATE users SET token = null, refresh_token = null WHERE id = ?").run(id);
    }

    getDevices(): Device[] {
        return this.db.prepare("SELECT id, name, description, type, rfxcomId FROM devices").all();
    }

    getDeviceById(id: number): Device {
        return this.db.prepare("SELECT id, name, description, type, rfxcomId FROM devices WHERE id = ?").get(id);
    }

    createStream(id: string) {
        this.db.prepare("INSERT INTO streams(id, offset) VALUES (?, 0)").run(id);
    }

    getStreamInfo(id: string): StreamInfo {
        return this.db.prepare("SELECT offset, isFinished FROM streams WHERE id = ?").get(id);
    }

    setStreamOffset(id: string, offset: number) {
        this.db.prepare("UPDATE streams SET offset = ? WHERE id = ?").run(offset, id);
    }

    deleteStream(id: string) {
        this.db.prepare("DELETE FROM streams WHERE id = ?").run(id);
    }

    finishStream(id: string) {
        this.db.prepare("UPDATE streams SET isFinished = 'true' WHERE id = ?").run(id);
    }

    putWeatherRecord(temperature: number, humidity: number) {
        this.db.prepare("INSERT INTO weather (temperature, humidity) VALUES (?, ?)").run(temperature, humidity);
    }

    getLatestWeatherRecord(): WeatherRecord {
        return this.db.prepare("SELECT temperature, humidity, date FROM weather WHERE date = (SELECT MAX(date) FROM weather)").get();
    }

    close() {
        this.db.close();
    }
}
