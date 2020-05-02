export function objectWithoutKeys(objectData: { [key: string]: any }, blacklistedKeys: string[]): { [key: string]: any } {
    const keys = Object.keys(objectData);
    const filteredKeys = keys.filter(x => !blacklistedKeys.includes(x));
    const newObject = {};
    filteredKeys.forEach(k => newObject[k] = objectData[k]);
    return newObject;
}

export function deepClone(object: any): any {
    let cloneObj = new (<any>object.constructor());
    for (let attribute in object)
        if (object.hasOwnProperty(attribute)) {
            if (typeof object[attribute] === "object") {
                cloneObj[attribute] = object[attribute].clone();
            } else {
                cloneObj[attribute] = object[attribute];
            }
        }
    return cloneObj;
}
