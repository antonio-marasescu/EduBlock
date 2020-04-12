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
        @Inject(NetworkMembersServiceToken) private networkMembersService: NetworkMembersService,
        @Inject(IdentityServiceToken) private identityService: IdentityService
    ) {
        this.router = express.Router();
        this.registerRoutes();
    }

    public getRouter(): express.Router {
        return this.router;
    }

    private registerRoutes() {
        this.router.get('/network/identity/me',
            (req, res) => this.handleGetPersonalIdentity(req, res));
        this.router.get('/network/members',
            (req, res) => this.handleGetNetworkMembers(req, res));
        this.router.get('/network/members/well-known',
            (req, res) => this.handleGetWellKnownNetworkMembers(req, res));
        this.router.get('/network/members/learn',
            (req, res) => this.handleLearnNetworkMembers(req, res));
        this.router.post('/network/members',
            (req, res) => this.handleAddNetworkMember(req, res));
    }

    private async handleGetPersonalIdentity(_, res) {
        const identity = await this.identityService.getPersonalIdentity();
        res.send({identity});
    }

    private async handleGetNetworkMembers(_, res) {
        const members = await this.networkMembersService.getNetworkMembers();
        res.send(members);
    }

    private async handleGetWellKnownNetworkMembers(_, response) {
        const members = await this.networkMembersService.getWellKnownNetworkMembers();
        response.send(members);
    }

    private async handleLearnNetworkMembers(_, res) {
        const data = await this.networkMembersService.learnMembers();
        res.send(data);
    }

    private async handleAddNetworkMember(_, res) {
        const member = await this.networkMembersService.addMember();
        res.send(member);
    }
}
