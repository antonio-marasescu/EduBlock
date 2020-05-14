import {CaDatabaseConfigModel} from "./ca-database-config.model";
import {Token} from "typedi";
import {CaIdentityModel} from "./ca-identity.model";

export interface CaConfigurationModel {
    identity: CaIdentityModel;
    databaseConfiguration: CaDatabaseConfigModel;
    useFileLogging: boolean;
}

export const CaConfigurationModelToken = new Token<CaConfigurationModel>('node.configuration');
