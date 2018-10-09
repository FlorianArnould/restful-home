const request = require('supertest');
const assert = require('assert');
const DatabaseUtils = require('../utils/DatabaseUtils');
const app = require('../../src/app');

describe('AuthController', function () {

    let user = { username: 'test', password: 'password' };

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
                    .send({ username: 'wrongLogin', password: 'something' })
                    .expect(401)
                    .then(res => {
                        assert.ok(!res.body.auth);
                        assert.strictEqual(res.body.refreshToken, undefined);
                        assert.strictEqual(res.body.sessionToken, undefined);
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
                    .send({ username: 'test', password: 'somethingWrong' })
                    .expect(401)
                    .then(res => {
                        assert.ok(!res.body.auth);
                        assert.strictEqual(res.body.refreshToken, undefined);
                        assert.strictEqual(res.body.sessionToken, undefined);
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
                    .send({ username: 'test', password: 'password' })
                    .expect(200)
                    .then(res => {
                        assert.ok(res.body.auth);
                        assert.notStrictEqual(res.body.refreshToken, undefined);
                        assert.notStrictEqual(res.body.sessionToken, undefined);
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

    describe('GET /api/auth/refreshToken', function () {
        it('No token', (done) => {
            try {
                request(app)
                    .get('/api/auth/refreshToken')
                    .expect(403)
                    .then(res => {
                        assert.ok(!res.body.auth);
                        assert.strictEqual(res.body.refreshToken, undefined);
                        assert.strictEqual(res.body.sessionToken, undefined);
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
                let oldToken = DatabaseUtils.generateAndSaveRefreshToken(user.id);
                DatabaseUtils.generateAndSaveRefreshToken(user.id);
                request(app)
                    .get('/api/auth/refreshToken')
                    .expect(401)
                    .set('x-access-token', oldToken)
                    .then(res => {
                        assert.ok(!res.body.auth);
                        assert.strictEqual(res.body.refreshToken, undefined);
                        assert.strictEqual(res.body.sessionToken, undefined);
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
                let token = DatabaseUtils.generateAndSaveRefreshToken(user.id);
                request(app)
                    .get('/api/auth/refreshToken')
                    .set('x-access-token', token)
                    .expect(200)
                    .then(res => {
                        assert.ok(res.body.auth);
                        assert.strictEqual(res.body.refreshToken, undefined);
                        assert.notStrictEqual(res.body.sessionToken, undefined);
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

        it('Correct token which will expire soon', (done) => {
            try {
                let token = DatabaseUtils.generateAndSaveShortTermRefreshToken(user.id);
                request(app)
                    .get('/api/auth/refreshToken')
                    .set('x-access-token', token)
                    .expect(200)
                    .then(res => {
                        assert.ok(res.body.auth);
                        assert.notStrictEqual(res.body.refreshToken, undefined);
                        assert.notStrictEqual(res.body.sessionToken, undefined);
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
                let oldToken = DatabaseUtils.generateAndSaveSessionToken(user.id);
                DatabaseUtils.generateAndSaveSessionToken(user.id);
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
                let token = DatabaseUtils.generateAndSaveSessionToken(user.id);
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
                let oldToken = DatabaseUtils.generateAndSaveSessionToken(user.id);
                DatabaseUtils.generateAndSaveSessionToken(user.id);
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
                let token = DatabaseUtils.generateAndSaveSessionToken(user.id);
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