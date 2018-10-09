const request = require('supertest');
const assert = require('assert');
const DatabaseUtils = require('../utils/DatabaseUtils');
const app = require('../../src/app');

describe('DeviceController', function () {

    let user = { username: 'test', password: 'password' };

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
                let oldToken = DatabaseUtils.generateAndSaveSessionToken(user.id);
                DatabaseUtils.generateAndSaveSessionToken(user.id);
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
                let token = DatabaseUtils.generateAndSaveSessionToken(user.id);
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

    describe('PUT /api/device/onoff/:id', function () {

        let device = {name: 'test', description: 'description', type: 1, file: 'file.js'};
        let token;

        before(function () {
            device.id = DatabaseUtils.createDevice(device);
            token = DatabaseUtils.generateAndSaveSessionToken(user.id);
        });

        after(function () {
            DatabaseUtils.removeDevice(device.id);
        });

        it('Device id does not exist' , (done) => {
            try {
                request(app)
                    .put('/api/device/onoff/idWhichDoesNotExist')
                    .set('x-access-token', token)
                    .send({ status: 'on' })
                    .expect(404)
                    .then(res => {
                        assert.ok(!res.body.success);
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

        it('No status provided', (done) => {
            try {
                request(app)
                    .put('/api/device/onoff/' + device.id)
                    .set('x-access-token', token)
                    .expect(400)
                    .then(res => {
                        assert.ok(!res.body.success);
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

        it('Invalid status provided', (done) => {
            try {
                request(app)
                    .put('/api/device/onoff/' + device.id)
                    .set('x-access-token', token)
                    .send({ status: 'invalidStatus' })
                    .expect(400)
                    .then(res => {
                        assert.ok(!res.body.success);
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

        it('Correct id and status', (done) => {
            try {
                request(app)
                    .put('/api/device/onoff/' + device.id)
                    .set('x-access-token', token)
                    .send({ status: 'on' })
                    .expect(200)
                    .then(res => {
                        assert.ok(res.body.success);
                        assert.notEqual(res.body.deviceId, null);
                        assert.notEqual(res.body.status, null);
                        done();
                    })
                    .catch(err => {
                        done(err);
                    });
            } catch (e) {
                done(e);
            }
        });
    })
});