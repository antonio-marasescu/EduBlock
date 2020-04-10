import {createConnection} from "typeorm";
import {Inject, Service, Token} from "typedi";
import {NodeIdentityModel} from "../models/node-identity.model";
import {Connection} from "typeorm/connection/Connection";
import {VAULT_SCHEMA} from "./vault.schema";

export const VaultConnectionToken = new Token<VaultConnection>('vault.connection');

@Service(VaultConnectionToken)
export class VaultConnection {

    public connection: Connection | undefined;

    constructor(@Inject('node.identity') private nodeIdentity: NodeIdentityModel) {
    }

    public async initializeConnection(): Promise<void> {
        await createConnection({
            type: "postgres",
            host: this.nodeIdentity.dbConfig.host,
            port: this.nodeIdentity.dbConfig.port,
            username: this.nodeIdentity.dbConfig.username,
            password: this.nodeIdentity.dbConfig.password,
            database: this.nodeIdentity.dbConfig.defaultDatabaseName,
            entities: VAULT_SCHEMA
        })
            .catch(error => console.log(error))
            .then(connection => {
                this.connection = connection as Connection;
                console.log("Node Database Connection established...");
            });
        await this.connection?.synchronize();
    }
}
