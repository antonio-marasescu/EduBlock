import {Container, Inject, Service, Token} from "typedi";
import {BasicConsumer} from "./basic.consumer";
import {IdentityService, IdentityServiceToken} from "../../security/identity.service";
import {Message} from "amqp-ts";
import {ServerLoggerToken} from "../../../logger/server-logger.interface";
import {NetworkTransactionDto} from "../../../dto/network/blockchain/network-transaction.dto";
import {BlockchainServiceToken} from "../../ledger/blockchain.service";

export const TransactionConsumerToken = new Token<TransactionConsumer>('services.rabbitmq.consumers.transaction');

@Service(TransactionConsumerToken)
export class TransactionConsumer implements BasicConsumer {
    private identity: string;

    constructor(@Inject(IdentityServiceToken) private identityService: IdentityService) {
    }

    public async consume(message: Message): Promise<void> {
        const logger = Container.get(ServerLoggerToken);
        const consumer = Container.get(TransactionConsumerToken);
        const service = Container.get(BlockchainServiceToken);
        logger.logInfo(consumer, "Consuming Adding Transaction message....");
        const content: NetworkTransactionDto = new NetworkTransactionDto();
        Object.assign(content, message.getContent());
        logger.logInfo(consumer, JSON.stringify(content));
        service.addTransaction(content).then(() => logger.logSuccess(consumer, "Message Adding Transaction has been consumed.."));
        message.ack();
    }

    public async getConsumerName(): Promise<string> {
        if (!this.identity) {
            this.identity = await this.identityService.getPersonalIdentity();
        }
        return this.identity + "." + await this.getConsumerRoutingKey();
    }

    public async getConsumerRoutingKey(): Promise<string> {
        return "transaction-consumer";
    }
}
