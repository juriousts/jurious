import { RouteTargetParser } from "./parsers/RouteTargetParser";
import { RouteOptions } from "./RouteOptions";
import {RouteInstance} from "./RouteInstance";
import {RouteInstanceWithUriParams} from "./RouteInstanceWithUriParams";


export class Route {
	private target: string;
	private uri: string;
	private keys: string[];
	private middlewares: string[];

	constructor(uri: string, options: RouteOptions) {
		this.target = options.target;
		this.uri = uri;
		this.keys = [];
		this.middlewares = [];

		if (options.middlewares !== undefined) {
			this.middlewares = options.middlewares;
		}

		if (options.waitToBody === undefined || options.waitToBody) {
			this.Middlewares.push('WaitToBodyMiddleWare');
		}
	}

	getInstance (real_time_uri:string, params_names?: string[], param_values?:string[] ) : RouteInstance {
        if (params_names && param_values) {
            return new RouteInstanceWithUriParams(real_time_uri, this.Target, this.Middlewares, params_names, param_values);
        }
	    return new RouteInstance(real_time_uri, this.Target, this.Middlewares);

    }

    // note:  when the route use uri params - this value will be different from the real time uri!
	get Uri(): string {
		return this.uri;
	}

	set ParamKeys(keys: string[]) {
		this.keys = keys;
	}
	get ParamKeys(): string[] {
		return this.keys;
	}

	get Target(): string {
		return this.target;
	}

	get Middlewares(): string[] {
		return this.middlewares;
	}

	set Middlewares(value: string[]) {
		this.middlewares = value;
	}

	public addMiddleware(value: string) {
		this.middlewares.push(value);
	}
}
