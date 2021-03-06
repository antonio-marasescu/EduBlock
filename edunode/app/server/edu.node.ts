import express, {Express} from 'express';
import bodyParser from 'body-parser'
import {Container, Inject, Service, Token} from 'typedi';
import {NodeConfigurationModel, NodeConfigurationModelToken} from '../common/config/node-configuration.model';
import {ServerLogger, ServerLoggerToken} from '../common/logger/server-logger.interface';
import {IdentityServiceToken} from '../common/services/security/identity.service';
import {EduErrorHandler} from '../common/errors/edu.error.handler';
import {API_REGISTER_TOKENS} from '../common/api/basic.api.register';
import {jwtVerification} from '../common/api/auth/jwt-verification.middleware';
import {AuthenticationApiToken} from '../common/api/auth/authentication.api';
import * as http from 'http';
import {TestIntegrationApiToken} from '../common/api/test/test-integration.api';
import {RabbitMqServiceToken} from '../common/services/rabbitmq/rabbit-mq.service';
import {VaultConnectionToken} from './db/vault.connection';

export const EduNodeToken = new Token<EduNode>('EduNode');

@Service(EduNodeToken)
export class EduNode {
    private app: Express;
    private httpServer: http.Server;

    constructor(@Inject(NodeConfigurationModelToken) private nodeConfiguration: NodeConfigurationModel,
                @Inject(ServerLoggerToken) private logger: ServerLogger) {
        this.app = express();
    }

    public async start(): Promise<void> {

        this.logger.logInfo(this, 'Node ' + this.nodeConfiguration.identity.alias + ' is starting...');
        this.logger.logInfo(this, 'Port: ' + this.nodeConfiguration.identity.port);
        this.logger.logInfo(this, 'Database Port: ' + this.nodeConfiguration.databaseConfiguration.port);
        await this.applyMiddleware();
        const that = this;
        this.httpServer = this.app.listen(this.nodeConfiguration.identity.port, async function () {
            const identityService = Container.get(IdentityServiceToken);
            const identity = await identityService.getPersonalIdentity();
            that.logger.logInfo(that, 'Identity (Public Key): ' + identity);
            that.logger.logSuccess(that, 'Node ' + that.nodeConfiguration.identity.alias + ' is listening....');
        });
    }

    public async killServer(callback) {
        await Container.get(RabbitMqServiceToken).killService();
        await Container.get(VaultConnectionToken).killConnection();
        this.httpServer.close(callback);
    }

    private async applyMiddleware(): Promise<void> {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: false}));

        if (this.nodeConfiguration.isRunningTests) {
            this.logger.logWarning(this, 'Tests are running, insecure routes activated...');
            this.app.use(Container.get(TestIntegrationApiToken).getRouter());
        }

        this.app.use(Container.get(AuthenticationApiToken).getRouter());
        this.app.use(jwtVerification);
        API_REGISTER_TOKENS.forEach(token => this.app.use(Container.get(token).getRouter()));
        this.app.use((error, _, res, __) => EduErrorHandler.handleError(error, res))
    }
}
