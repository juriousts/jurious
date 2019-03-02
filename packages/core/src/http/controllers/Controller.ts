import {Request} from "../Request";
import {Response} from "../Response";

export abstract class Controller {
    protected request: Request;
    protected response: Response;
    private resolve: any; 
    private reject: any; 

    constructor() {}

    set Request(value: Request) {
        this.request = value;
    }

    set Response(value: Response) {
        this.response = value;
    }

    set Resolve(value: any) {
        this.resolve = value;
    }
    
    set Reject(value: any) {
        this.reject = value;
    }
}