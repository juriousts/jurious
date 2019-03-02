import {RouteTargetParser} from "./RouteTargetParser";

export class RouteDefaultParser extends RouteTargetParser {
    constructor() {
        super();
    }

    public parse(target: string): [string, string] {
        let splitted = target.split('@');
        return [splitted[0], splitted[1]];
    }

}