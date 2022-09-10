CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
	username TEXT NOT NULL,
	password TEXT NOT NULL,
	refresh_token TEXT,
	token TEXT);

CREATE TABLE IF NOT EXISTS device_type (
	id INTEGER PRIMARY KEY,
	name TEXT NOT NULL);

INSERT INTO device_type (id, name) SELECT 1, 'on_off' WHERE NOT EXISTS (SELECT 1 FROM device_type WHERE id = '1');

CREATE TABLE IF NOT EXISTS devices (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	name TEXT NOT NULL,
	description TEXT NOT NULL,
	type INTEGER NOT NULL REFERENCES device_type(id),
	rfxcomId TEXT NOT NULL);

CREATE TABLE IF NOT EXISTS streams (
    id TEXT PRIMARY KEY,
    offset INTEGER NOT NULL,
    isFinished BOOLEAN NOT NULL DEFAULT 'false');

CREATE TABLE IF NOT EXISTS weather (
    date INTEGER DEFAULT (strftime('%s','now')),
    temperature REAL NOT NULL,
    humidity REAL NOT NULL);