import {createUser, removeUser} from "../utils/DatabaseUtils";
import {generateRefreshToken, generateSessionToken, verifyRefreshToken, verifySessionToken} from "../../src/auth";
import {notEqual, equal, ok, deepStrictEqual} from "assert";
import {Database} from "../../src/database/Database";
import {secret} from '../../src/config';
import {sign} from "jsonwebtoken";
import {randomBytes} from "crypto";
import {ErrorResponse, User} from "../../src/model";
import {Request} from "express";
import * as TypeMoq from "typemoq";
import {Response} from "../../src/router";

describe('TokenUtils', function () {
    let user = {id: 0, username: 'test', password: 'password', refresh_token: '', token: ''};
    let mockReq: TypeMoq.IMock<Request>;
    let res: Response<ErrorResponse>;
    before(function () {
        user.id = createUser(user);
        mockReq = TypeMoq.Mock.ofType<Request>();
        const mockRes = TypeMoq.Mock.ofType<Response<ErrorResponse>>();
        mockRes.setup(x => x.send(TypeMoq.It.is<ErrorResponse>(() => true))).returns((message: string) => {
            console.error(message);
            ok(false);
            return mockRes.target;
        });
        mockRes.setup(x => x.status(TypeMoq.It.isAnyNumber())).returns((code: number) => {
            console.error(code);
            return mockRes.target;
        });
        res = mockRes.object;
    });

    after(function () {
        removeUser(user.id);
    });

    beforeEach(function () {
        mockReq.reset();
    });

    describe('generateSessionToken', function () {
        it('check token not null', function () {
            let token = generateSessionToken();
            notEqual(token, null);
        });
    });

    describe('generateRefreshToken', function () {
        it('check token not null', function () {
            let token = generateRefreshToken();
            notEqual(token, null);
        });
    });

    describe('verifySessionToken', function () {
        it('Correct token', (done) => {
            let token = generateSessionToken();
            let db = new Database();
            db.setSessionToken(user.id, token);
            db.close();
            mockReq.setup(x => x.get(TypeMoq.It.isAnyString())).returns(() => token);
            verifySessionToken(mockReq.object, res, (foundUser: User) => {
                notEqual(foundUser, null);
                equal(foundUser.id, user.id);
                done();
            });
        });

        it('Expired token', (done) => {
            let value = randomBytes(20).toString('hex');
            let token = sign({value: value}, secret, {expiresIn: 0});
            let db = new Database();
            db.setSessionToken(user.id, token);
            db.close();
            mockReq.setup(x => x.get(TypeMoq.It.isAnyString())).returns(() => token);
            const mockRes = TypeMoq.Mock.ofType<Response<ErrorResponse>>();
            mockRes.setup(x => x.status(TypeMoq.It.isAnyNumber())).returns((code: number) => {
                deepStrictEqual(code, 401);
                return mockRes.target;
            });
            mockRes.setup(x => x.send(TypeMoq.It.is<ErrorResponse>(() => true))).returns((message: string) => {
                notEqual(message, null);
                done();
                return mockRes.target;
            });
            verifySessionToken(mockReq.object, mockRes.object, function () {
                ok(false);
                done();
            });
        });
    });

    describe('verifyRefreshToken', function () {
        it('Correct token', (done) => {
            let token = generateRefreshToken();
            let db = new Database();
            db.setRefreshToken(user.id, token);
            db.close();
            mockReq.setup(x => x.get(TypeMoq.It.isAnyString())).returns(() => token);
            verifyRefreshToken(mockReq.object, res, function (foundUser, canRenewRefreshToken) {
                ok(!canRenewRefreshToken);
                notEqual(foundUser, null);
                equal(foundUser.id, user.id);
                done();
            });
        });

        it('Expired token', (done) => {
            let value = randomBytes(20).toString('hex');
            let token = sign({value: value}, secret, {expiresIn: 0});
            let db = new Database();
            db.setRefreshToken(user.id, token);
            db.close();
            mockReq.setup(x => x.get(TypeMoq.It.isAnyString())).returns(() => token);
            const mockRes = TypeMoq.Mock.ofType<Response<ErrorResponse>>();
            mockRes.setup(x => x.send(TypeMoq.It.is<ErrorResponse>(() => true))).returns((message: string) => {
                notEqual(message, null);
                done();
                return mockRes.target;
            });
            mockRes.setup(x => x.status(TypeMoq.It.isAnyNumber())).returns((code: number) => {
                deepStrictEqual(code, 401);
                return mockRes.target;
            });
            verifyRefreshToken(mockReq.object, mockRes.object, function () {
                ok(false);
                done();
            });
        });

        it('token which expire soon', (done) => {
            let value = randomBytes(20).toString('hex');
            let token = sign({value: value}, secret, {expiresIn: 3888000});
            let db = new Database();
            db.setRefreshToken(user.id, token);
            db.close();
            mockReq.setup(x => x.get(TypeMoq.It.isAnyString())).returns(() => token);
            verifyRefreshToken(mockReq.object, res, function (foundUser, canRenewRefreshToken) {
                ok(canRenewRefreshToken);
                notEqual(foundUser, null);
                equal(foundUser.id, user.id);
                done();
            });
        });
    });
});