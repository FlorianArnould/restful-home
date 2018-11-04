const assert = require('assert');
const fs = require('fs');

const StreamManager = require('../../src/stream/StreamManager');
const Database = require('../../src/database/Database');

describe('StreamManager', function() {
    describe('createStream', function () {
        it('should create a file',  done => {
            StreamManager.createStream(message => {
                assert.deepStrictEqual(message.code, 200);
                fs.exists("streams/" + message.content.id, exists => {
                    assert.ok(exists);
                    done();
                });
            });
        });
    });

    describe('readStream', function () {
        it('should read the file', done => {
            const id = 'somethingThatIsAnId';
            const data = 'something';
            const db = new Database();
            db.createStream(id);
            fs.writeFile('streams/' + id, data, err => {
                assert.ok(!err);
                StreamManager.readString(id, message => {
                    assert.deepStrictEqual(message.code, 200);
                    assert.deepStrictEqual(message.content.data, data);
                    db.deleteStream(id);
                    db.close();
                    done();
                });
            });
        });
    });

    describe('deleteStream', function () {
        it('should delete the file', done => {
            const id = 'somethingThatIsAnId';
            const data = 'something';
            fs.writeFile('streams/' + id, data, err => {
                assert.ok(!err);
                StreamManager.deleteStream(id, message => {
                    assert.deepStrictEqual(message.code, 200);
                    fs.exists('streams/' + id, exists => {
                        assert.ok(!exists);
                        done();
                    });
                });
            });
        });
    });
});