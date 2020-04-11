import express from "express";
import {BasicApi} from "../basic.api";
import {Service, Token} from "typedi";

export const NetworkApiToken = new Token<NetworkApi>('network.api.network');

@Service(NetworkApiToken)
export class NetworkApi implements BasicApi {
    private readonly router: express.Router;

    constructor() {
        this.router = express.Router();
        this.registerRoutes();
    }

    public getRouter(): express.Router {
        return this.router;
    }

    private registerRoutes() {

    }
}
