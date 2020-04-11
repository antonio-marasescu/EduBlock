import express, {Express} from "express";
import bodyParser from 'body-parser'
import {Container, Inject, Service, Token} from "typedi";
import {NodeConfigurationModel, NodeIdentityModelToken} from "../entities/config/node-configuration.model";
import {VaultConnection, VaultConnectionToken} from "./db/vault.connection";
import {EccService, EccServiceToken} from "../services/security/ecc.service";
import {IdentityServiceToken} from "../services/common/identity.service";
import DIExecutor from "./di/di.executor";
import {ServerLogger, ServerLoggerToken} from "../logger/server-logger.interface";
import {API_ROUTER_REGISTER} from "../network/api/basic.api.register";

export const EduNodeToken = new Token<EduNode>('EduNode');

@Service(EduNodeToken)
export class EduNode {
    private app: Express;

    constructor(@Inject(NodeIdentityModelToken) private nodeConfiguration: NodeConfigurationModel,
                @Inject(VaultConnectionToken) private vaultConnection: VaultConnection,
                @Inject(EccServiceToken) private eccService: EccService,
                @Inject(ServerLoggerToken) private logger: ServerLogger) {
        this.app = express();
    }

    public async start(): Promise<void> {

        this.logger.logInfo(this, 'Node ' + this.nodeConfiguration.identity.alias + ' is starting...');
        this.logger.logInfo(this, 'Type: ' + this.nodeConfiguration.nodeType);
        this.logger.logInfo(this, 'Port: ' + this.nodeConfiguration.identity.port);
        this.logger.logInfo(this, 'Database Port: ' + this.nodeConfiguration.databaseConfiguration.port);

        await this.applyMiddleware();
        const that = this;
        this.app.listen(this.nodeConfiguration.identity.port, async function () {
            await that.applyInitialization();
            that.logger.logSuccess(that, 'Node ' + that.nodeConfiguration.identity.alias + ' is listening....');
        });
    }

    private async applyInitialization(): Promise<void> {
        await this.vaultConnection.initializeConnection();
        await this.eccService.initializeService();
        const di = new DIExecutor();
        di.injectDependents(null);
        const identity = await Container.get(IdentityServiceToken).checkOrGenerateIdentity();
        this.logger.logInfo(this, "Identity (Public Key): " + identity);
    }

    private async applyMiddleware(): Promise<void> {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: false}));
        API_ROUTER_REGISTER.forEach(router => this.app.use(router));
    }
}
