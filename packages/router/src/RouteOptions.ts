export interface RouteOptions {
    target: string;
    middlewares?: string[];
    waitToBody?: boolean; // default is true
}