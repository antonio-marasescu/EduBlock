import {Inject, Service, Token} from "typedi";
import {Message} from "amqp-ts";
import {RabbitMqService, RabbitMqServiceToken} from "../rabbit-mq.service";
import {PingConsumer, PingConsumerToken} from "../consumers/ping.consumer";
import {ServerLogger, ServerLoggerToken} from "../../../logger/server-logger.interface";
import {createMessageCouldNotBeSentError} from "../../../errors/edu.error.factory";

export const PingPublisherToken = new Token<PingPublisher>('services.rabbitmq.publishers.ping');

@Service(PingPublisherToken)
export class PingPublisher {
    constructor(@Inject(RabbitMqServiceToken) private rabbitMqService: RabbitMqService,
                @Inject(PingConsumerToken) private consumer: PingConsumer,
                @Inject(ServerLoggerToken) private logger: ServerLogger,
    ) {
    }

    public async publish(content: string, publicKey: string): Promise<void> {
        this.logger.logInfo(this, "Starting publishing ping message...");
        if (!content) {
            const error = createMessageCouldNotBeSentError(publicKey);
            this.logger.logError(this, JSON.stringify(error));
            throw error;
        }
        const routingKey = await this.consumer.getConsumerRoutingKey({identity: publicKey});
        const msg = new Message(content, {persistent: true});
        this.logger.logInfo(this, "Publishing ping message to " + routingKey);
        await this.rabbitMqService.publishMessage(msg, routingKey);
        this.logger.logSuccess(this, "Publishing ping message was a success.");
    }
}
