import {BasicApi} from "../basic.api";
import express from "express";
import {Inject, Service, Token} from "typedi";
import {BlockchainService, BlockchainServiceToken} from "../../../services/ledger/blockchain.service";

export const BlockchainApiToken = new Token<BlockchainApi>('network.api.blockchain');

@Service(BlockchainApiToken)
export class BlockchainApi implements BasicApi {
    private readonly router: express.Router;

    constructor(@Inject(BlockchainServiceToken) private blockchainService: BlockchainService) {
        this.router = express.Router();
        this.registerRoutes();
    }

    public getRouter(): express.Router {
        return this.router;
    }

    private registerRoutes() {
    }
}
