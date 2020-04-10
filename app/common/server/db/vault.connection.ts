import {createConnection} from "typeorm";
import {Inject, Service, Token} from "typedi";
import {NodeConfigurationModel, NodeIdentityModelToken} from "../models/node-configuration.model";
import {Connection} from "typeorm/connection/Connection";
import {VAULT_SCHEMA} from "./vault.schema";
import {ServerLogger, ServerLoggerToken} from "../../logger/server-logger.interface";

export const VaultConnectionToken = new Token<VaultConnection>('vault.connection');

@Service(VaultConnectionToken)
export class VaultConnection {

    public connection: Connection | undefined;

    constructor(@Inject(NodeIdentityModelToken) private nodeConfiguration: NodeConfigurationModel,
                @Inject(ServerLoggerToken) private logger: ServerLogger) {
    }

    public async initializeConnection(): Promise<void> {
        const that = this;
        await createConnection({
            type: "postgres",
            host: this.nodeConfiguration.dbConfig.host,
            port: this.nodeConfiguration.dbConfig.port,
            username: this.nodeConfiguration.dbConfig.username,
            password: this.nodeConfiguration.dbConfig.password,
            database: this.nodeConfiguration.dbConfig.defaultDatabaseName,
            logging: this.nodeConfiguration.dbConfig.logging as any,
            logger: this.nodeConfiguration.dbConfig.logger as any,
            entities: VAULT_SCHEMA,
        })
            .then(connection => {
                that.connection = connection as Connection;
                that.logger.logSuccess(that, "Database Connection established...");
            })
            .catch(error => {
                that.logger.logError(that, error)
            });
        await this.connection?.synchronize();
    }
}
