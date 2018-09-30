const request = require('supertest');
const assert = require('assert');
const DatabaseUtils = require('../utils/DatabaseUtils');
const app = require('../../src/app');

describe('AuthController', function () {

    let user = { login: 'test', password: 'password' };

    before(function () {
        user.id = DatabaseUtils.createUser(user);
    });

    after(function () {
        DatabaseUtils.removeUser(user.id);
    });

    describe('POST /api/auth/login', function () {
        it('Wrong login', function () {
            request(app)
                .post('/api/auth/login')
                .send({ login: 'wrongLogin', password: 'something' })
                .expect(404)
                .then(res => {
                    assert.ok(!res.body.auth);
                    assert.equal(res.body.token, null);
                    assert.notEqual(res.body.message, null);
                });
        });

        it('Wrong password', function () {
            request(app)
                .post('/api/auth/login')
                .send({ login: 'test', password: 'somethingWrong' })
                .expect(401)
                .then(res => {
                    assert.ok(!res.body.auth);
                    assert.equal(res.body.token, null);
                    assert.notEqual(res.body.message, null);
                });
        });

        it('Correct credentials', function () {
            request(app)
                .post('/api/auth/login')
                .send({ login: 'test', password: 'password' })
                .expect(200)
                .then(res => {
                    assert.ok(res.body.auth);
                    assert.notEqual(res.body.token, null);
                    assert.equal(res.body.message, null);
                });
        });
    });

    describe('POST /api/auth/isAuthenticated', function () {
        it('No token', function () {
            request(app)
                .post('/api/auth/isAuthenticated')
                .send({})
                .expect(403)
                .then(res => {
                    assert.ok(!res.body.auth);
                    assert.notEqual(res.body.message, null);
                });
        });

        it('Wrong token', function () {
            let oldToken = DatabaseUtils.generateAndSaveToken(user.id);
            DatabaseUtils.generateAndSaveToken(user.id);
            request(app)
                .post('/api/auth/isAuthenticated')
                .send({ token: oldToken })
                .expect(401)
                .then(res => {
                    assert.ok(!res.body.auth);
                    assert.notEqual(res.body.message, null);
                });
        });

        it('Correct token', function () {
            let token = DatabaseUtils.generateAndSaveToken(user.id);
            request(app)
                .post('/api/auth/isAuthenticated')
                .send({ token: token })
                .expect(200)
                .then(res => {
                    assert.ok(res.body.auth);
                    assert.equal(res.body.message, null);
                });
        });
    });

    describe("POST /api/auth/logout", function () {
        it('No token', function () {
            request(app)
                .post('/api/auth/logout')
                .send({})
                .expect(403)
                .then(res => {
                    assert.ok(!res.body.auth);
                    assert.notEqual(res.body.message, null);
                });
        });

        it('Wrong token', function () {
            let oldToken = DatabaseUtils.generateAndSaveToken(user.id);
            DatabaseUtils.generateAndSaveToken(user.id);
            request(app)
                .post('/api/auth/logout')
                .send({ token: oldToken })
                .expect(401)
                .then(res => {
                    assert.ok(!res.body.auth);
                    assert.notEqual(res.body.message, null);
                });
        });

        it('Correct token', function () {
            let token = DatabaseUtils.generateAndSaveToken(user.id);
            request(app)
                .post('/api/auth/logout')
                .send({ token: token })
                .expect(200)
                .then(res => {
                    assert.ok(!res.body.auth);
                    assert.equal(res.body.token, null);
                });
        });
    });
});