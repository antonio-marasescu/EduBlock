import {NmsDatabaseConfigModel} from "./nms-database-config.model";
import {Token} from "typedi";
import {NmsIdentityModel} from "./nms-identity.model";

export interface NmsConfigurationModel {
    identity: NmsIdentityModel;
    databaseConfiguration: NmsDatabaseConfigModel;
    useFileLogging: boolean;
}

export const NmsConfigurationModelToken = new Token<NmsConfigurationModel>('node.identity');
