import {Inject, Service, Token} from "typedi";
import {NetworkMapService, NetworkMapServiceToken} from "../../services/network-map.service";
import {BasicApi} from "../basic.api";
import express from "express";
import {NewNetworkMemberDto} from "../../dto/network/new-network-member.dto";

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
            (_, res) => res.send(''));
        this.router.get('/network/members',
            (req, res) => this.getAllNetworkMembers(req, res));
        this.router.get('/network/members/:publicKey',
            (req, res) => this.getNetworkMember(req, res));
        this.router.post('/network/members',
            (req, res) => this.addNetworkMember(req, res));
    }


    private async getAllNetworkMembers(_, res) {
        res.send('Not Implemented');
    }

    private async getNetworkMember(req, res) {
        const publicKey = req.params.publicKey;
        res.send('Not Implemented ' + publicKey);

    }

    private async addNetworkMember(req, res) {
        const member = new NewNetworkMemberDto();
        Object.assign(member, req.body);
        const response = await this.networkMapService.addNetworkMember(member);
        res.json(response);
    }
}
