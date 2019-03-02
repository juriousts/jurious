export class RouteConflict extends Error {
    constructor(new_uri:string) {
        super("Route " + new_uri + " is been conflicted with existing Route");
    }
}