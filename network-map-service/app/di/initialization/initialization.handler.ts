import * as fs from 'fs';
import {Container} from "typedi";
import {NmsConfigurationModel, NmsConfigurationModelToken} from "../../common/config/nms-configuration.model";

export class InitializationHandler {
    public initialization() {
        if (process.argv.length != 3) {
            throw new Error('Not enough arguments!');
        }
        const identityName: string = process.argv[2];
        const rawData: Buffer = fs.readFileSync('resources/identities.json');
        const identities: { [key: string]: NmsConfigurationModel } = JSON.parse(rawData.toString());
        if (!identities) {
            throw new Error("Invalid 'identities.json'!");
        }
        const ownIdentity = identities[identityName];
        if (!ownIdentity) {
            throw new Error("Invalid identity parameter!");
        }
        Container.set(NmsConfigurationModelToken, ownIdentity);
    }
}
