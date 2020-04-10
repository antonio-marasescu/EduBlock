import {RabbitMqConfig} from "../../server/config/rabbit-mq.config";
import * as Amqp from "amqp-ts";
import {Queue} from "amqp-ts";
import {Token} from "typedi";
import {BasicConsumer} from "./consumers/basic.consumer";

export interface IRabbitMqService {
    getConfiguration(): RabbitMqConfig;

    createQueue(queueName: string): Promise<Queue>;

    publishMessage(message: Amqp.Message, routingKey?: string)

    bindConsumerToQueue(queueName: string, consumer: BasicConsumer<any>)

    getExchange(): Amqp.Exchange

    getConnection(): Promise<Amqp.Connection>
}

export const RabbitMqServiceToken = new Token<IRabbitMqService>('IRabbitMqService');
