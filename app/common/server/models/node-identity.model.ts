import {NodeDatabaseConfigModel} from "../db/config/node-database-config.model";
import {Token} from "typedi";

export enum EduNodeType {
    UNIVERSITY = 'University',
    CERTIFICATE_AUTHORITY = 'Certificate Authority'
}

export interface NodeIdentityModel {
    legalName: string;
    alias: string;
    port: number;
    dbConfig: NodeDatabaseConfigModel;
    nodeType: EduNodeType;
}

export const NodeIdentityModelToken = new Token<NodeIdentityModel>('node.identity');
