import express from "express";
import {BasicApi} from "../basic.api";
import {Inject, Service, Token} from "typedi";
import {NetworkMembersService, NetworkMembersServiceToken} from "../../../services/common/network-members.service";
import {IdentityService, IdentityServiceToken} from "../../../services/common/identity.service";

export const NetworkApiToken = new Token<NetworkApi>('network.api.network');

@Service(NetworkApiToken)
export class NetworkApi implements BasicApi {
    private readonly router: express.Router;

    constructor(
        @Inject(NetworkMembersServiceToken) private _: NetworkMembersService,
        @Inject(IdentityServiceToken) private __: IdentityService,
    ) {
        this.router = express.Router();
        this.registerRoutes();
    }

    public getRouter(): express.Router {
        return this.router;
    }

    private registerRoutes() {

    }
}
