import {BasicApi} from "../basic.api";
import express from "express";
import {Inject, Service, Token} from "typedi";
import {BlockchainService, BlockchainServiceToken} from "../../../services/ledger/blockchain.service";
import asyncHandler from "express-async-handler";
import {CreateTransactionDto} from "../../../dto/common/create-transaction.dto";

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
        this.router.post('/blockchain/transactions',
            asyncHandler(async (req, res) => this.handleCreateTransaction(req, res)));
    }

    private async handleCreateTransaction(req, res) {
        const createTransactionDto = new CreateTransactionDto();
        Object.assign(createTransactionDto, req.body);
        const transactionEntity = await this.blockchainService.createTransaction(createTransactionDto);
        res.json(transactionEntity);
    }
}
