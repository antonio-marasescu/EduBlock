export function objectWithoutKeys(objectData: { [key: string]: any }, blacklistedKeys: string[]): { [key: string]: any } {
    const keys = Object.keys(objectData).sort();
    const filteredKeys = keys.filter(x => !blacklistedKeys.includes(x));
    const newObject = {};
    filteredKeys.forEach(k => newObject[k] = objectData[k]);
    return newObject;
}
