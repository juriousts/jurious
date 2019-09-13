import { Request } from "../Request";
import { Response } from "../Response";
import { AppConfig } from "../../App.config";
import { RouteDefaultParser } from "@jurious/router";

export class MiddlewareHandler {
	constructor(private request: Request, private response: Response) {}

	public async handle(): Promise<boolean> {
		return new Promise<boolean>(async (resolve, reject) => {});
	}
}
