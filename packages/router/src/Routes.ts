import { Map } from "./utils/Map";
import { Method } from "./Constants";
import { MethodMapper } from "./MethodMapper";
import { RouteOptions } from "./RouteOptions";
import { RouteInstance } from "./RouteInstance";

export class Routes {
    private routes: Map<MethodMapper>;

    constructor() {
        this.routes = new Map<MethodMapper>();

        Object.keys(Method).forEach((method) => {
            this.routes.add(Method[method], new MethodMapper(Method[method]));
        });
    }

    public has(method: string, uri: string): boolean {
        return this.routes.has(method) && this.routes.get(method).has(uri);
    }

    public match(method: string, uri: string): RouteInstance {
        return this.routes.get(method).get(uri);
    }

    public addRoute(uri: string, method: string, options: RouteOptions) {
        this.routes.get(method).add(uri, options);
    }
}
