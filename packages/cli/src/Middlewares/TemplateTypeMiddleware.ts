import { findFile } from "../Common/FileSystem";
import * as templates from '../Templates/index';

export const TemplateTypeMiddleware = () => {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        let method = descriptor.value;

        descriptor.value = (...args) => {
            let type = args[0];

            if (!(type in templates)) {
                console.error('No such controller type!');
                return;
            }
            
            return method(...args);
        };

        return descriptor;
    };
}