import {BasicApi} from '../basic.api';
import express from 'express';
import {Service, Token} from 'typedi';
import asyncHandler from 'express-async-handler';
import {SeederHandler} from '../../../server/seed/seeder.handler';

export const TestIntegrationApiToken = new Token<TestIntegrationApi>('api.test.integration');

@Service(TestIntegrationApiToken)
export class TestIntegrationApi implements BasicApi {
    private readonly router: express.Router;

    constructor() {
        this.router = express.Router();
        this.registerRoutes();

    }

    public getRouter(): express.Router {
        return this.router;
    }

    private registerRoutes() {
        this.router.get('/api/seed', asyncHandler(
            async (_req, res) => this.handleSeed(res)));
    }

    private async handleSeed(res) {
        const seederHandler = new SeederHandler();
        await seederHandler.seed(true);
        res.send('Seeding has finished');
    }
}
