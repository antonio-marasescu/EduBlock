import express from "express";
import {BasicApi} from "../basic.api";
import {Inject, Service, Token} from "typedi";
import {NetworkMembersService, NetworkMembersServiceToken} from "../../../services/common/network-members.service";
import {IdentityService, IdentityServiceToken} from "../../../services/security/identity.service";
import {EduNewNetworkMemberDto} from "../../../dto/network/edu-new-network-member.dto";
import asyncHandler from 'express-async-handler';
import {createInvalidRequestParamsError} from "../../../errors/edu.error.factory";

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
        this.router.get('/network/members/:publicKey',
            asyncHandler(async (req, res) => this.handleGetNetworkMember(req, res)));
        this.router.get('/network/members/:publicKey/ping',
            asyncHandler(async (req, res) => this.handlePingMember(req, res)));
        this.router.post('/network/members',
            asyncHandler(async (req, res) => this.handleAddNetworkMember(req, res)));
        this.router.get('/network/learn',
            asyncHandler(async (req, res) => this.handleLearnNetworkMembers(req, res)));
    }

    private async handleGetPersonalIdentity(_, res) {
        const identity = await this.identityService.getPersonalIdentity();
        res.json({identity});
    }

    private async handleGetNetworkMembers(_, res) {
        const members = await this.networkMembersService.getNetworkMembers();
        res.json(members);
    }

    private async handleGetNetworkMember(req, res) {
        const publicKey: string = req.params.publicKey;
        if (!publicKey) {
            throw createInvalidRequestParamsError('publicKey');
        }
        const members = await this.networkMembersService.getSingleNetworkMember(publicKey);
        res.json(members);
    }

    private async handleLearnNetworkMembers(_, res) {
        const data = await this.networkMembersService.learnMembers();
        res.json(data);
    }

    private async handleAddNetworkMember(req, res) {
        const member = new EduNewNetworkMemberDto();
        Object.assign(member, req.body);
        const response = await this.networkMembersService.addMember(member);
        res.json(response);
    }

    private async handlePingMember(req, _) {
        const publicKey: string = req.params.publicKey;
        if (!publicKey) {
            throw createInvalidRequestParamsError('publicKey');
        }
    }
}
