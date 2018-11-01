const request = require('supertest');
const assert = require('assert');
const DatabaseUtils = require('../utils/DatabaseUtils');
const app = require('../../src/app');

describe('StreamController', function() {
    let user = { username: 'test', password: 'password' };

    before(function () {
        user.id = DatabaseUtils.createUser(user);
    });

    after(function () {
        DatabaseUtils.removeUser(user.id);
    });

    describe('GET start', function () {

    });
});