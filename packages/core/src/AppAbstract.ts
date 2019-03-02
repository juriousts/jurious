import { NetworkAdapter } from "./adapters/NetworkAdapter";

export abstract class AppAbstract {
    private adapters: NetworkAdapter[];

    constructor() {}

    public bootstrap() {
        // if (typeof process.argv[2] !== "undefined") {
        //     this.port = +process.argv[2];
        // }

        for (let adapter of this.adapters) {
            adapter.listen();
        }
    }
}
