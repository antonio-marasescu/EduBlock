import {Inject, Service, Token} from "typedi";
import {RabbitMqService, RabbitMqServiceToken} from "../rabbit-mq.service";
import {TransactionConsumer, TransactionConsumerToken} from "../consumers/transaction/transaction.consumer";
import {Message} from "amqp-ts";
import {NetworkTransactionDto} from "../../../dto/network/blockchain/network-transaction.dto";
import {ServerLogger, ServerLoggerToken} from "../../../logger/server-logger.interface";

export const TransactionPublisherToken = new Token<TransactionPublisher>('network.rabbitmq.publisher.transaction');

@Service(TransactionPublisherToken)
export class TransactionPublisher {
    constructor(@Inject(RabbitMqServiceToken) private rabbitMqService: RabbitMqService,
                @Inject(TransactionConsumerToken) private consumer: TransactionConsumer,
                @Inject(ServerLoggerToken) private logger: ServerLogger,
    ) {
    }

    public async publish(content: NetworkTransactionDto): Promise<void> {
        this.logger.logInfo(this, "Publishing a new transaction on the network...");
        const msg = new Message(content, {persistent: true});
        const routingKey = await this.consumer.getConsumerRoutingKey();
        await this.rabbitMqService.publishMessage(msg, routingKey);
        this.logger.logSuccess(this, "The transaction was published on the network...");
    }

}
