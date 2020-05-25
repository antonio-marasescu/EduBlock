import {NodeDatabaseConfigModel} from './node-database-config.model';
import {Token} from 'typedi';
import {NodeIdentityModel} from './node-identity.model';
import {NodeRabbitMqConfigModel} from './node-rabbit-mq-config.model';
import {NodeBlockchainConfigurationModel} from './node-blockchain-configuration.model';
import {NodeWorkerConfigurationModel} from './node-worker-configuration.model';

export interface NodeConfigurationModel {
    identity: NodeIdentityModel;
    databaseConfiguration: NodeDatabaseConfigModel;
    rabbitmqConfiguration: NodeRabbitMqConfigModel;
    blockchainConfiguration: NodeBlockchainConfigurationModel;
    workerConfiguration: NodeWorkerConfigurationModel;
    useFileLogging: boolean;
    isRunningTests: boolean;
}

export const NodeConfigurationModelToken = new Token<NodeConfigurationModel>('node.configuration');
