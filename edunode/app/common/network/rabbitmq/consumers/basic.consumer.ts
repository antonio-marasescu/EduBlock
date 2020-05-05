import {Message} from "amqp-ts";

export interface BasicConsumer {
    getConsumerName(): Promise<string>;

    getConsumerRoutingKey(options?: any): Promise<string>;

    consume(message: Message): Promise<void>;
}
