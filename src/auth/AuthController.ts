import{Router} from "../router";
import * as bodyParser from "body-parser";
import * as bcrypt from "bcryptjs"
import {Database} from "../database/Database";
import {ErrorResponse, Tokens} from "../model";
import {generateRefreshToken, generateSessionToken, verifyRefreshToken, verifySessionToken} from "./TokenUtils";

export const router = new Router();

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post<Tokens | ErrorResponse>('/login', function(req, res) {
    const db = new Database();
    try {
        let user = db.getUser(req.body.username);
        if(!user) return res.status(401).send({ error: 'Wrong username or password' });
        let passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if(!passwordIsValid) return res.status(401).send({ error: 'Wrong username or password' });
        let refreshToken = generateRefreshToken();
        let sessionToken = generateSessionToken();
        db.setRefreshToken(user.id, refreshToken);
        db.setSessionToken(user.id, sessionToken);
        res.status(200).send({ refreshToken: refreshToken, sessionToken: sessionToken });
    } finally {
        db.close();
    }
});

router.get<Tokens | ErrorResponse>('/refreshToken', function(req, res) {
    verifyRefreshToken(req, res, function (user, canRenewRefreshToken) {
        if (!user) return res.status(401).send({ error: 'This token was revoked' });
        let db = new Database();
        let sessionToken = generateSessionToken();
        db.setSessionToken(user.id, sessionToken);
        const message: Tokens = { sessionToken };
        if(canRenewRefreshToken) {
            let refreshToken = generateRefreshToken();
            db.setRefreshToken(user.id, refreshToken);
            message.refreshToken = refreshToken;
        }
        db.close();
        res.status(200).send(message);
    });
});

router.get<ErrorResponse>('/isAuthenticated', function (req, res) {
    verifySessionToken(req, res, function () {
        res.status(200).end();
    });
});

router.get<ErrorResponse>('/logout', function(req, res) {
    verifySessionToken(req, res, user => {
        let db = new Database();
        db.resetTokens(user.id);
        db.close();
        res.status(200).end();
    });
});