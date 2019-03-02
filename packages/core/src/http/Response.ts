import { Headers } from "./Headers";

export class Response {
    private data: string;
    private statusCode: number;
    private headers: Headers;
    private resolve: any;

    constructor() {
        this.data = "";
        this.statusCode = 200;
        this.headers = new Headers();
    }

    set Resolve(value: any) {
        this.resolve = value;
    }

    set Data(value: string) {
        this.data = value;
    }

    set StatusCode(value: number) {
        this.statusCode = value;
    }

    get StatusCode(): number {
        return this.statusCode;
    }

    get Data(): string {
        return this.data;
    }

    get Headers(): Headers {
        return this.headers;
    }


    json(data: any, statusCode: number = 200, resolve: boolean = true) {
        this.headers.set("Content-Type", "application/json");
        this.data = JSON.stringify(data);
        this.statusCode = statusCode;

        if (resolve) {
            this.resolve(this);
        }
    }

    text(data: any, statusCode: number = 200, resolve: boolean = true) {
        this.headers.set("Content-Type", "text/plain");
        this.data = data;
        this.statusCode = statusCode;

        if (resolve) {
            this.resolve(this);
        }
    }

    html(data: any, statusCode: number = 200, resolve: boolean = true) {
        this.headers.set("Content-Type", "text/html");
        this.data = data;
        this.statusCode = statusCode;

        if (resolve) {
            this.resolve(this);
        }
    }

    css(data: any, statusCode: number = 200, resolve: boolean = true) {
        this.headers.set("Content-Type", "text/css");
        this.data = data;
        this.statusCode = statusCode;

        if (resolve) {
            this.resolve(this);
        }
    }
}
