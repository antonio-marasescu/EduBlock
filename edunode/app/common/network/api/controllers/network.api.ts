import express from "express";
import {BasicApi} from "../basic.api";
import {Inject, Service, Token} from "typedi";
import {NetworkMembersService, NetworkMembersServiceToken} from "../../../services/common/network-members.service";
import {IdentityService, IdentityServiceToken} from "../../../services/security/identity.service";
import {EduNewNetworkMemberDto} from "../../../dto/network/edu-new-network-member.dto";
import asyncHandler from 'express-async-handler';

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
            asyncHandler(async (req, res) => this.handleGetPersonalIdentity(req, res)));
        this.router.get('/network/members',
            asyncHandler(async (req, res) => this.handleGetNetworkMembers(req, res)));
        this.router.get('/network/members/well-known',
            asyncHandler(async (req, res) => this.handleGetWellKnownNetworkMembers(req, res)));
        this.router.get('/network/members/learn',
            asyncHandler(async (req, res) => this.handleLearnNetworkMembers(req, res)));
        this.router.post('/network/members',
            asyncHandler(async (req, res) => this.handleAddNetworkMember(req, res)));
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

    private async handleAddNetworkMember(req, res) {
        const member = new EduNewNetworkMemberDto();
        Object.assign(member, req.body);
        const response = await this.networkMembersService.addMember(member);
        res.send(response);
    }
}
