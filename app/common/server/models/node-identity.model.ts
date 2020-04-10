import {NodeDatabaseConfigModel} from "../db/config/node-database-config.model";

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
