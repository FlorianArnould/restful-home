const assert = require('assert');
const DatabaseUtils = require('../utils/DatabaseUtils');
const Database = require('../../src/database/Database');
const TokenUtils = require('../../src/auth/TokenUtils');

describe('TokenUtils', function () {
    it('generateToken', function () {
        let tokenValues = TokenUtils.generateToken();
        assert.notEqual(tokenValues.value, null);
        assert.notEqual(tokenValues.token, null);
    });

    it('verifyToken', function () {
        let user = { login: 'test', password: 'password' };
        let id = DatabaseUtils.createUser(user);
        let tokenValues = TokenUtils.generateToken();
        let db = new Database();
        db.setToken(id, tokenValues.value);
        db.close();
        let req = { headers: { 'x-access-token': tokenValues.token } };
        TokenUtils.verifyToken(req, null, function (user) {
            DatabaseUtils.removeUser(id);
            assert.notEqual(user, null);
            assert.equal(user.id, id);
        });
    })
});