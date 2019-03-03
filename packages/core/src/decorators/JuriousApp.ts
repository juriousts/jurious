import { WaitToBodyMiddleWare } from "../http/middlewares/WaitToBodyMiddleWare";
import { NetworkAdapterParser } from "../adapters/NetworkAdapterParser";
import { Map } from "../utils/Map";
import { Controller } from "../http/controllers/Controller";
import { AppConfig } from "../App.config";
import { Middleware } from "../http/middlewares/Middleware";
import { NetworkAdapter } from "../adapters/NetworkAdapter";

import * as path from "path";
// prettier-ignore
export function JuriousApp<C extends Controller, M extends Middleware>(
    details: {
        controllers: { new (): C }[],
        middlewares: { new (): M }[]
    }
    ) {
    return <T extends { new (...args: any[]): {} }>(constructor: T) => {
        let c = new Map<{ new (): Controller }>();
        let m = new Map<{ new (): Middleware }>();
        let a: NetworkAdapter[] = NetworkAdapterParser.loadConfigurationFile(path.resolve(process.cwd(), 'structure.json'));

        for (let controller of details.controllers) {
            c.add(controller.name, controller);
        }

        for (let middleware of details.middlewares) {
            m.add(middleware.name, middleware);
        }

        m.add('WaitToBodyMiddleWare', WaitToBodyMiddleWare);
        
        AppConfig.Controllers = c;
        AppConfig.Middlewares = m;
        AppConfig.Adapters = a;

        return class extends constructor {
            adapters = a;
        };
    };
}
