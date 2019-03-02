import { Map } from "./utils/Map";
import { RouteTargetParser } from "./parsers/RouteTargetParser";
import { Params } from "./Params";

export class RouteInstance {
    private target: string;
    private uri: string;
    private params_map: Params;
    private middlewares: string[];

    constructor(uri: string, target: string, middlewares: string[]) {
        this.target = target;
        this.middlewares = middlewares;
        this.uri = uri;
        this.params_map = new Params();
    }

    protected SetUriParams(params_names: string[], param_values: string[]) {
        if (param_values.length !== params_names.length) {
            console.log("ERROR: uri parameters count doesn't match to initialized regex parameter count");
            return; // TODO throw exception ?
        }
        for (let key = 0; key < params_names.length; ++key) {
            this.params_map.add(params_names[key], param_values[key]);
        }
    }

    // note: this value will be always the real time uri!
    get Uri(): string {
        return this.uri;
    }
    parseTarget(parser: RouteTargetParser): [string, string] {
        return parser.parse(this.Target);
    }

    get UriParams(): Params {
        return this.params_map;
    }

    get Target(): string {
        return this.target;
    }

    get Middlewares(): string[] {
        return this.middlewares;
    }
}
