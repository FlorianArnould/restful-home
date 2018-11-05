import {createStream, deleteStream, readString} from "../../src/stream/StreamManager";
import {exists, writeFile} from "fs";
import {deepStrictEqual, ok} from "assert";
import {Database} from "../../src/database/Database";
import {Identifiable, StreamData} from "../../src/model";

describe('StreamManager', function() {
    describe('createStream', function () {
        it('should create a file',  done => {
            createStream((code, response) => {
                deepStrictEqual(code, 200);
                ok(response.hasOwnProperty('id'));
                exists("streams/" + (response as Identifiable).id, exists => {
                    ok(exists);
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
            writeFile('streams/' + id, data, err => {
                ok(!err);
                readString(id, (code, response) => {
                    deepStrictEqual(code, 200);
                    deepStrictEqual((response as StreamData).data, data);
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
            writeFile('streams/' + id, data, err => {
                ok(!err);
                deleteStream(id, code => {
                    deepStrictEqual(code, 200);
                    exists('streams/' + id, exists => {
                        ok(!exists);
                        done();
                    });
                });
            });
        });
    });
});