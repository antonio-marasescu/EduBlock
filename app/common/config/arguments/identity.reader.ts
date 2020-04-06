import * as fs from 'fs';
import {NodeIdentityModel} from "../../entities/identity/node-identity.model";
import {Container} from "typedi";

export class IdentityReader {
    public readArguments() {
        if (process.argv.length != 3) {
            throw new Error('Not enough arguments!');
        }
        const identityName: string = process.argv[2];
        const rawData: Buffer = fs.readFileSync('resources/identities.json');
        const identities: { [key: string]: NodeIdentityModel } = JSON.parse(rawData.toString());
        if (!identities) {
            throw new Error("Invalid 'identities.json'!");
        }
        const ownIdentity = identities[identityName];
        if (!ownIdentity) {
            throw new Error("Invalid identity parameter!");
        }
        Container.set('node.identity', ownIdentity);
    }
}
