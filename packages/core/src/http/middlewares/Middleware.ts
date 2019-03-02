import { Request } from "../Request";
import { Response } from "../Response";

export abstract class Middleware {
    protected request: Request;
    protected response: Response;

    constructor() {}


    set Request(value: Request) {
        this.request = value;
    }

    set Response(value: Response) {
        this.response = value;
    }

    public abstract handle(): boolean | Promise<boolean>;
}