import {Message} from "amqp-ts";

export interface BasicConsumer {
    getConsumerName(): Promise<string>;

    getConsumerExtension(): string;

    consume(message: Message): Promise<void>;
}
