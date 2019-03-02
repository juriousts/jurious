import { Response } from "./Response";

export class ResponseSender {
    constructor(private response: Response, private res: any) {}

    send() {
        let h = this.response.Headers;

        console.log(h);
        let headers = {};

        console.log(h.keys());
        for (let key of h.keys()) {
            console.log(key);
            headers[key] = h.get(key);
            console.log(headers[key]);
        }

        console.log(this.response.StatusCode);
        console.log(this.response.Data);
        this.res.writeHead(this.response.StatusCode, headers);
        this.res.write(this.response.Data);
        this.res.end();
    }
}
