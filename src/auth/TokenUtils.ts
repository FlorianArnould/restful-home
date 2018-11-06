import {Request} from "express";
import {ErrorResponse, Expirable, User} from "../model";
import {sign, verify, VerifyErrors} from "jsonwebtoken";
import {Database} from "../database/Database";
import {randomBytes} from "crypto";
import {secret} from "../../config";
import {Response} from "../router";

export function generateSessionToken(): string {
    return generateToken(7200);
}

export function generateRefreshToken(): string {
    return generateToken(15552000);
}

function generateToken(expiresIn: number): string {
    const value = randomBytes(20).toString('hex');
    return sign({value: value}, secret, {expiresIn: expiresIn});
}

export function verifySessionToken(req: Request, res: Response<ErrorResponse>, next: (user: User) => void) {
    const token = req.get('x-access-token');
    if (!token) return res.status(403).send({error: 'No token provided.'});
    verify(token, secret, (err: VerifyErrors) => {
        if (err) return res.status(401).send({error: 'Failed to authenticate token.'});
        const db = new Database();
        const user = db.getUserByToken(token);
        db.close();
        if (!user) return res.status(401).send({error: 'Not valid token'});
        next(user);
    });
}

export function verifyRefreshToken(req: Request, res: Response<ErrorResponse>, next: (user: User, canRenewRefreshToken: boolean) => void) {
    const token = req.get('x-access-token');
    if (!token) return res.status(403).send({error: 'No token provided.'});
    verify(token, secret, (err: VerifyErrors, decoded: Expirable) => {
        if (err) return res.status(401).send({error: 'Failed to authenticate token.'});
        const db = new Database();
        const user = db.getUserByRefreshToken(token);
        db.close();
        if (!user) return res.status(401).send({error: 'Not valid token'});
        if (decoded.exp < (Date.now() / 1000) + 7776000) next(user, true);
        else next(user, false);
    });
}