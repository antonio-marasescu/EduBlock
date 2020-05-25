import {createConnection} from 'typeorm';
import {Inject, Service, Token} from 'typedi';
import {NodeConfigurationModel, NodeConfigurationModelToken} from '../../common/config/node-configuration.model';
import {Connection} from 'typeorm/connection/Connection';
import {VAULT_SCHEMA} from './vault.schema';
import {ServerLogger, ServerLoggerToken} from '../../common/logger/server-logger.interface';

export const VaultConnectionToken = new Token<VaultConnection>('vault.connection');

@Service(VaultConnectionToken)
export class VaultConnection {

    public connection: Connection | undefined;

    constructor(@Inject(NodeConfigurationModelToken) private nodeConfiguration: NodeConfigurationModel,
                @Inject(ServerLoggerToken) private logger: ServerLogger) {
    }

    public async initializeConnection(): Promise<void> {

        this.logger.logInfo(this, 'Database Connection initializing...');
        const that = this;
        await createConnection({
            type: 'postgres',
            host: this.nodeConfiguration.databaseConfiguration.host,
            port: this.nodeConfiguration.databaseConfiguration.port,
            username: this.nodeConfiguration.databaseConfiguration.username,
            password: this.nodeConfiguration.databaseConfiguration.password,
            database: this.nodeConfiguration.databaseConfiguration.databaseName,
            logging: this.nodeConfiguration.databaseConfiguration.logging as any,
            logger: this.nodeConfiguration.databaseConfiguration.logger as any,
            entities: VAULT_SCHEMA,
        })
            .then(connection => {
                that.connection = connection as Connection;
                that.logger.logSuccess(that, 'Database Connection established.');
            })
            .catch(error => {
                that.logger.logError(that, error)
            });
        await this.connection?.synchronize().catch(error => this.logger.logError(this, JSON.stringify(error)));
    }

    public async killConnection(): Promise<void> {
        await this.connection?.close();
    }
}
