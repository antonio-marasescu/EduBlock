import express, {Express} from "express";
import bodyParser from 'body-parser'
import {Container, Inject, Service, Token} from "typedi";
import {CaConfigurationModel, CaConfigurationModelToken} from "../common/entities/config/ca-configuration.model";
import {CaLogger, CaLoggerToken} from "../common/logger/ca-logger.interface";
import {IdentityServiceToken} from "../common/services/identity.service";
import {CaErrorHandler} from "../common/errors/ca.error.handler";
import {API_REGISTER_TOKENS} from "../common/network/basic.api.register";

export const CaNodeToken = new Token<CaNode>('CaNode');

@Service(CaNodeToken)
export class CaNode {
    private app: Express;

    constructor(@Inject(CaConfigurationModelToken) private nodeConfiguration: CaConfigurationModel,
                @Inject(CaLoggerToken) private logger: CaLogger) {
        this.app = express();
    }

    public async start(): Promise<void> {

        this.logger.logInfo(this, 'Node ' + this.nodeConfiguration.identity.alias + ' is starting...');
        this.logger.logInfo(this, 'Port: ' + this.nodeConfiguration.identity.port);
        this.logger.logInfo(this, 'Database Port: ' + this.nodeConfiguration.databaseConfiguration.port);
        await this.applyMiddleware();
        const that = this;
        this.app.listen(this.nodeConfiguration.identity.port, async function () {
            const identity = await Container.get(IdentityServiceToken).checkOrGeneratePersonalIdentity();
            that.logger.logInfo(that, "Identity (Public Key): " + identity);
            that.logger.logSuccess(that, 'Node ' + that.nodeConfiguration.identity.alias + ' is listening....');
        });
    }

    private async applyMiddleware(): Promise<void> {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: false}));
        API_REGISTER_TOKENS.forEach(token => this.app.use(Container.get(token).getRouter()));
        this.app.use((error, _, res, __) => CaErrorHandler.handleError(error, res))
    }
}
