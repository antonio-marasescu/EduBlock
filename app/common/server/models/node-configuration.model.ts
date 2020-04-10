import {NodeDatabaseConfigModel} from "../db/config/node-database-config.model";
import {Token} from "typedi";

export enum EduNodeType {
    UNIVERSITY = 'University',
    CERTIFICATE_AUTHORITY = 'Certificate Authority'
}

export interface NodeConfigurationModel {
    legalName: string;
    alias: string;
    port: number;
    dbConfig: NodeDatabaseConfigModel;
    useFileLogging: boolean;
    nodeType: EduNodeType;
}

export const NodeIdentityModelToken = new Token<NodeConfigurationModel>('node.identity');
