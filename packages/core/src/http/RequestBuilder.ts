import { Request } from "./Request";
import { RouteDefaultParser } from "@jurious/router";
import { Response } from "./Response";
import { AppConfig } from "../App.config";

export class RequestBuilder {
	constructor(private request: Request, private response: Response) {}

	public build(): (
		request: Request,
		response: Response
	) => Promise<Response> {
		let middlewares: string[] = this.request.Middlewares;

		let next = this.controllerMethod;

		for (let i = middlewares.length - 1; i >= 0; i--) {
			if (!AppConfig.Middlewares.has(middlewares[i])) {
				throw new Error(`no_such_middleware ${middlewares[i]}`);
			}

			next = this.createNext(middlewares[i], next);
		}

		return next;
	}

	private async controllerMethod(
		request: Request,
		response: Response
	): Promise<Response> {
		console.log("first one");
		let [controllerStr, method] = request.parseTarget(
			new RouteDefaultParser()
		);

		if (!AppConfig.Controllers.has(controllerStr)) {
			return this.response.json({ error: "NoController" }, 500);
		}

		let controller = AppConfig.Controllers.get(controllerStr);
		let controllerInstance = new controller();

		if (typeof controllerInstance[method] !== "function") {
			return response.json({ error: "NoMethod" }, 500);
		}

		let methodInstance: (
			request: Request,
			response: Response
		) => Response | Promise<Response> = controllerInstance[method];

		let result = methodInstance(request, response);

		if (result instanceof Response) {
			return Promise.resolve(result);
		}

		return result as Promise<Response>;
	}

	private createNext(
		middlewareName: string,
		next: (request: Request, response: Response) => Promise<Response>
	): (request: Request, response: Response) => Promise<Response> {
		return async (
			request: Request,
			response: Response
		): Promise<Response> => {
			let middleware = new (AppConfig.Middlewares.get(middlewareName))();

			const result = middleware.handle(request, response, next);

			if (result instanceof Response) {
				return Promise.resolve(result);
			}

			return result as Promise<Response>;
		};
	}
}
