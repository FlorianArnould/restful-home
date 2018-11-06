import {Router} from "../router";
import * as bodyParser from "body-parser";

import {verifySessionToken} from "../auth";
import {createStream, deleteStream, readString} from "./StreamManager";
import {ErrorResponse, Identifiable, StreamData} from "../model";

export const router = new Router();

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.get<Identifiable | ErrorResponse>('/create', (req, res) => {
    verifySessionToken(req, res, () => {
        createStream((code, response) => res.status(code).send(response));
    });
});

router.get<StreamData | ErrorResponse>('/:id', (req, res) => {
    verifySessionToken(req, res,  () => {
        readString(req.params.id, (code, response) => res.status(code).send(response));
    });
});

router.delete<ErrorResponse>('/:id', (req, res) => {
    verifySessionToken(req, res, () => {
        deleteStream(req.params.id, (code, response) => {
            if(response) res.status(code).send(response);
            else res.status(code).end();
        });
    });
});