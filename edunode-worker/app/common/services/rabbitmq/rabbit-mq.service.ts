import * as Amqp from "amqp-ts";
import {Inject, Service, Token} from "typedi";
import {ServerLogger, ServerLoggerToken} from "../../logger/server-logger.interface";
import {NodeConfigurationModel, NodeConfigurationModelToken} from "../../config/node-configuration.model";


export const RabbitMqServiceToken = new Token<RabbitMqService>('services.rabbitmq.service');

@Service(RabbitMqServiceToken)
export class RabbitMqService {
    private readonly connection: Amqp.Connection;
    private readonly exchange: Amqp.Exchange;

    constructor(
        @Inject(NodeConfigurationModelToken) nodeConfiguration: NodeConfigurationModel,
        @Inject(ServerLoggerToken) private logger: ServerLogger) {

        this.connection = new Amqp.Connection(nodeConfiguration.rabbitmqConfiguration.url);
        this.exchange = this.connection.declareExchange(
            nodeConfiguration.rabbitmqConfiguration.exchangeName,
            nodeConfiguration.rabbitmqConfiguration.exchangeType);
    }

    public async publishMessage(message: Amqp.Message, routingKey: string = ''): Promise<void> {
        this.exchange.send(message, routingKey);
    }


    public async initializeService(): Promise<void> {
        this.logger.logInfo(this, "Initializing RabbitMQ Service...");
        await this.connection.completeConfiguration();
        this.logger.logSuccess(this, "RabbitMQ service has started...");
    }
}
