export function to<T>(promise: Promise<T>, errorExt?: object): Promise<(Error | null)[] | (T | null)[]> {
    return promise
        .then((data: T) => [null, data])
        .catch((err: Error) => {
            if (errorExt) {
                err = Object.assign(err, errorExt)
            }
  
            return [err, null];
        });
}  
export default to;