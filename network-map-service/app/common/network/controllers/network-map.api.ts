import {Inject, Service, Token} from "typedi";
import {NetworkMapService, NetworkMapServiceToken} from "../../services/network-map.service";
import {BasicApi} from "../basic.api";
import express from "express";
import {NewNetworkMemberDto} from "../../dto/network/new-network-member.dto";
import {NetworkMemberDto} from "../../dto/network/network-member.dto";
import asyncHandler from 'express-async-handler';

export const NetworkMapApiToken = new Token<NetworkMapApi>('network.api.network-map');

@Service(NetworkMapApiToken)
export class NetworkMapApi implements BasicApi {
    private readonly router: express.Router;

    constructor(@Inject(NetworkMapServiceToken) private networkMapService: NetworkMapService) {
        this.router = express.Router();
        this.registerRoutes();
    }

    public getRouter(): express.Router {
        return this.router;
    }

    private registerRoutes() {
        this.router.get('/network/healthcheck',
            asyncHandler(async (_, res) => res.send('')));
        this.router.get('/network/members',
            asyncHandler(async (req, res) => this.getAllNetworkMembers(req, res)));
        this.router.get('/network/members/:publicKey',
            asyncHandler(async (req, res) => this.getNetworkMember(req, res)));
        this.router.post('/network/members',
            asyncHandler(async (req, res) => this.addNetworkMember(req, res)));
    }


    private async getAllNetworkMembers(_, res) {
        const response: NetworkMemberDto[] = await this.networkMapService.getAllNetworkMembers();
        res.json(response);
    }

    private async getNetworkMember(req, res) {
        const publicKey: string = req.params.publicKey;
        const response: NetworkMemberDto = await this.networkMapService.findNetworkMember(publicKey);
        res.json(response);

    }

    private async addNetworkMember(req, res) {
        const member = new NewNetworkMemberDto();
        Object.assign(member, req.body);
        const response: NetworkMemberDto = await this.networkMapService.addNetworkMember(member);
        res.json(response);
    }
}
