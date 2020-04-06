import express, {Express} from "express";
import bodyParser from 'body-parser'
import {Inject, Service, Token} from "typedi";
import {BlockchainServiceToken, IBlockchainService} from "../services/blockchain/blockchain.service.interface";
import {NodeIdentityModel} from "../entities/identity/node-identity.model";

export const EduNodeToken = new Token<EduNode>('EduNode');

@Service(EduNodeToken)
export class EduNode {
    private app: Express;

    constructor(@Inject(BlockchainServiceToken) private eduBlockService: IBlockchainService,
                @Inject('node.identity') private nodeIdentity: NodeIdentityModel) {
        this.app = express();
    }

    public async initialize(): Promise<void> {
        console.log('Node ' + this.nodeIdentity.alias + ' is starting...');
        console.log('Type: ' + this.nodeIdentity.nodeType);
        console.log('Port: ' + this.nodeIdentity.port);
        console.log('Database Port: ' + this.nodeIdentity.dbConfig.port);
        await this.applyMiddleware();
        const that = this;
        this.app.listen(this.nodeIdentity.port, function () {
            console.log('Node ' + that.nodeIdentity.alias + ' is listening....');
        });

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
