import {Router} from "express";
import * as bodyParser from "body-parser";

import {verifySessionToken} from "../auth";
import {createStream, deleteStream, readString} from "./StreamManager";

export const router = Router();

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.get('/create', (req, res) => {
    verifySessionToken(req, res, () => {
        createStream((code, response) => res.status(code).send(response));
    });
});

router.get('/:id', (req, res) => {
    verifySessionToken(req, res,  () => {
        readString(req.params.id, (code, response) => res.status(code).send(response));
    });
});

router.delete('/:id', (req, res) => {
    verifySessionToken(req, res, () => {
        deleteStream(req.params.id, (code, response) => res.status(code).send(response));
    });
});