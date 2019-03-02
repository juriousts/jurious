import {Middleware} from "./Middleware";

export class WaitToBodyMiddleWare extends Middleware {
    public handle(): boolean | Promise<boolean> {
        return new Promise<boolean >(resolve => {
            this.request.PromisedBody()
                .then((data)=>resolve(true))
                .catch((err)=>resolve(false));
        }).catch(err=> false);
    }
}