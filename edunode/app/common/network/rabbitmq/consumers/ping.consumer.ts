import {BasicConsumer} from "./basic.consumer";
import {Message} from "amqp-ts";

export class PingConsumer implements BasicConsumer<string> {
    async consume(msg: Message): Promise<string> {
        const data: string = msg.getContent();
        console.log("Data received: " + data);
        return data;
    }
}
