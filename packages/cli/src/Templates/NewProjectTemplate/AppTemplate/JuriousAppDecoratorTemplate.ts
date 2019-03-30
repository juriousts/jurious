import { DecoratorTemplate } from '@jurious/templates';

export class JuriousAppDecoratorTemplate extends DecoratorTemplate {
    constructor() {
        super("JuriousApp");

        this.params = {
            controllers: [],
            middlewares: []
        };
    }

    
}