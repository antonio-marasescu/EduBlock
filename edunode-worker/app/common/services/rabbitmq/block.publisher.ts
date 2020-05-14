import {Container, Inject, Service, Token} from "typedi";
import {RabbitMqService, RabbitMqServiceToken} from "./rabbit-mq.service";
import {ServerLogger, ServerLoggerToken} from "../../logger/server-logger.interface";
import {Message} from "amqp-ts";
import {NetworkBlockDto} from "../../dto/network-block.dto";
import {NodeConfigurationModel, NodeConfigurationModelToken} from "../../config/node-configuration.model";

export const BlockPublisherToken = new Token<BlockPublisher>('services.rabbitmq.publishers.transaction');

@Service(BlockPublisherToken)
export class BlockPublisher {
    private rabbitMqService: RabbitMqService;

    constructor(
        @Inject(NodeConfigurationModelToken) private nodeConfiguration: NodeConfigurationModel,
        @Inject(ServerLoggerToken) private logger: ServerLogger
    ) {
        this.rabbitMqService = Container.get(RabbitMqServiceToken);
    }

    public async publish(content: NetworkBlockDto): Promise<void> {
        this.logger.logInfo(this, "Publishing a new block on the network...");
        const msg = new Message(content, {persistent: true});
        const routingKey = this.nodeConfiguration.rabbitmqConfiguration.blockPublishQueue;
        await this.rabbitMqService.publishMessage(msg, routingKey);
        this.logger.logSuccess(this, "The block was published on the network...");
    }

}
