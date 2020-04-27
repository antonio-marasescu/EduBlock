import {BasicApi} from "../basic.api";
import express from "express";
import asyncHandler from "express-async-handler";
import {Inject, Service, Token} from "typedi";
import {PingPublisher, PingPublisherToken} from "../../rabbitmq/publishers/ping.publisher";
import {createInvalidRequestParamsError} from "../../../errors/edu.error.factory";
import {BasicMessageDto} from "../../../dto/network/basic-message.dto";

export const P2pCommunicationApiToken = new Token<P2pCommunicationApi>('network.api.p2p-communication');

@Service(P2pCommunicationApiToken)
export class P2pCommunicationApi implements BasicApi {

    private readonly router: express.Router;

    constructor(@Inject(PingPublisherToken) private pingPublisher: PingPublisher) {
        this.router = express.Router();
        this.registerRoutes();
    }

    public getRouter(): express.Router {
        return this.router;
    }

    private registerRoutes() {
        this.router.post('/p2p/messages/:publicKey',
            asyncHandler(async (req, res) => this.handleSendMessage(req, res)));
        this.router.post('/p2p/messages',
            asyncHandler(async (req, res) => this.handleBroadcastMessage(req, res)));
    }

    private async handleSendMessage(req, res) {
        const publicKey: string = req.params.publicKey;
        if (!publicKey) {
            throw createInvalidRequestParamsError('publicKey');
        }
        const message = new BasicMessageDto();
        Object.assign(message, req.body);
        await this.pingPublisher.publish(message.content, publicKey);
        res.json({});
    }

    private async handleBroadcastMessage(req, res) {
        const message = new BasicMessageDto();
        Object.assign(message, req.body);
        await this.pingPublisher.massPublish(message.content);
        res.json({});
    }
}
