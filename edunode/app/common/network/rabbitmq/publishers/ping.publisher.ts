import {BasicPublisher} from "./basic.publisher";
import {Inject} from "typedi";
import {IRabbitMqService, RabbitMqServiceToken} from "../rabbit-mq.service.interface";
import {Message} from "amqp-ts";

export class PingPublisher implements BasicPublisher<string> {
    constructor(@Inject(RabbitMqServiceToken) private rabbitMqService: IRabbitMqService) {
    }

    async publish(content: string): Promise<void> {
        const msg = new Message(content, {persistent: true, expiration: 10000});
        this.rabbitMqService.publishMessage(msg);
    }

}
