import express, {Express} from "express";
import bodyParser from 'body-parser'
import {Container, Inject, Service, Token} from "typedi";
import {BlockchainServiceToken, IBlockchainService} from "../services/blockchain/blockchain.service.interface";
import {NodeIdentityModel, NodeIdentityModelToken} from "./models/node-identity.model";
import {VaultConnection, VaultConnectionToken} from "./db/vault.connection";
import {EccService, EccServiceToken} from "../services/security/ecc.service";
import {IdentityServiceToken} from "../services/common/identity.service";
import DIExecutor from "./di/di.executor";

export const EduNodeToken = new Token<EduNode>('EduNode');

@Service(EduNodeToken)
export class EduNode {
    private app: Express;

    constructor(@Inject(BlockchainServiceToken) private eduBlockService: IBlockchainService,
                @Inject(NodeIdentityModelToken) private nodeIdentity: NodeIdentityModel,
                @Inject(VaultConnectionToken) private vaultConnection: VaultConnection,
                @Inject(EccServiceToken) private eccService: EccService) {
        this.app = express();
    }

    public async start(): Promise<void> {

        console.log('Node ' + this.nodeIdentity.alias + ' is starting...');
        console.log('\t\tType: ' + this.nodeIdentity.nodeType);
        console.log('\t\tPort: ' + this.nodeIdentity.port);
        console.log('\t\tDatabase Port: ' + this.nodeIdentity.dbConfig.port);

        await this.applyMiddleware();
        const that = this;
        this.app.listen(this.nodeIdentity.port, async function () {
            await that.applyInitialization();
            console.log('Node ' + that.nodeIdentity.alias + ' is listening....');
        });
    }

    private async applyInitialization(): Promise<void> {
        await this.vaultConnection.initializeConnection();
        await this.eccService.initializeService();
        const di = new DIExecutor();
        di.executeExternal(null);
        const identity = await Container.get(IdentityServiceToken).checkOrGenerateIdentity();
        console.log("Identity (Public Key): " + identity);
    }

    private async applyMiddleware(): Promise<void> {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: false}));
        const router = express.Router();
        router.get('/blockchain', async (_, res) => {
            res.json(await this.eduBlockService.getBlockchain())
        });
        this.app.use(router);
    }
}
