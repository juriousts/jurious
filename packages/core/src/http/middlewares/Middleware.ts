import { Request } from "../Request";
import { Response } from "../Response";

export abstract class Middleware {
	constructor() {}

	public abstract handle(
		request: Request,
		response: Response,
		next: (request: Request, response: Response) => Promise<Response>
	): Response | Promise<Response>;
}
