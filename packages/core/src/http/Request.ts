import { Headers } from "./Headers";
import { RouteInstance, RouteTargetParser } from "@ahrakio/witty-router";
import { IncomingMessage } from "http";
import { parse } from "url";
import { Params } from "@ahrakio/witty-router";

export class Request {
    private req: IncomingMessage;
    private route: RouteInstance;

    private query_params: Params | null;
    private headers: Headers | null;
    private body: string | null;

    constructor(req: IncomingMessage, route: RouteInstance) {
        this.req = req;
        this.route = route;

        this.query_params = null;
        this.headers = null;
        this.body = null;
    }

    get Middlewares(): string[] {
        return this.route.Middlewares;
    }

    parseTarget(parser: RouteTargetParser) {
        return this.route.parseTarget(parser);
    }

    get Target(): string {
        return this.route.Target;
    }

    private parseHeaders(headers: { [key: string]: string }): Headers {
        let h = new Headers();

        for (let key of Object.keys(headers)) {
            h.set(key, headers[key]);
        }

        return h;
    }

    /**
     * returns request Headers
     * @returns {Headers} object with all request headers
     * @constructor
     */
    get Headers(): Headers {
        if (this.headers == null) {
            this.headers = this.parseHeaders(this.req.headers as { [key: string]: string });
        }
        return this.headers;
    }

    /**
     * returns request query parameters
     * @returns {Params} object with all query parameters
     * @constructor
     */
    get QueryParams(): Params {
        if (this.query_params == null) {
            let temp: Params = new Params();
            if (this.req.url) {
                let params = parse(this.req.url).query;
                if (params) {
                    for (let key of Object.keys(params)) {
                        temp.add(key, params[key]);
                    }
                }
            }
            this.query_params = temp;
        }
        return this.query_params;
    }

    /**
     * Returns request inner Uri parameters.
     * @returns {Params} object with all inner uri parameters
     * @constructor
     */
    get UriParams(): Params {
        return this.route.UriParams;
    }

    /**
     * Returns request method
     * @returns {string} the method
     * @constructor
     */
    get Method(): string {
        return this.req.method as string;
    }

    /**
     * Returns uri with query parameter inline.
     * @returns {string}
     * @constructor
     */
    get RawUri(): string {
        return this.req.url as string;
    }

    /**
     * Returns the path name (uri without query parameters)
     * @returns {string}
     * @constructor
     */
    get Path(): string {
        return this.route.Uri;
    }

    /**
     * Returns client http version
     * @returns {string} client http version as string
     *
     */
    get httpVersion(): string {
        return this.req.httpVersion;
    }

    /**
     * returns client's http body when WaitToBody doesn't set to false.
     * Note: when WaitToBody set to false - this method return null until the other body request function will return successfully.
     *      after one of the body request functions will return - the data will be save in the object and hence the other calls will return immediately.
     * @returns {string} http body.
     * @constructor
     */
    get Body(): string {
        return this.body + "";
    }

    /**
     * Returns promise that will returns client's http body - when the last packet will be received.
     * Note: relevant when WaitToBody set to false and only on the first body request functions call.
     *      after the first call (or when WaitToBody set to true) the data will be save in the object and hence the other calls will return immediately.
     * @returns {Promise<string>}
     * @constructor
     */
    PromisedBody(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            if (this.body !== null) {
                resolve(this.body);
            } else {
                let data = "";
                this.req
                    .on("data", (chunk) => {
                        data += chunk.toString();
                    })
                    .on("end", () => {
                        this.body = data;
                        resolve(this.body);
                    })
                    .on("error", (err) => reject(err));
            }
        }).catch((err) => "Error");
    }

    /**
     * get 3 function to handle income packets in stream mode.
     * Note: relevant when WaitToBody set to false and only on the first body request functions call.
     *      after the first call (or when WaitToBody set to true) the data will be save in the object and
     *      hence the other calls will enter to next() with all the data, and end() call immediately after it will finish.
     * @param {(string) => void} next  function that handle single packet.
     * @param {() => void} end  function that handle the end of stream.
     * @param {(string) => void} error function that handler error massage.
     * @constructor
     */
    StreamedBody(next: (string) => void, end: () => void, error: (string) => void) {
        if (this.body !== null) {
            next(this.body);
            end();
        } else {
            let data = "";
            this.req
                .on("data", (chunk) => {
                    data += chunk.toString();
                    next(chunk.toString());
                })
                .on("end", () => {
                    this.body = data;
                    end();
                })
                .on("error", error);
        }
    }
}
