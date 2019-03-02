import { Request } from "../Request";
import { Response } from "../Response";
import { AppConfig } from "../../App.config";

export class MiddlewareHandler {
    constructor(private request: Request, private response: Response) {}

    public async handle(): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            let middlewares: string[] = this.request.Middlewares;

            for (let i = 0; i < middlewares.length; i++) {
                if (!AppConfig.Middlewares.has(middlewares[i])) {
                    return reject(false);
                }

                let middleware = new (AppConfig.Middlewares.get(middlewares[i]))();
                middleware.Request = this.request;
                middleware.Response = this.response;

                let result = await middleware.handle();

                if (!result) {
                    return reject(false);
                }
            }

            return resolve(true);
        }).catch((reason: any) => false);
    }
}
