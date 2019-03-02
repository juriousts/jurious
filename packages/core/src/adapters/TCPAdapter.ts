import { NetworkAdapter } from "./NetworkAdapter";
import { NetworkProtocol } from "./Constants";

export class TCPAdapter extends NetworkAdapter {
    constructor(name: string, port: number) {
        super(name, port);
        this.protocol = NetworkProtocol.TCP;
    }

    listen() {}
    close() {
        throw new Error("Method not implemented.");
    }
}
