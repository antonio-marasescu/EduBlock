import express, {Express} from "express";
import bodyParser from 'body-parser'
import {Container, Inject, Service, Token} from "typedi";
import {NodeConfigurationModel, NodeIdentityModelToken} from "../common/entities/config/node-configuration.model";
import {ServerLogger, ServerLoggerToken} from "../common/logger/server-logger.interface";
import {IdentityServiceToken} from "../common/services/security/identity.service";
import {API_REGISTER_TOKENS} from "../common/network/api/basic.api.register";
import {EduErrorHandler} from "../common/errors/edu.error.handler";

export const EduNodeToken = new Token<EduNode>('EduNode');

@Service(EduNodeToken)
export class EduNode {
    private app: Express;

    constructor(@Inject(NodeIdentityModelToken) private nodeConfiguration: NodeConfigurationModel,
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
            const identity = await Container.get(IdentityServiceToken).checkOrGeneratePersonalIdentity();
            that.logger.logInfo(that, "Identity (Public Key): " + identity);
            that.logger.logSuccess(that, 'Node ' + that.nodeConfiguration.identity.alias + ' is listening....');
        });
    }

    private async applyMiddleware(): Promise<void> {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: false}));
        API_REGISTER_TOKENS.forEach(token => this.app.use(Container.get(token).getRouter()));
        this.app.use((error, _, res, __) => EduErrorHandler.handleError(error, res))
    }
}
