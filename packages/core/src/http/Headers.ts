import { Map } from "../utils/Map";
import {NoHeaderError} from "./exceptions/NoHeaderError";

export class Headers {

    private headers: Map<string>;

    constructor() {
        this.headers = new Map<string>();
    }

    public get(key: string) {
        if (!this.headers.has(key)) {
            throw new NoHeaderError();   
        }

        return this.headers.get(key);
    }

    public set(key: string, value: string) {
        this.headers.add(key, value);
    }

    public keys(): string[] {
        return this.headers.keys;
    }
}