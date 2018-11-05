import * as request from 'supertest';
import {createDevice, createUser, generateAndSaveSessionToken, removeDevice, removeUser} from "../utils/DatabaseUtils";
import {ok, notEqual} from "assert";
import {app} from '../../src/app';

describe('DeviceController', function () {

    let user = { id: 0, username: 'test', password: 'password', refresh_token: '', token: '' };

    before(function () {
        user.id = createUser(user);
    });

    after(function () {
        removeUser(user.id);
    });

    describe('GET /api/device/all', function () {
        it('No token', (done) => {
            try {
                request(app)
                    .get('/api/device/all')
                    .expect(403)
                    .then(res => {
                        ok(!res.body.auth);
                        notEqual(res.body.message, null);
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
                    .get('/api/device/all')
                    .set('x-access-token', oldToken)
                    .expect(401)
                    .then(res => {
                        ok(!res.body.auth);
                        notEqual(res.body.message, null);
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
                    .get('/api/device/all')
                    .set('x-access-token', token)
                    .expect(200)
                    .then(res => {
                        notEqual(res.body, null);
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

        let device = {id: 0, name: 'test', description: 'description', type: 1, file: 'file.js'};
        let token: string;

        before(function () {
            device.id = createDevice(device);
            token = generateAndSaveSessionToken(user.id);
        });

        after(function () {
            removeDevice(device.id);
        });

        it('Device id does not exist' , (done) => {
            try {
                request(app)
                    .put('/api/device/onoff/idWhichDoesNotExist')
                    .set('x-access-token', token)
                    .send({ status: 'on' })
                    .expect(404)
                    .then(res => {
                        ok(!res.body.success);
                        notEqual(res.body.message, null);
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
                        ok(!res.body.success);
                        notEqual(res.body.message, null);
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
                        ok(!res.body.success);
                        notEqual(res.body.message, null);
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
                        ok(res.body.success);
                        notEqual(res.body.deviceId, null);
                        notEqual(res.body.status, null);
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