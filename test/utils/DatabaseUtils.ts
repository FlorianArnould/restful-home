import * as SQLiteDatabase from 'better-sqlite3';
import {Device, User} from "../../src/model";
import {generateRefreshToken, generateSessionToken} from "../../src/auth";
import {sign} from "jsonwebtoken";
import {Database} from '../../src/database/Database';
import {hashSync} from "bcryptjs";

const config = require('../../src/config');

export function createUser(user: User): number {
    let db = new SQLiteDatabase('database.db');
    let hashedPassword = hashSync(user.password, 8);
    let info = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)').run(user.username, hashedPassword);
    db.close();
    return info.lastInsertROWID as number;
}

export function removeUser(id: number) {
    let db = new SQLiteDatabase('database.db');
    db.prepare('DELETE FROM users WHERE id = ?').run(id);
    db.close();
}

export function createDevice(device: Device): number {
    let db = new SQLiteDatabase('database.db');
    let info = db.prepare('INSERT INTO devices (name, description, type, file) VALUES (?, ?, ?, ?)').run(device.name, device.description, device.type, device.file);
    db.close();
    return info.lastInsertROWID as number;
}

export function removeDevice(id: number) {
    let db = new SQLiteDatabase('database.db');
    db.prepare('DELETE FROM devices WHERE id = ?').run(id);
    db.close();
}

export function generateAndSaveSessionToken(id: number): string{
    let token = generateSessionToken();
    let db = new Database();
    db.setSessionToken(id, token);
    db.close();
    return token;
}

export function generateAndSaveRefreshToken(id: number): string {
    let token = generateRefreshToken();
    let db = new Database();
    db.setRefreshToken(id, token);
    db.close();
    return token;
}

export function generateAndSaveShortTermRefreshToken(id: number): string {
    let token = sign({value: 'value'}, config.secret, {expiresIn: 3888000 });
    let db = new Database();
    db.setRefreshToken(id, token);
    db.close();
    return token;
}