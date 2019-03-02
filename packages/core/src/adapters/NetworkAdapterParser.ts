import * as path from "path";
import { readJsonFile } from "../utils/index";

import { NetworkProtocol } from "./Constants";
import { HttpAdapter } from "./HttpAdapter";
import { TCPAdapter } from "./TCPAdapter";
import { NetworkAdapter } from "./NetworkAdapter";

export class NetworkAdapterParser {
    public static loadConfigurationFile(file_path: string): NetworkAdapter[] {
        let file = readJsonFile(path.resolve(file_path));

        if (file === null) {
            return [];
        }

        let adapters: NetworkAdapter[] = [];

        for (let connection of file.connections) {
            switch (connection.protocol) {
                case NetworkProtocol.HTTP:
                    adapters.push(new HttpAdapter(connection.name, connection.port));
                    break;
                case NetworkProtocol.TCP:
                    adapters.push(new TCPAdapter(connection.name, connection.port));
                    break;
                default:
                    continue;
            }
        }

        return adapters;
    }
}
