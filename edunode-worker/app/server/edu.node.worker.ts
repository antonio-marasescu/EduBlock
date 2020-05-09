import express, {Express} from "express";
import bodyParser from 'body-parser'
import {Inject, Service, Token} from "typedi";
import {ServerLogger, ServerLoggerToken} from "../common/logger/server-logger.interface";
import {NodeConfigurationModel, NodeConfigurationModelToken} from "../common/config/node-configuration.model";
import {EduWorkerErrorHandler} from "../common/errors/edu-worker.error.handler";

export const EduNodeWorkerToken = new Token<EduNodeWorker>('EduNodeWorker');

@Service(EduNodeWorkerToken)
export class EduNodeWorker {
    private app: Express;

    constructor(@Inject(NodeConfigurationModelToken) private nodeConfiguration: NodeConfigurationModel,
                @Inject(ServerLoggerToken) private logger: ServerLogger) {
        this.app = express();
    }

    public async start(): Promise<void> {

        this.logger.logInfo(this, 'Node ' + this.nodeConfiguration.identity.alias + ' is starting...');
        this.logger.logInfo(this, 'Port: ' + this.nodeConfiguration.identity.port);
        await this.applyMiddleware();
        const that = this;
        this.app.listen(this.nodeConfiguration.identity.port, async function () {
            that.logger.logSuccess(that, 'Node ' + that.nodeConfiguration.identity.alias + ' is listening....');
        });
    }

    private async applyMiddleware(): Promise<void> {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: false}));
        // API_REGISTER_TOKENS.forEach(token => this.app.use(Container.get(token).getRouter()));
        this.app.use((error, _, res, __) => EduWorkerErrorHandler.handleError(error, res))
    }
}
