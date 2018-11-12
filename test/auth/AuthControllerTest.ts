import * as request from 'supertest';
import {
    createUser,
    generateAndSaveRefreshToken,
    generateAndSaveSessionToken,
    generateAndSaveShortTermRefreshToken,
    removeUser
} from "../utils/DatabaseUtils";
import {ok, notEqual, strictEqual, equal, notStrictEqual} from "assert";
import {app} from '../../src/app';

describe('AuthController', function () {

    let user = { id: 0, username: 'test', password: 'password', refresh_token: '', token: '' };

    before(function () {
        user.id = createUser(user);
    });

    after(function () {
        removeUser(user.id);
    });

    describe('POST /api/login', function () {
        it('Wrong login', (done) => {
            try {
                request(app)
                    .post('/api/login')
                    .send({ username: 'wrongLogin', password: 'something' })
                    .expect(401)
                    .then(res => {
                        strictEqual(res.body.refreshToken, undefined);
                        strictEqual(res.body.sessionToken, undefined);
                        ok(res.body.error);
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
                    .post('/api/login')
                    .send({ username: 'test', password: 'somethingWrong' })
                    .expect(401)
                    .then(res => {
                        strictEqual(res.body.refreshToken, undefined);
                        strictEqual(res.body.sessionToken, undefined);
                        ok(res.body.error);
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
                    .post('/api/login')
                    .send({ username: 'test', password: 'password' })
                    .expect(200)
                    .then(res => {
                        ok(res.body.refreshToken);
                        ok(res.body.sessionToken);
                        ok(!res.body.error);
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

    describe('GET /api/refreshToken', function () {
        it('No token', (done) => {
            try {
                request(app)
                    .get('/api/refreshToken')
                    .expect(403)
                    .then(res => {
                        strictEqual(res.body.refreshToken, undefined);
                        strictEqual(res.body.sessionToken, undefined);
                        notEqual(res.body.error, null);
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
                let oldToken = generateAndSaveRefreshToken(user.id);
                generateAndSaveRefreshToken(user.id);
                request(app)
                    .get('/api/refreshToken')
                    .expect(401)
                    .set('x-access-token', oldToken)
                    .then(res => {
                        strictEqual(res.body.refreshToken, undefined);
                        strictEqual(res.body.sessionToken, undefined);
                        notEqual(res.body.error, null);
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
                let token = generateAndSaveRefreshToken(user.id);
                request(app)
                    .get('/api/refreshToken')
                    .set('x-access-token', token)
                    .expect(200)
                    .then(res => {
                        strictEqual(res.body.refreshToken, undefined);
                        notStrictEqual(res.body.sessionToken, undefined);
                        equal(res.body.error, null);
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
                let token = generateAndSaveShortTermRefreshToken(user.id);
                request(app)
                    .get('/api/refreshToken')
                    .set('x-access-token', token)
                    .expect(200)
                    .then(res => {
                        notStrictEqual(res.body.refreshToken, undefined);
                        notStrictEqual(res.body.sessionToken, undefined);
                        equal(res.body.error, null);
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

    describe('GET /api/isAuthenticated', function () {
        it('No token', (done) => {
            try {
                request(app)
                    .get('/api/isAuthenticated')
                    .expect(403)
                    .then(res => {
                        notEqual(res.body.error, null);
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
                let oldToken = generateAndSaveSessionToken(user.id);
                generateAndSaveSessionToken(user.id);
                request(app)
                    .get('/api/isAuthenticated')
                    .expect(401)
                    .set('x-access-token', oldToken)
                    .then(res => {
                        notEqual(res.body.error, null);
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
                let token = generateAndSaveSessionToken(user.id);
                request(app)
                    .get('/api/isAuthenticated')
                    .set('x-access-token', token)
                    .expect(200)
                    .then(res => {
                        equal(res.body.error, null);
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

    describe("GET /api/logout", function () {
        it('No token', (done) => {
            try {
                request(app)
                    .get('/api/logout')
                    .expect(403)
                    .then(res => {
                        notEqual(res.body.error, null);
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
                let oldToken = generateAndSaveSessionToken(user.id);
                generateAndSaveSessionToken(user.id);
                request(app)
                    .get('/api/logout')
                    .set('x-access-token', oldToken)
                    .expect(401)
                    .then(res => {
                        notEqual(res.body.error, null);
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
                let token = generateAndSaveSessionToken(user.id);
                request(app)
                    .get('/api/logout')
                    .set('x-access-token', token)
                    .expect(200)
                    .then(res => {
                        equal(res.body.token, null);
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