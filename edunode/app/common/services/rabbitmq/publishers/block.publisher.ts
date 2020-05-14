import {Container, Inject, Service, Token} from "typedi";
import {RabbitMqService, RabbitMqServiceToken} from "../rabbit-mq.service";
import {ServerLogger, ServerLoggerToken} from "../../../logger/server-logger.interface";
import {Message} from "amqp-ts";
import {BlockConsumer, BlockConsumerToken} from "../consumers/block.consumer";
import {NetworkBlockDto} from "../../../dto/network/blockchain/network-block.dto";

export const BlockPublisherToken = new Token<BlockPublisher>('services.rabbitmq.publishers.transaction');

@Service(BlockPublisherToken)
export class BlockPublisher {
    private rabbitMqService: RabbitMqService;
    private consumer: BlockConsumer;

    constructor(
        @Inject(ServerLoggerToken) private logger: ServerLogger
    ) {
        this.rabbitMqService = Container.get(RabbitMqServiceToken);
        this.consumer = Container.get(BlockConsumerToken);
    }

    public async publish(content: NetworkBlockDto): Promise<void> {
        this.logger.logInfo(this, "Publishing a new block on the network...");
        const msg = new Message(content, {persistent: true});
        const routingKey = await this.consumer.getConsumerRoutingKey();
        await this.rabbitMqService.publishMessage(msg, routingKey);
        this.logger.logSuccess(this, "The block was published on the network...");
    }

}
