import * as fs from 'fs';
import {
    NodeConfigurationModel,
    NodeConfigurationModelToken
} from "../../common/entities/config/node-configuration.model";
import {Container} from "typedi";
import {CommonIdentity} from "../../common/entities/identity/common-identity.entity";
import {AxiosTokenNMS} from "../../common/services/axios/axios.config";
import Axios from "axios";

export class InitializationHandler {
    public handleInitialization() {
        this.handlePersonalIdentity();
        this.handleNetwork();
    }

    private handlePersonalIdentity() {
        if (process.argv.length != 3) {
            throw new Error('Not enough arguments!');
        }
        const identityName: string = process.argv[2];
        const rawData: Buffer = fs.readFileSync('resources/identities.json');
        const identities: { [key: string]: NodeConfigurationModel } = JSON.parse(rawData.toString());
        if (!identities) {
            throw new Error("Invalid 'identities.json'!");
        }
        const ownIdentity = identities[identityName];
        if (!ownIdentity) {
            throw new Error("Invalid identity parameter!");
        }
        Container.set(NodeConfigurationModelToken, ownIdentity);
    }

    private handleNetwork() {
        const rawData: Buffer = fs.readFileSync('resources/network.json');
        const network: { [key: string]: CommonIdentity } = JSON.parse(rawData.toString());
        const nms = network['nms'];
        const axiosInstance = Axios.create({
            baseURL: 'http://' + nms.host + ":" + nms.port
        });
        Container.set(AxiosTokenNMS, axiosInstance);
    }
}
