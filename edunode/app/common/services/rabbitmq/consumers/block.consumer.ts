import {Inject, Service, Token} from "typedi";
import {BasicConsumer} from "./basic.consumer";
import {Message} from "amqp-ts";
import {IdentityService, IdentityServiceToken} from "../../security/identity.service";

export const BlockConsumerToken = new Token<BlockConsumer>('services.rabbitmq.consumers.block');

@Service(BlockConsumerToken)
export class BlockConsumer implements BasicConsumer {
    private identity: string;

    constructor(@Inject(IdentityServiceToken) private identityService: IdentityService) {
    }

    public async consume(message: Message): Promise<void> {
        console.log(message.getContent());
        message.ack();
    }

    public async getConsumerName(): Promise<string> {
        if (!this.identity) {
            this.identity = await this.identityService.getPersonalIdentity();
        }
        return this.identity + "." + await this.getConsumerRoutingKey();
    }

    public async getConsumerRoutingKey(): Promise<string> {
        return 'block-consumer';
    }

}
