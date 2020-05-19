import {BasicApi} from '../basic.api';
import express from 'express';
import {Inject, Service, Token} from 'typedi';
import {BlockchainService, BlockchainServiceToken} from '../../services/ledger/blockchain.service';
import asyncHandler from 'express-async-handler';
import {CreateTransactionDto} from '../../dto/common/create-transaction.dto';
import {NetworkBlockDto} from '../../dto/network/blockchain/network-block.dto';
import {createInvalidRequestParamsError} from '../../errors/edu.error.factory';
import {NetworkTransactionDto} from '../../dto/network/blockchain/network-transaction.dto';

export const BlockchainApiToken = new Token<BlockchainApi>('api.routes.blockchain');

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
        this.router.post('/api/blockchain/transactions',
            asyncHandler(async (req, res) => this.handleCreateTransaction(req, res)));
        this.router.post('/api/blockchain',
            asyncHandler(async (_req, res) => this.handleManualBlockCreation(res)));
        this.router.get('/api/blockchain',
            asyncHandler(async (_req, res) => this.handleGetBlockChain(res)));
        this.router.get('/api/blockchain/transactions',
            asyncHandler(async (_req, res) => this.handleGetTransactions(res)));
        this.router.get('/api/blockchain/transactions/:hashId',
            asyncHandler(async (req, res) => this.handleGetTransactionByHash(req, res)));
        this.router.get('/api/blockchain/:hashId',
            asyncHandler(async (req, res) => this.handleGetBlockByHash(req, res)));
    }

    private async handleCreateTransaction(req, res) {
        const createTransactionDto = new CreateTransactionDto();
        Object.assign(createTransactionDto, req.body);
        const transactionEntity = await this.blockchainService.createTransaction(createTransactionDto);
        res.json(transactionEntity);
    }

    private async handleManualBlockCreation(res) {
        const blockIndex: number = await this.blockchainService.createBlock();
        res.json({index: blockIndex});
    }

    private async handleGetBlockChain(res) {
        const blockChain: NetworkBlockDto[] = await this.blockchainService.getBlockChain();
        res.json(blockChain);
    }

    private async handleGetBlockByHash(req, res) {
        const hashId: string = req.params.hashId;
        if (!hashId) {
            throw createInvalidRequestParamsError('hashId');
        }
        const block: NetworkBlockDto = await this.blockchainService.getBlockByHash(hashId);
        res.json(block);
    }

    private async handleGetTransactions(res) {
        const transactions: NetworkTransactionDto[] = await this.blockchainService.getAllTransactions();
        res.json(transactions);
    }

    private async handleGetTransactionByHash(req, res) {
        const hashId: string = req.params.hashId;
        if (!hashId) {
            throw createInvalidRequestParamsError('hashId');
        }
        const transaction: NetworkTransactionDto = await this.blockchainService.getTransactionDetailsByHash(hashId);
        res.json(transaction);
    }
}
