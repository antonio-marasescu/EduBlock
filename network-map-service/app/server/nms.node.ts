import express, {Express} from "express";
import bodyParser from 'body-parser'
import {Container, Inject, Service, Token} from "typedi";
import {NmsConfigurationModel, NmsConfigurationModelToken} from "../common/config/nms-configuration.model";
import {NmsLogger, NmsLoggerToken} from "../common/logger/nms-logger.interface";
import {IdentityServiceToken} from "../common/services/identity.service";
import {NmsErrorHandler} from "../common/errors/nms.error.handler";
import {SeederHandler} from "./seed/seeder.handler";
import {NetworkMapServiceToken} from "../common/services/network-map.service";
import {AuthMiddlewareToken} from "./auth/auth.middleware";
import {API_REGISTER_TOKENS} from "../common/api/basic.api.register";

export const NmsNodeToken = new Token<NmsNode>('NmsNode');

@Service(NmsNodeToken)
export class NmsNode {
    private app: Express;

    constructor(@Inject(NmsConfigurationModelToken) private nodeConfiguration: NmsConfigurationModel,
                @Inject(NmsLoggerToken) private logger: NmsLogger) {
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
            const seeder = new SeederHandler();
            const networkMapService = Container.get(NetworkMapServiceToken);
            await seeder.seed(networkMapService);
        });
    }

    private async applyMiddleware(): Promise<void> {
        const authMiddleware = Container.get(AuthMiddlewareToken);

        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: false}));
        this.app.use("/", (req, res, next) => authMiddleware.validate(req, res, next));
        API_REGISTER_TOKENS.forEach(token => this.app.use(Container.get(token).getRouter()));
        this.app.use((error, _, res, __) => NmsErrorHandler.handleError(error, res))
    }
}
