import {RouteInstance} from "./RouteInstance";

export class RouteInstanceWithUriParams extends RouteInstance {
    constructor(uri: string, target:string, middlewares: string[], params_names: string[], param_values:string[]) {
        super (uri, target, middlewares);
        this.SetUriParams(params_names, param_values);
    }
}