import { Request } from "./Request";
import { RouteDefaultParser } from "@ahrakio/witty-router";
import { Response } from "./Response";
import { AppConfig } from "../App.config";

export class RequestHandler {
    private controller: string;
    private method: string;

    constructor(private request: Request, private response: Response) {
        let parsed = request.parseTarget(new RouteDefaultParser());

        this.controller = parsed[0];
        this.method = parsed[1];
    }

    public handle(): Promise<Response> {
        return new Promise<Response>((resolve, reject) => {
            this.response.Resolve = resolve;

            if (!AppConfig.Controllers.has(this.controller)) {
                return this.response.json({ error: "NoController" }, 500);
            }

            let controller = AppConfig.Controllers.get(this.controller);
            let controllerInstance = new controller();

            if (typeof controllerInstance[this.method] !== "function") {
                return this.response.json({ error: "NoMethod" }, 500);
            }

            // Run the controller and middlewares
            controllerInstance.Request = this.request;
            controllerInstance.Response = this.response;

            controllerInstance[this.method]();
        }).catch((reason: any) => this.response);
    }
}
