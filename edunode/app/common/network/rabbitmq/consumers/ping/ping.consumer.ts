import {BasicConsumer} from "../basic.consumer";
import {Message} from "amqp-ts";
import {Container, Inject, Service, Token} from "typedi";
import {IdentityService, IdentityServiceToken} from "../../../../services/security/identity.service";

export const PingConsumerToken = new Token<PingConsumer>('consumers.ping');

@Service(PingConsumerToken)
export class PingConsumer implements BasicConsumer {
    private identity: string;

    constructor(@Inject(IdentityServiceToken) private identityService: IdentityService) {
    }

    public async consume(message: Message): Promise<void> {
        const consumer = Container.get(PingConsumerToken);
        const messageKey = message.fields.routingKey;
        const consumerName = await consumer.getConsumerName();
        if (!messageKey || consumerName == messageKey) {
            const data: string = message.getContent();
            console.log("Data received: " + data);
        }
    }

    public async getConsumerName(): Promise<string> {
        if (!this.identity) {
            this.identity = await this.identityService.getPersonalIdentity();
        }
        return this.identity + this.getConsumerExtension();
    }

    public getConsumerExtension(): string {
        return ".ping-consumer";
    }
}
