import {Router as ExpressRouter, Request, RequestHandler} from "express";
import {Response} from "./Response";

export class Router {
    private router: ExpressRouter = ExpressRouter();

    use(handler: RequestHandler) {
        this.router.use(handler);
    }

    get<T>(path: string, handler: (req: Request, res: Response<T>) => void) {
        this.router.get(path, ((req, res) => handler(req, new Response<T>(res))));
    }

    post<T>(path: string, handler: (req: Request, res: Response<T>) => void) {
        this.router.post(path, ((req, res) => handler(req, new Response<T>(res))));
    }

    put<T>(path: string, handler: (req: Request, res: Response<T>) => void) {
        this.router.put(path, ((req, res) => handler(req, new Response<T>(res))));
    }

    delete<T>(path: string, handler: (req: Request, res: Response<T>) => void) {
        this.router.delete(path, ((req, res) => handler(req, new Response<T>(res))));
    }

    getExpressRouter(): ExpressRouter {
        return this.router;
    }
}