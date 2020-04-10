import {createConnection} from "typeorm";
import {Inject, Service, Token} from "typedi";
import {NodeIdentityModel, NodeIdentityModelToken} from "../models/node-identity.model";
import {Connection} from "typeorm/connection/Connection";
import {VAULT_SCHEMA} from "./vault.schema";
import {ServerLogger, ServerLoggerToken} from "../../logger/server-logger.interface";

export const VaultConnectionToken = new Token<VaultConnection>('vault.connection');

@Service(VaultConnectionToken)
export class VaultConnection {

    public connection: Connection | undefined;

    constructor(@Inject(NodeIdentityModelToken) private nodeIdentity: NodeIdentityModel,
                @Inject(ServerLoggerToken) private logger: ServerLogger) {
    }

    public async initializeConnection(): Promise<void> {
        const that = this;
        await createConnection({
            type: "postgres",
            host: this.nodeIdentity.dbConfig.host,
            port: this.nodeIdentity.dbConfig.port,
            username: this.nodeIdentity.dbConfig.username,
            password: this.nodeIdentity.dbConfig.password,
            database: this.nodeIdentity.dbConfig.defaultDatabaseName,
            logging: this.nodeIdentity.dbConfig.logging as any,
            logger: this.nodeIdentity.dbConfig.logger as any,
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
