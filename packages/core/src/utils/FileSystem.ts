import { readFileSync } from "fs";

export function readJsonFile(path: string): any {
    try {
        return JSON.parse(readFileSync(path, "ascii"));
    } catch {
        return null;
    }
}
