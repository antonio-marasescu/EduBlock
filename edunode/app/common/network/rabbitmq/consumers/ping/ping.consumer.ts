import {BasicConsumer} from "../basic.consumer";
import {Message} from "amqp-ts";
import {Container, Inject, Service, Token} from "typedi";
import {IdentityService, IdentityServiceToken} from "../../../../services/security/identity.service";
import {ServerLoggerToken} from "../../../../logger/server-logger.interface";

export const PingConsumerToken = new Token<PingConsumer>('network.rabbitmq.consumers.ping');
const extension = ".ping-consumer";

@Service(PingConsumerToken)
export class PingConsumer implements BasicConsumer {
    private identity: string;

    constructor(@Inject(IdentityServiceToken) private identityService: IdentityService) {
    }

    public async consume(message: Message): Promise<void> {
        const logger = Container.get(ServerLoggerToken);
        const consumer = Container.get(PingConsumerToken);
        logger.logInfo(consumer, "Consuming ping message....");
        const data: string = message.getContent();
        logger.logInfo(consumer, "Data received: " + data);
        message.ack();
    }

    public async getConsumerName(): Promise<string> {
        if (!this.identity) {
            this.identity = await this.identityService.getPersonalIdentity();
        }
        return this.identity + extension;
    }

    public async getConsumerRoutingKey(options?: { identity: string }): Promise<string> {

        if (options)
            return options.identity + extension;

        if (!this.identity) {
            this.identity = await this.identityService.getPersonalIdentity();
        }
        return this.identity + extension;
    }
}
