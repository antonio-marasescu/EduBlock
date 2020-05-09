import {Inject, Service, Token} from "typedi";
import {BasicApi} from "../basic.api";
import express from "express";
import asyncHandler from 'express-async-handler';
import {NetworkBlockDto} from "../../dto/network-block.dto";
import {BlockchainService, BlockchainServiceToken} from "../../services/ledger/blockchain.service";

export const EdunodeWorkerApiToken = new Token<EdunodeWorkerApi>('api.routes.network-map');

@Service(EdunodeWorkerApiToken)
export class EdunodeWorkerApi implements BasicApi {
    private readonly router: express.Router;

    constructor(
        @Inject(BlockchainServiceToken) private blockchainService: BlockchainService
    ) {
        this.router = express.Router();
        this.registerRoutes();
    }

    public getRouter(): express.Router {
        return this.router;
    }

    private registerRoutes() {
        this.router.post('/blockchain',
            asyncHandler(async (req, res) => this.createBlock(req, res)));
    }

    private async createBlock(req, res) {
        const block = new NetworkBlockDto();
        Object.assign(block, req.body);
        // noinspection ES6MissingAwait
        this.blockchainService.createBlock(block);
        res.json({message: "Started working on the block."});
    }
}
