import {Router} from "express";
import * as bodyParser from "body-parser";
import * as bcrypt from "bcryptjs"
import {Database} from "../database/Database";
import {RefreshTokenResponse} from "../model";
import {generateRefreshToken, generateSessionToken, verifyRefreshToken, verifySessionToken} from "./TokenUtils";

export const router = Router();

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post('/login', function(req, res) {
    const db = new Database();
    try {
        let user = db.getUser(req.body.username);
        if(!user) return res.status(401).send({ auth: false, message: 'Wrong username or password' });
        let passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if(!passwordIsValid) return res.status(401).send({ auth: false, message: 'Wrong username or password' });
        let refreshToken = generateRefreshToken();
        let sessionToken = generateSessionToken();
        db.setRefreshToken(user.id, refreshToken);
        db.setSessionToken(user.id, sessionToken);
        res.status(200).send({ auth: true, refreshToken: refreshToken, sessionToken: sessionToken });
    } finally {
        db.close();
    }
});

router.get('/refreshToken', function(req, res) {
    verifyRefreshToken(req, res, function (user, canRenewRefreshToken) {
        if (!user) return res.status(401).send({ auth: false, message: 'This token was revoked' });
        let message = new RefreshTokenResponse();
        message.auth = true;
        let db = new Database();
        if(canRenewRefreshToken) {
            let refreshToken = generateRefreshToken();
            db.setRefreshToken(user.id, refreshToken);
            message.refreshToken = refreshToken;
        }
        let sessionToken = generateSessionToken();
        db.setSessionToken(user.id, sessionToken);
        message.sessionToken = sessionToken;
        db.close();
        res.status(200).send(message);
    });
});

router.get('/isAuthenticated', function (req, res) {
    verifySessionToken(req, res, function () {
        res.status(200).send({ auth: true });
    });
});

router.get('/logout', function(req, res) {
    verifySessionToken(req, res, user => {
        let db = new Database();
        db.resetTokens(user.id);
        db.close();
        res.status(200).send({ auth: false });
    });
});