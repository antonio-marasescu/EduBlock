import {Inject, Service, Token} from "typedi";
import {Message} from "amqp-ts";
import {RabbitMqService, RabbitMqServiceToken} from "../rabbit-mq.service";
import {PingConsumer, PingConsumerToken} from "../consumers/ping/ping.consumer";

export const PingPublisherToken = new Token<PingPublisher>('network.rabbitmq.publisher.ping');

@Service(PingPublisherToken)
export class PingPublisher {
    constructor(@Inject(RabbitMqServiceToken) private rabbitMqService: RabbitMqService,
                @Inject(PingConsumerToken) private consumer: PingConsumer) {
    }

    public async publish(content: string, publicKey: string): Promise<void> {
        const msg = new Message(content, {persistent: true, expiration: 10000});
        const routingKey = publicKey + this.consumer.getConsumerExtension();
        await this.rabbitMqService.publishMessage(msg, routingKey);
    }


    public async massPublish(content: string) {
        const msg = new Message(content, {persistent: true, expiration: 10000});
        await this.rabbitMqService.publishMessage(msg);
    }
}
