import {BasicApi} from '../basic.api';
import express from 'express';
import {Inject, Service, Token} from 'typedi';
import asyncHandler from 'express-async-handler';
import {SeederService, SeederServiceToken} from '../../services/common/seeder.service';

export const TestIntegrationApiToken = new Token<TestIntegrationApi>('api.test.integration');

@Service(TestIntegrationApiToken)
export class TestIntegrationApi implements BasicApi {
    private readonly router: express.Router;

    constructor(
        @Inject(SeederServiceToken) private seederService: SeederService
    ) {
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
        await this.seederService.seed();
        res.send('Seeding has finished');
    }
}
