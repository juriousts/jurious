import { chdir } from 'process';
import { findFile } from "../Common/FileSystem";

export const ProjectPathMiddleware = () => {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        const path = findFile('jurious.json');
        if (!path) {
            descriptor.value = () => {
                console.error('Not in project directory!');
                return;
            };
        } else {
            chdir(path);
        }


        return descriptor;
    };
}