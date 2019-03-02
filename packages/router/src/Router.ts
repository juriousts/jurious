import { Routes } from "./Routes";
import { Route } from "./Route";
import { NoRoute } from "./exceptions/NoRoute";
import { Method } from "./Constants";
import { RouteOptions } from "./RouteOptions";
import { RouteInstance } from "./RouteInstance";

class router {
    private routes: Routes;
    constructor() {
        this.routes = new Routes();
    }

    get(uri: string, options: RouteOptions | string) {
        this.add(uri, Method.GET, options);
    }

    post(uri: string, options: RouteOptions | string) {
        this.add(uri, Method.POST, options);
    }

    put(uri: string, options: RouteOptions | string) {
        this.add(uri, Method.PUT, options);
    }

    delete(uri: string, options: RouteOptions | string) {
        this.add(uri, Method.DELETE, options);
    }

    trace(uri: string, options: RouteOptions | string) {
        this.add(uri, Method.TRACE, options);
    }

    connect(uri: string, options: RouteOptions | string) {
        this.add(uri, Method.CONNECT, options);
    }

    head(uri: string, options: RouteOptions | string) {
        this.add(uri, Method.HEAD, options);
    }

    options(uri: string, options: RouteOptions | string) {
        this.add(uri, Method.OPTIONS, options);
    }

    patch(uri: string, options: RouteOptions | string) {
        this.add(uri, Method.PATCH, options);
    }

    private add(uri: string, method: string, options: RouteOptions | string) {
        if (typeof options === "string") {
            this.routes.addRoute(uri, method, {
                target: options
            });
        } else {
            this.routes.addRoute(uri, method, options);
        }
    }

    match(method: string, uri: string): RouteInstance {
        if (!this.routes.has(method, uri)) {
            throw new NoRoute();
        }

        return this.routes.match(method, uri);
    }
}

if (global['router'] === undefined) {
    global["router"] = new router();
}

export let Router: router = global["router"];
