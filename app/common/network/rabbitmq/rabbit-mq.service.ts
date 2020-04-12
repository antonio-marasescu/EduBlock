import * as Amqp from "amqp-ts";
import {Queue} from "amqp-ts";
import {Inject, Service} from "typedi";
import {RabbitMqConfig} from "./rabbit-mq.config";
import {IRabbitMqService, RabbitMqServiceToken} from "./rabbit-mq.service.interface";
import {BasicConsumer} from "./consumers/basic.consumer";

@Service(RabbitMqServiceToken)
export class RabbitMqService implements IRabbitMqService {
    private readonly connection: Amqp.Connection;
    private readonly exchange: Amqp.Exchange;
    private queues: { [key: string]: Queue } = {};

    constructor(@Inject('rabbitmq.config') private configuration: RabbitMqConfig) {
        this.connection = new Amqp.Connection(configuration.url);
        this.exchange = this.connection.declareExchange(configuration.exchangeName, 'fanout');
    }

    public getConfiguration(): RabbitMqConfig {
        return this.configuration;
    }

    public getExchange(): Amqp.Exchange {
        return this.exchange;
    }

    public async createQueue(queueName: string): Promise<Queue> {
        if (!this.exchange)
            return Promise.reject();
        const queue = this.connection.declareQueue(queueName);
        await queue.bind(this.exchange);
        this.queues[queueName] = queue;
        return queue;
    }

    public async publishMessage(message: Amqp.Message, routingKey: string = '') {
        this.exchange.send(message, routingKey);
    }

    public async bindConsumerToQueue(queueName: string, consumer: BasicConsumer<any>,
                                     tag: string | undefined = undefined) {
        const queue = this.queues[queueName];
        if (!queue)
            return Promise.reject();
        await queue.activateConsumer(consumer.consume, {consumerTag: tag})
    }

    public async getConnection(): Promise<Amqp.Connection> {
        await this.connection.completeConfiguration();
        return this.connection;
    }
}
