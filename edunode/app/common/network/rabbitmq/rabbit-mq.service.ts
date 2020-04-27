import * as Amqp from "amqp-ts";
import {Queue} from "amqp-ts";
import {Container, Inject, Service, Token} from "typedi";
import {BasicConsumer} from "./consumers/basic.consumer";
import {NodeConfigurationModel, NodeConfigurationModelToken} from "../../entities/config/node-configuration.model";
import {ServerLogger, ServerLoggerToken} from "../../logger/server-logger.interface";
import CONSUMER_TOKENS from "./consumer.register";


export const RabbitMqServiceToken = new Token<RabbitMqService>('network.rabbitmq.service');

@Service(RabbitMqServiceToken)
export class RabbitMqService {
    private readonly connection: Amqp.Connection;
    private readonly exchange: Amqp.Exchange;
    private queues: { [key: string]: Queue } = {};

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

        this.logger.logInfo(this, "Creating queues and attaching consumers...");
        const tokens = CONSUMER_TOKENS;
        for (let token of tokens) {
            const consumer: BasicConsumer = Container.get(token);
            const queueName: string = await consumer.getConsumerName();
            await this.createQueue(queueName);
            await this.bindConsumerToQueue(queueName, consumer);
        }

        this.logger.logSuccess(this, "Finished creating queues and attaching consumers...");
        this.logger.logInfo(this, "Starting RabbitMQ service...");
        await this.connection.completeConfiguration();
        this.logger.logSuccess(this, "RabbitMQ service has started...");
    }

    private async bindConsumerToQueue(queueName: string, consumer: BasicConsumer, tag: string | undefined = undefined): Promise<void> {
        this.logger.logInfo(this, "Binding consumer to queue " + queueName);
        const queue = this.queues[queueName];
        if (!queue) {
            this.logger.logError(this, "Queue " + queueName + " could not be found.");
            return Promise.reject();
        }
        await queue.activateConsumer(consumer.consume, {consumerTag: tag, arguments: {}});
        this.logger.logSuccess(this, "Consumer has been bound to queue " + queueName + ".");
    }

    private async createQueue(queueName: string): Promise<Queue> {
        this.logger.logInfo(this, "Creating queue: " + queueName + "...");
        if (!this.exchange) {
            this.logger.logError(this, "No exchange could be found!");
            return Promise.reject();
        }

        this.logger.logInfo(this, "Declaring queue: " + queueName + "...");
        const queue = this.connection.declareQueue(queueName);
        this.logger.logInfo(this, "Binding queue: " + queueName + "...");
        await queue.bind(this.exchange);
        this.queues[queueName] = queue;
        this.logger.logSuccess(this, "Queue: " + queueName + " created.");
        return queue;
    }
}
