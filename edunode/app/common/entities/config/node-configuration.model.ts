import {NodeDatabaseConfigModel} from "./node-database-config.model";
import {Token} from "typedi";
import {NodeIdentityModel} from "./node-identity.model";
import {NodeRabbitMqConfigModel} from "./node-rabbit-mq-config.model";

export interface NodeConfigurationModel {
    identity: NodeIdentityModel;
    databaseConfiguration: NodeDatabaseConfigModel;
    rabbitmqConfiguration: NodeRabbitMqConfigModel;
    useFileLogging: boolean;
}

export const NodeConfigurationModelToken = new Token<NodeConfigurationModel>('node.configuration');
