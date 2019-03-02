export abstract class NetworkAdapter {
    protected server: any;
    protected port: number;
    protected protocol: string;
    protected name: string;

    constructor(name: string, port: number) {
        this.port = port;
        this.name = name;
        this.server = null;
    }

    public abstract listen();
    public abstract close();

    public get Protocol(): string {
        return this.protocol;
    }

    public get Name(): string {
        return this.name;
    }
}
