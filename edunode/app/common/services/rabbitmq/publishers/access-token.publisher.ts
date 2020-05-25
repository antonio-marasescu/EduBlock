import {Container, Inject, Service, Token} from 'typedi';
import {RabbitMqService, RabbitMqServiceToken} from '../rabbit-mq.service';
import {ServerLogger, ServerLoggerToken} from '../../../logger/server-logger.interface';
import {Message} from 'amqp-ts';
import {AccessTokenConsumer, AccessTokenConsumerToken} from '../consumers/access-token.consumer';
import {AccessTokenDto} from '../../../dto/network/access-token.dto';

export const AccessTokenPublisherToken = new Token<AccessTokenPublisher>('services.rabbitmq.publishers.access-token');

@Service(AccessTokenPublisherToken)
export class AccessTokenPublisher {
    private rabbitMqService: RabbitMqService;
    private consumer: AccessTokenConsumer;

    constructor(
        @Inject(ServerLoggerToken) private logger: ServerLogger
    ) {
        this.rabbitMqService = Container.get(RabbitMqServiceToken);
        this.consumer = Container.get(AccessTokenConsumerToken);
    }

    public async publish(content: AccessTokenDto): Promise<void> {
        this.logger.logInfo(this, 'Publishing a new access token on the network...');
        const msg = new Message(content, {persistent: true});
        const routingKey = await this.consumer.getConsumerRoutingKey();
        await this.rabbitMqService.publishMessage(msg, routingKey);
        this.logger.logSuccess(this, 'The access token was published on the network...');
    }

}
