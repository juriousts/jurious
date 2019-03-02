import { Controller } from "./http/controllers/Controller";
import { Map } from "./utils/Map";
import { Middleware } from "./http/middlewares/Middleware";
import { NetworkAdapter } from "./adapters/NetworkAdapter";

export class AppConfig {
    private static controllers: Map<{ new (): Controller }>;
    private static middlewares: Map<{ new (): Middleware }>;
    private static adapters: NetworkAdapter[];

    static set Controllers(value: Map<{ new (): Controller }>) {
        AppConfig.controllers = value;
    }

    static get Controllers(): Map<{ new (): Controller }> {
        return AppConfig.controllers;
    }

    static set Middlewares(value: Map<{ new (): Middleware }>) {
        AppConfig.middlewares = value;
    }

    static get Middlewares(): Map<{ new (): Middleware }> {
        return AppConfig.middlewares;
    }

    static set Adapters(value: NetworkAdapter[]) {
        AppConfig.adapters = value;
    }

    static get Adapters(): NetworkAdapter[] {
        return AppConfig.adapters;
    }
}
