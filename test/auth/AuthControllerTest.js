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
        it('Wrong login', (done) => {
            try {
                request(app)
                    .post('/api/auth/login')
                    .send({ login: 'wrongLogin', password: 'something' })
                    .expect(404)
                    .then(res => {
                        assert.ok(!res.body.auth);
                        assert.equal(res.body.token, null);
                        assert.notEqual(res.body.message, null);
                        done();
                    })
                    .catch(err => {
                        done(err);
                    });
            } catch (e) {
                done(e);
            }
        });

        it('Wrong password', (done) => {
            try {
                request(app)
                    .post('/api/auth/login')
                    .send({ login: 'test', password: 'somethingWrong' })
                    .expect(401)
                    .then(res => {
                        assert.ok(!res.body.auth);
                        assert.equal(res.body.token, null);
                        assert.notEqual(res.body.message, null);
                        done();
                    })
                    .catch(err => {
                        done(err);
                    });
            } catch (e) {
                done(e);
            }
        });

        it('Correct credentials', (done) => {
            try {
                request(app)
                    .post('/api/auth/login')
                    .send({ login: 'test', password: 'password' })
                    .expect(200)
                    .then(res => {
                        assert.ok(res.body.auth);
                        assert.notEqual(res.body.token, null);
                        assert.equal(res.body.message, null);
                        done();
                    })
                    .catch(err => {
                        done(err);
                    });
            } catch (e) {
                done(e);
            }
        });
    });

    describe('GET /api/auth/isAuthenticated', function () {
        it('No token', (done) => {
            try {
                request(app)
                    .get('/api/auth/isAuthenticated')
                    .expect(403)
                    .then(res => {
                        assert.ok(!res.body.auth);
                        assert.notEqual(res.body.message, null);
                        done();
                    })
                    .catch(err => {
                        done(err);
                    });
            } catch (e) {
                done(e);
            }
        });

        it('Wrong token', (done) => {
            try{
                let oldToken = DatabaseUtils.generateAndSaveToken(user.id);
                DatabaseUtils.generateAndSaveToken(user.id);
                request(app)
                    .get('/api/auth/isAuthenticated')
                    .expect(401)
                    .set('x-access-token', oldToken)
                    .then(res => {
                        assert.ok(!res.body.auth);
                        assert.notEqual(res.body.message, null);
                        done();
                    })
                    .catch(err => {
                        done(err);
                    });
            } catch (e) {
                done(e);
            }
        });

        it('Correct token', (done) => {
            try {
                let token = DatabaseUtils.generateAndSaveToken(user.id);
                request(app)
                    .get('/api/auth/isAuthenticated')
                    .set('x-access-token', token)
                    .expect(200)
                    .then(res => {
                        assert.ok(res.body.auth);
                        assert.equal(res.body.message, null);
                        done();
                    })
                    .catch(err => {
                        done(err);
                    });
            } catch (e) {
                done(e);
            }
        });
    });

    describe("GET /api/auth/logout", function () {
        it('No token', (done) => {
            try {
                request(app)
                    .get('/api/auth/logout')
                    .expect(403)
                    .then(res => {
                        assert.ok(!res.body.auth);
                        assert.notEqual(res.body.message, null);
                        done();
                    })
                    .catch(err => {
                        done(err);
                    });
            } catch (e) {
                done(e);
            }
        });

        it('Wrong token', (done) => {
            try {
                let oldToken = DatabaseUtils.generateAndSaveToken(user.id);
                DatabaseUtils.generateAndSaveToken(user.id);
                request(app)
                    .get('/api/auth/logout')
                    .set('x-access-token', oldToken)
                    .expect(401)
                    .then(res => {
                        assert.ok(!res.body.auth);
                        assert.notEqual(res.body.message, null);
                        done();
                    })
                    .catch(err => {
                        done(err);
                    });
            } catch (e) {
                done(e);
            }
        });

        it('Correct token', (done) => {
            try {
                let token = DatabaseUtils.generateAndSaveToken(user.id);
                request(app)
                    .get('/api/auth/logout')
                    .set('x-access-token', token)
                    .expect(200)
                    .then(res => {
                        assert.ok(!res.body.auth);
                        assert.equal(res.body.token, null);
                        done();
                    })
                    .catch(err => {
                        done(err);
                    });
            } catch (e) {
                done(e);
            }

        });
    });
});