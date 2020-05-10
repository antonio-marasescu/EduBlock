import {Container, Inject, Service, Token} from "typedi";
import {BasicConsumer} from "./basic.consumer";
import {Message} from "amqp-ts";
import {IdentityService, IdentityServiceToken} from "../../security/identity.service";
import {ServerLoggerToken} from "../../../logger/server-logger.interface";
import {BlockchainServiceToken} from "../../ledger/blockchain.service";
import {TransactionConsumerToken} from "./transaction.consumer";
import {NetworkBlockDto} from "../../../dto/network/blockchain/network-block.dto";

export const BlockConsumerToken = new Token<BlockConsumer>('services.rabbitmq.consumers.block');

@Service(BlockConsumerToken)
export class BlockConsumer implements BasicConsumer {
    private identity: string;

    constructor(@Inject(IdentityServiceToken) private identityService: IdentityService) {
    }

    public async consume(message: Message): Promise<void> {
        const logger = Container.get(ServerLoggerToken);
        const consumer = Container.get(TransactionConsumerToken);
        const service = Container.get(BlockchainServiceToken);
        logger.logInfo(consumer, "Consuming Adding Network Block message....");
        const content: NetworkBlockDto = new NetworkBlockDto();
        Object.assign(content, message.getContent());
        logger.logInfo(consumer, JSON.stringify(content));
        service.addBlock(content).then(() => logger.logSuccess(consumer, "Message Network Block has been consumed.."));
        message.ack();
    }

    public async getConsumerName(): Promise<string> {
        if (!this.identity) {
            this.identity = await this.identityService.getPersonalIdentity();
        }
        return this.identity + "." + await this.getConsumerRoutingKey();
    }

    public async getConsumerRoutingKey(): Promise<string> {
        return 'block-consumer';
    }

}
