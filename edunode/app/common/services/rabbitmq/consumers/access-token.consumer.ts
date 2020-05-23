import {Container, Inject, Service, Token} from 'typedi';
import {BasicConsumer} from './basic.consumer';
import {IdentityService, IdentityServiceToken} from '../../security/identity.service';
import {Message} from 'amqp-ts';
import {ServerLoggerToken} from '../../../logger/server-logger.interface';
import {TransactionConsumerToken} from './transaction.consumer';
import {AccessTokenDto} from '../../../dto/network/access-token.dto';
import {AuthenticationService} from '../../auth/authentication.service';

export const AccessTokenConsumerToken = new Token<AccessTokenConsumer>('services.rabbitmq.consumers.access-token');

@Service(AccessTokenConsumerToken)
export class AccessTokenConsumer implements BasicConsumer {
    private identity: string;

    constructor(@Inject(IdentityServiceToken) private identityService: IdentityService) {
    }

    public async consume(message: Message): Promise<void> {
        const logger = Container.get(ServerLoggerToken);
        const consumer = Container.get(TransactionConsumerToken);
        const service = Container.get(AuthenticationService);
        logger.logInfo(consumer, 'Consuming Access Token Modification message....');
        const content: AccessTokenDto = new AccessTokenDto();
        Object.assign(content, message.getContent());
        logger.logInfo(consumer, JSON.stringify(content));
        service.addAuthorizationToIdentity(content)
            .then(() => logger.logSuccess(this, 'Access token message has been consumed!'));
        message.ack();
    }

    public async getConsumerName(): Promise<string> {
        if (!this.identity) {
            this.identity = await this.identityService.getPersonalIdentity();
        }
        return this.identity + '.' + await this.getConsumerRoutingKey();
    }

    public async getConsumerRoutingKey(): Promise<string> {
        return 'access-token';
    }

}
