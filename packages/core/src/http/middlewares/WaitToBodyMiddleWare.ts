import { Middleware } from "./Middleware";
import { Response } from "../Response";
import { Request } from "../Request";
import to from "@jurious/await";

export class WaitToBodyMiddleWare extends Middleware {
	public async handle(
		request: Request,
		response: Response,
		next: (request: Request, response: Response) => Promise<Response>
	): Promise<Response> {
		const [err, data] = await to(request.PromisedBody());

		if (err) {
			return Promise.resolve(response);
		}

		return next(request, response);
	}
}
