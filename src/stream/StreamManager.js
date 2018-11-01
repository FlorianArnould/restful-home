const mkdirp = require('mkdirp');
const fs = require('fs');
const crypto = require('crypto');
const exec = require('child_process').exec;

function createStream(callback) {
    checkStreamFolder(message => {
        if (message) callback(message);
        let id = crypto.randomBytes(20).toString('hex');
        exec('ls -l > streams/' + id);
        callback({code: 200, content: {success: true, streamId: id}});
    });
}

function readString(id, callback) {
    checkStreamFolder(message => {
        if (message) return callback(message);
        checkStreamFile(id, message => {
            if (message) return callback(message);
            fs.readFile('streams/' + id, 'utf8', (err, data) => {
                if (err) return callback({
                    code: 500,
                    content: {success: false, message: 'Cannot read the stream file'}
                });
                callback({code: 200, content: {success: true, data: data}});
            })
        });
    });
}

function deleteStream(id, callback) {
    checkStreamFolder(message => {
        if (message) return callback(message);
        checkStreamFile(id, message => {
            if (message) return callback(message);
            fs.unlink('streams/' + id, err => {
                if (err) return callback({
                    code: 500,
                    content: {success: false, message: "Cannot remove the stream file"}
                });
                callback({code: 200, content: {success: true}});
            });
        });
    });
}

function checkStreamFolder(callback) {
    mkdirp('streams', function (err) {
        if (err) {
            console.log(err);
            return callback({code: 500, content: {success: false, message: "Cannot access the streams folder"}});
        }
        callback();
    });
}

function checkStreamFile(id, callback) {
    fs.exists('streams/' + id, function (exists) {
        if (!exists) return callback({code: 204, content: {success: false, message: "Cannot find the stream"}});
        callback();
    });
}

module.exports = {
    createStream,
    readString,
    deleteStream
};