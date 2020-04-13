import {DoormanDatabaseConfigModel} from "./doorman-database-config.model";
import {Token} from "typedi";
import {DoormanIdentityModel} from "./doorman-identity.model";

export interface DoormanConfigurationModel {
    identity: DoormanIdentityModel;
    databaseConfiguration: DoormanDatabaseConfigModel;
    useFileLogging: boolean;
}

export const DoormanConfigurationModelToken = new Token<DoormanConfigurationModel>('node.identity');
