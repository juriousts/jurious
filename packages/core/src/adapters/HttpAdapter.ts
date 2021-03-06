import { RequestBuilder } from "./../http/RequestBuilder";
import { NetworkAdapter } from "./NetworkAdapter";
import { ResponseSender } from "./../http/ResponseSender";
import * as http from "http";
import { Request } from "../http/Request";
import { Response } from "../http/Response";
import { RouteInstance } from "@jurious/router";
import { MiddlewareHandler } from "../http/middlewares/MiddlewareHandler";
import { NetworkProtocol } from "./Constants";
import { Router } from "@jurious/router";
import to from "@jurious/await";

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

				// let middlewareHandler = new MiddlewareHandler(
				// 	request,
				// 	response
				// );

				// const [middlewareError, middlewareResult] = await to(
				// 	middlewareHandler.handle()
				// );
				// if (!middlewareResult) {
				// 	res.write("didnt pass middleware");
				// 	res.end();
				// 	return;
				// }

				let requestBuilder = new RequestBuilder(request, response);
				const runner: (
					request: Request,
					response: Response
				) => Promise<Response> = requestBuilder.build();

				const [err, data] = await to(runner(request, response));

				const finalRes = err || data;

				new ResponseSender(finalRes as Response, res).send();
			})
			.listen(this.port, () => {});
	}
	close() {
		throw new Error("Method not implemented.");
	}
}
