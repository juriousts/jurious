import { NetworkAdapter } from "./NetworkAdapter";
import { ResponseSender } from "./../http/ResponseSender";
import * as http from "http";
import { RequestHandler } from "../http/RequestHandler";
import { Request } from "../http/Request";
import { Response } from "../http/Response";
import { RouteInstance } from "@jurious/router";
import { MiddlewareHandler } from "../http/middlewares/MiddlewareHandler";
import { NetworkProtocol } from "./Constants";
import { Router } from "@jurious/router";
import to from '@jurious/await';

export class HttpAdapter extends NetworkAdapter {
    constructor(name: string, port: number) {
        super(name, port);
        this.protocol = NetworkProtocol.HTTP;
    }

    listen() {
        this.server = http
            .createServer(async (req, res) => {
                let route: RouteInstance;
                let uri = req.url as string;
                let method = req.method as string;

                let result;

                try {
                    result = Router.match(method, uri);
                } catch (err) {
                    res.write("No such route\n");
                    res.write(req.method + " " + req.url);
                    res.end();
                    return;
                }

                route = result as RouteInstance;

                let request = new Request(req, route);
                let response = new Response();

                let middlewareHandler = new MiddlewareHandler(request, response);

                const [middlewareError, middlewareResult] =  await to(middlewareHandler.handle());
                if (!middlewareResult) {
                    res.write("didnt pass middleware");
                    res.end();
                    return;
                }

                let requestHandler = new RequestHandler(request, response);

                const [requestError, requestResult] = await to(requestHandler.handle());
                if (requestResult) {
                    (new ResponseSender(requestResult as Response, res)).send();
                } else {
                    res.write("rejected");
                    res.end();
                }
            })
            .listen(this.port, () => {});
    }
    close() {
        throw new Error("Method not implemented.");
    }
}
