import {createUser, removeUser} from "../utils/DatabaseUtils";

describe('StreamController', function() {
    let user = {id: 0, username: 'test', password: 'password', refresh_token: '', token: '' };

    before(function () {
        user.id = createUser(user);
    });

    after(function () {
        removeUser(user.id);
    });

    describe('GET start', function () {

    });
});