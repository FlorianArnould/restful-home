import mkdirp from "mkdirp";
import {randomBytes} from "crypto";
import {spawn} from "child_process";
import {Database} from "../database/Database";
import {ErrorResponse, Identifiable, StreamData} from "../model";
import {access, constants, readFile, unlink} from "fs";

export function createStream(callback: (code: number, response: Identifiable | ErrorResponse) => void) {
    checkStreamFolder((code, response) => {
        if (response) callback(code, response);
        let id = randomBytes(20).toString('hex');
        const process = spawn('sh', ['-c', 'ls -l > streams/' + id]);
        const db = new Database();
        db.createStream(id);
        db.close();
        process.on('exit', () => {
            const db = new Database();
            db.finishStream(id);
            db.close();
        });
        callback(200, {id: id});
    });
}

export function readString(id: string, callback: (code: number, response: StreamData | ErrorResponse) => void) {
    checkStreamFolder((code, response) => {
        if (response) callback(code, response);
        checkStreamFile(id, (code, response) =>  {
            if (response) callback(code, response);
            readFile('streams/' + id, 'utf8', (err, data) => {
                if (err) return callback(500, {error: 'Cannot read the stream file'});
                const db = new Database();
                const info = db.getStreamInfo(id);
                db.setStreamOffset(id, data.length);
                db.close();
                callback(200, {data: data.substring(info.offset), isFinished: info.isFinished});
            })
        });
    });
}

export function deleteStream(id: string, callback: (code: number, response: ErrorResponse | undefined) => void) {
    checkStreamFolder((code, response) => {
        if (response) callback(code, response);
        checkStreamFile(id, (code, response) => {
            if (response) callback(code, response);
            const db = new Database();
            db.deleteStream(id);
            db.close();
            unlink('streams/' + id, err => {
                if (err) return callback(500, {error: "Cannot remove the stream file"});
                callback(200, undefined);
            });
        });
    });
}

function checkStreamFolder(callback: (code: number, response: ErrorResponse | undefined) => void) {
    mkdirp('streams', err => {
        if (err) {
            console.error(err);
            return callback(500, {error: "Cannot access the streams folder"});
        }
        callback(0, undefined);
    });
}

function checkStreamFile(id: string, callback: (code: number, response: ErrorResponse | undefined) => void) {
    access('streams/' + id, constants.F_OK,err => {
        if (err) return callback(204, {error: "Cannot find the stream"});
        callback(0, undefined);
    });
}
