import {NodeDatabaseConfigModel} from "./node-database-config.model";
import {Token} from "typedi";
import {NodeIdentityModel} from "./node-identity.model";

export enum EduNodeType {
    UNIVERSITY = 'University',
    CERTIFICATE_AUTHORITY = 'Certificate Authority'
}

export interface NodeConfigurationModel {
    identity: NodeIdentityModel;
    databaseConfiguration: NodeDatabaseConfigModel;
    useFileLogging: boolean;
    nodeType: EduNodeType;
}

export const NodeIdentityModelToken = new Token<NodeConfigurationModel>('node.identity');
