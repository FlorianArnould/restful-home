const request = require('supertest');
const assert = require('assert');
const DatabaseUtils = require('../utils/DatabaseUtils');
const app = require('../../src/app');

describe('DeviceController', function () {

    let user = { login: 'test', password: 'password' };

    before(function () {
        user.id = DatabaseUtils.createUser(user);
    });

    after(function () {
        DatabaseUtils.removeUser(user.id);
    });

    describe('GET /api/device/all', function () {
        it('No token', (done) => {
            try {
                request(app)
                    .get('/api/device/all')
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
                    .get('/api/device/all')
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
                    .get('/api/device/all')
                    .set('x-access-token', token)
                    .expect(200)
                    .then(res => {
                        assert.ok(res.body.success);
                        assert.notEqual(res.body.devices, null);
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