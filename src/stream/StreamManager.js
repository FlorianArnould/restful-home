const mkdirp = require('mkdirp');
const fs = require('fs');
const crypto = require('crypto');
const spawn = require('child_process').spawn;
const Database = require('../database/Database');

function createStream(callback) {
    checkStreamFolder(message => {
        if (message) callback(message);
        let id = crypto.randomBytes(20).toString('hex');
        const process = spawn('sh', ['-c', 'ls -l > streams/' + id]);
        const db = new Database();
        db.createStream(id);
        db.close();
        process.on('exit', () => {
            const db = new Database();
            db.finishStream(id);
            db.close();
        });
        callback({code: 200, content: {id: id}});
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
                    content: {error: 'Cannot read the stream file'}
                });
                const db = new Database();
                const info = db.getStreamInfo(id);
                db.setStreamOffset(id, data.length);
                db.close();
                console.log("isFinished : " + info.isFinished);
                callback({code: 200, content: {data: data.substring(info.offset), isFinished: info.isFinished}});
            })
        });
    });
}

function deleteStream(id, callback) {
    checkStreamFolder(message => {
        if (message) return callback(message);
        checkStreamFile(id, message => {
            if (message) return callback(message);
            const db = new Database();
            db.deleteStream(id);
            db.close();
            fs.unlink('streams/' + id, err => {
                if (err) return callback({
                    code: 500,
                    content: {error: "Cannot remove the stream file"}
                });
                callback({code: 200, content: {}});
            });
        });
    });
}

function checkStreamFolder(callback) {
    mkdirp('streams', function (err) {
        if (err) {
            console.log(err);
            return callback({code: 500, content: {error: "Cannot access the streams folder"}});
        }
        callback();
    });
}

function checkStreamFile(id, callback) {
    fs.exists('streams/' + id, function (exists) {
        if (!exists) return callback({code: 204, content: {error: "Cannot find the stream"}});
        callback();
    });
}

module.exports = {
    createStream,
    readString,
    deleteStream
};