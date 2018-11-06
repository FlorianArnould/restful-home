import {Response as ExpressResponse}  from "express";

export class Response<T>{

    private response: ExpressResponse;

    constructor(response: ExpressResponse) {
        this.response = response;
    }

    status(code: number): Response<T> {
        this.response.status(code);
        return this;
    }

    send(message: T) {
        this.response.send(message);
    }

    end() {
        this.response.end();
    }
}