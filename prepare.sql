CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
	username TEXT NOT NULL,
	password TEXT NOT NULL,
	refresh_token TEXT,
	token TEXT);

CREATE TABLE IF NOT EXISTS device_type (
	id INTEGER PRIMARY KEY,
	name TEXT NOT NULL);

INSERT INTO device_type (id, name) VALUES (1, 'on_off');

CREATE TABLE IF NOT EXISTS devices (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	name TEXT NOT NULL,
	description TEXT NOT NULL,
	type INTEGER NOT NULL REFERENCES device_type(id),
	file TEXT NOT NULL);