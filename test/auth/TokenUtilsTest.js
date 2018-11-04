const assert = require('assert');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const config = require('../../config');
const DatabaseUtils = require('../utils/DatabaseUtils');
const Database = require('../../src/database/Database');
const TokenUtils = require('../../src/auth/TokenUtils');

describe('TokenUtils', function () {
    let user;
    before(function () {
        user = {username: 'test', password: 'password'};
        user.id = DatabaseUtils.createUser(user);
    });

    after(function () {
        DatabaseUtils.removeUser(user.id);
    });
    describe('generateSessionToken', function () {
        it('check token not null', function () {
            let token = TokenUtils.generateSessionToken();
            assert.notEqual(token, null);
        });
    });

    describe('generateRefreshToken', function () {
        it('check token not null', function () {
            let token = TokenUtils.generateRefreshToken();
            assert.notEqual(token, null);
        });
    });

    describe('verifySessionToken', function () {
        it('Correct token', (done) => {
            let token = TokenUtils.generateSessionToken();
            let db = new Database();
            db.setSessionToken(user.id, token);
            db.close();
            let req = {headers: {'x-access-token': token}};
            let res = new class {
                status(code) {
                    console.error(code);
                    return this;
                }

                send(message) {
                    console.error(message);
                    assert.ok(false);
                }
            };
            TokenUtils.verifySessionToken(req, res, function (foundUser) {
                assert.notEqual(foundUser, null);
                assert.equal(foundUser.id, user.id);
                done();
            });
        });

        it('Expired token', (done) => {
            let value = crypto.randomBytes(20).toString('hex');
            let token = jwt.sign({value: value}, config.secret, {expiresIn: 0});
            let db = new Database();
            db.setSessionToken(user.id, token);
            db.close();
            let req = {headers: {'x-access-token': token}};
            let res = new class {
                status(code) {
                    assert.equal(code, 401);
                    return this;
                }

                send(message) {
                    assert.notEqual(message, null);
                    done();
                }
            };
            TokenUtils.verifySessionToken(req, res, function () {
                assert.ok(false);
                done();
            });
        });
    });

    describe('verifyRefreshToken', function () {
        it('Correct token', (done) => {
            let token = TokenUtils.generateRefreshToken();
            let db = new Database();
            db.setRefreshToken(user.id, token);
            db.close();
            let req = {headers: {'x-access-token': token}};
            let res = new class {
                status(code) {
                    console.error(code);
                    return this;
                }

                send(message) {
                    console.error(message);
                    assert.ok(false);
                }
            };
            TokenUtils.verifyRefreshToken(req, res, function (foundUser, canRenewRefreshToken) {
                assert.ok(!canRenewRefreshToken);
                assert.notEqual(foundUser, null);
                assert.equal(foundUser.id, user.id);
                done();
            });
        });

        it('Expired token', (done) => {
            let value = crypto.randomBytes(20).toString('hex');
            let token = jwt.sign({value: value}, config.secret, {expiresIn: 0});
            let db = new Database();
            db.setRefreshToken(user.id, token);
            db.close();
            let req = {headers: {'x-access-token': token}};
            let res = new class {
                status(code) {
                    assert.equal(code, 401);
                    return this;
                }

                send(message) {
                    assert.notEqual(message, null);
                    done();
                }
            };
            TokenUtils.verifyRefreshToken(req, res, function () {
                assert.ok(false);
                done();
            });
        });

        it('token which expire soon', (done) => {
            let value = crypto.randomBytes(20).toString('hex');
            let token = jwt.sign({value: value}, config.secret, {expiresIn: 3888000});
            let db = new Database();
            db.setRefreshToken(user.id, token);
            db.close();
            let req = {headers: {'x-access-token': token}};
            let res = new class {
                status(code) {
                    console.error(code);
                    return this;
                }

                send(message) {
                    console.error(message);
                    assert.ok(false);
                }
            };
            TokenUtils.verifyRefreshToken(req, res, function (foundUser, canRenewRefreshToken) {
                assert.ok(canRenewRefreshToken);
                assert.notEqual(foundUser, null);
                assert.equal(foundUser.id, user.id);
                done();
            });
        });
    });
});