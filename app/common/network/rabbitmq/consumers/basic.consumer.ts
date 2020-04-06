import {Message} from "amqp-ts";

export interface BasicConsumer<T> {
    consume(msg: Message): Promise<T>;
}
